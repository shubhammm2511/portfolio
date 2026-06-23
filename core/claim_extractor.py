import json
import re
from google import genai
from google.genai import types


EXTRACTION_PROMPT = """You are an expert fact-checker. Analyze the following document text and extract ALL specific, verifiable factual claims.

Focus on:
- Statistics and numerical data (percentages, dollar amounts, counts)
- Specific dates and timelines
- Financial figures (revenue, market cap, valuations, growth rates)
- Technical specifications and performance metrics
- Named entity claims (company rankings, market positions)
- Historical facts and events

For EACH claim, provide:
1. "claim" - The exact factual claim as stated in the document
2. "category" - One of: "statistic", "date", "financial", "technical", "ranking", "general_fact"
3. "source_context" - The surrounding sentence/paragraph for context
4. "search_query" - An optimized web search query to verify this claim

Return ONLY a valid JSON array. No markdown, no code fences, no explanation.
Example format:
[
  {
    "claim": "Global AI market reached $150 billion in 2023",
    "category": "financial",
    "source_context": "The global AI market reached $150 billion in 2023, growing at 35% CAGR.",
    "search_query": "global AI market size 2023 revenue"
  }
]

DOCUMENT TEXT:
{document_text}
"""


def extract_claims(document_text: str, api_key: str) -> list[dict]:
    """
    Use Gemini to extract verifiable claims from document text.
    Returns a list of claim dicts.
    """
    client = genai.Client(api_key=api_key)

    prompt = EXTRACTION_PROMPT.format(document_text=document_text)

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            temperature=0.1,
            max_output_tokens=8192,
        ),
    )

    raw = response.text.strip()

    # Clean markdown fences if present
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)
    raw = raw.strip()

    try:
        claims = json.loads(raw)
        if isinstance(claims, list):
            return claims
        return []
    except json.JSONDecodeError:
        # Try to find JSON array in the response
        match = re.search(r'\[.*\]', raw, re.DOTALL)
        if match:
            try:
                return json.loads(match.group())
            except json.JSONDecodeError:
                return []
        return []
