import json
import re
from google import genai
from google.genai import types


VERDICT_PROMPT = """You are an expert fact-checker. Your job is to determine the accuracy of a factual claim based on web search evidence.

CLAIM: {claim}

CONTEXT FROM DOCUMENT: {context}

WEB SEARCH EVIDENCE:
{evidence}

Analyze the claim against the evidence and provide your verdict.

Rules:
- "Verified" = The claim is accurate and matches current, reliable data.
- "Inaccurate" = The claim contains errors, outdated information, or wrong numbers. You MUST provide the correct/updated value.
- "False" = The claim is fabricated, no credible evidence supports it, or it contradicts all available evidence.
- "Unverifiable" = Not enough evidence found to make a determination.

Return ONLY valid JSON (no markdown, no code fences):
{{
  "verdict": "Verified" or "Inaccurate" or "False" or "Unverifiable",
  "confidence": 0.0 to 1.0,
  "explanation": "Brief explanation of your reasoning",
  "correct_info": "The correct/updated fact if claim is Inaccurate, otherwise null",
  "sources": ["list of relevant source URLs from the evidence"]
}}
"""


def verify_claim(claim_data: dict, api_key: str) -> dict:
    """
    Verify a single claim using Gemini and web search evidence.
    Returns the claim_data enriched with verdict information.
    """
    client = genai.Client(api_key=api_key)

    claim_text = claim_data.get("claim", "")
    context = claim_data.get("source_context", "")
    evidence = claim_data.get("search_results", {}).get("raw_snippets", "No evidence found.")

    prompt = VERDICT_PROMPT.format(
        claim=claim_text,
        context=context,
        evidence=evidence,
    )

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.1,
                max_output_tokens=2048,
            ),
        )

        raw = response.text.strip()
        raw = re.sub(r"^```(?:json)?\s*", "", raw)
        raw = re.sub(r"\s*```$", "", raw)
        raw = raw.strip()

        verdict = json.loads(raw)

        result = dict(claim_data)
        result["verdict"] = verdict.get("verdict", "Unverifiable")
        result["confidence"] = verdict.get("confidence", 0.0)
        result["explanation"] = verdict.get("explanation", "")
        result["correct_info"] = verdict.get("correct_info")
        result["sources"] = verdict.get("sources", [])
        return result

    except Exception as e:
        result = dict(claim_data)
        result["verdict"] = "Unverifiable"
        result["confidence"] = 0.0
        result["explanation"] = f"Verification failed: {str(e)}"
        result["correct_info"] = None
        result["sources"] = []
        return result


def verify_all_claims(claims: list[dict], api_key: str) -> list[dict]:
    """
    Verify all claims. Returns list of fully enriched claim dicts.
    """
    results = []
    for claim_data in claims:
        result = verify_claim(claim_data, api_key)
        results.append(result)
    return results
