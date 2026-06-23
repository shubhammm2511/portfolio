import requests
import time


SERPER_URL = "https://google.serper.dev/search"


def search_claim(query: str, api_key: str, num_results: int = 5) -> dict:
    """
    Search the web for a claim using Serper API.
    Returns search results with snippets and sources.
    """
    headers = {
        "X-API-KEY": api_key,
        "Content-Type": "application/json",
    }

    payload = {
        "q": query,
        "num": num_results,
    }

    try:
        response = requests.post(SERPER_URL, json=payload, headers=headers, timeout=15)
        response.raise_for_status()
        data = response.json()

        results = []

        # Extract organic results
        for item in data.get("organic", [])[:num_results]:
            results.append({
                "title": item.get("title", ""),
                "snippet": item.get("snippet", ""),
                "link": item.get("link", ""),
            })

        # Extract knowledge graph if present
        kg = data.get("knowledgeGraph", {})
        if kg:
            kg_text = kg.get("description", "")
            if kg_text:
                results.insert(0, {
                    "title": kg.get("title", "Knowledge Graph"),
                    "snippet": kg_text,
                    "link": kg.get("descriptionLink", ""),
                })

        # Extract answer box if present
        answer_box = data.get("answerBox", {})
        if answer_box:
            ab_text = answer_box.get("answer", "") or answer_box.get("snippet", "")
            if ab_text:
                results.insert(0, {
                    "title": answer_box.get("title", "Answer Box"),
                    "snippet": ab_text,
                    "link": answer_box.get("link", ""),
                })

        return {
            "query": query,
            "results": results,
            "raw_snippets": "\n\n".join(
                f"Source: {r['title']}\n{r['snippet']}\nURL: {r['link']}"
                for r in results
            ),
        }

    except requests.RequestException as e:
        return {
            "query": query,
            "results": [],
            "raw_snippets": f"Search failed: {str(e)}",
            "error": str(e),
        }


def search_all_claims(claims: list[dict], api_key: str, delay: float = 0.3) -> list[dict]:
    """
    Search the web for all claims. Adds 'search_results' to each claim dict.
    Returns the enriched claims list.
    """
    enriched = []
    for claim in claims:
        query = claim.get("search_query", claim.get("claim", ""))
        search_data = search_claim(query, api_key)
        claim_copy = dict(claim)
        claim_copy["search_results"] = search_data
        enriched.append(claim_copy)
        time.sleep(delay)  # Rate limiting
    return enriched
