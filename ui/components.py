import streamlit as st


def render_header():
    """Render the hero header."""
    st.markdown("""
    <div class="hero-header">
        <h1>🔍 Fact-Check Agent</h1>
        <p>Upload a PDF → Extract claims → Verify against live web data → Get a truth report</p>
    </div>
    """, unsafe_allow_html=True)


def render_stats(results: list[dict]):
    """Render summary statistics cards."""
    verified = sum(1 for r in results if r.get("verdict") == "Verified")
    inaccurate = sum(1 for r in results if r.get("verdict") == "Inaccurate")
    false_count = sum(1 for r in results if r.get("verdict") == "False")
    unverifiable = sum(1 for r in results if r.get("verdict") == "Unverifiable")
    total = len(results)

    st.markdown(f"""
    <div class="stats-row">
        <div class="stat-card stat-total">
            <p class="stat-number">{total}</p>
            <p class="stat-label">Total Claims</p>
        </div>
        <div class="stat-card stat-verified">
            <p class="stat-number">{verified}</p>
            <p class="stat-label">Verified</p>
        </div>
        <div class="stat-card stat-inaccurate">
            <p class="stat-number">{inaccurate}</p>
            <p class="stat-label">Inaccurate</p>
        </div>
        <div class="stat-card stat-false">
            <p class="stat-number">{false_count}</p>
            <p class="stat-label">False</p>
        </div>
        <div class="stat-card stat-unverifiable">
            <p class="stat-number">{unverifiable}</p>
            <p class="stat-label">Unverifiable</p>
        </div>
    </div>
    """, unsafe_allow_html=True)


def render_claim_card(claim: dict, index: int):
    """Render a single claim card."""
    verdict = claim.get("verdict", "Unverifiable")
    verdict_class = f"verdict-{verdict.lower()}"
    claim_text = claim.get("claim", "")
    category = claim.get("category", "general")
    confidence = claim.get("confidence", 0.0)
    explanation = claim.get("explanation", "")
    correct_info = claim.get("correct_info")
    sources = claim.get("sources", [])

    # Confidence bar color
    if verdict == "Verified":
        bar_color = "#34d399"
    elif verdict == "Inaccurate":
        bar_color = "#fbbf24"
    elif verdict == "False":
        bar_color = "#f87171"
    else:
        bar_color = "#94a3b8"

    # Build the card HTML
    card_html = f"""
    <div class="claim-card animate-in" style="animation-delay: {index * 0.1}s">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
            <span class="verdict-badge {verdict_class}">{verdict}</span>
            <span class="category-tag">{category}</span>
        </div>
        <p class="claim-text" style="margin-top: 0.75rem;">"{claim_text}"</p>
        <p class="explanation-text">{explanation}</p>
    """

    if correct_info and verdict == "Inaccurate":
        card_html += f"""
        <div class="correct-info">
            ✅ <strong>Correct Information:</strong> {correct_info}
        </div>
        """

    if correct_info and verdict == "False":
        card_html += f"""
        <div class="correct-info" style="border-left-color: #f87171; background: rgba(248,113,113,0.08); color: #f87171;">
            ❌ <strong>Reality:</strong> {correct_info}
        </div>
        """

    # Confidence bar
    conf_pct = int(confidence * 100)
    card_html += f"""
        <div style="display: flex; justify-content: space-between; margin-top: 0.75rem;">
            <span style="font-size: 0.75rem; color: rgba(255,255,255,0.4);">Confidence</span>
            <span style="font-size: 0.75rem; color: rgba(255,255,255,0.6);">{conf_pct}%</span>
        </div>
        <div class="confidence-bar-bg">
            <div class="confidence-bar-fill" style="width: {conf_pct}%; background: {bar_color};"></div>
        </div>
    """

    # Sources
    if sources:
        card_html += '<div style="margin-top: 0.75rem;">'
        for src in sources[:3]:
            if src:
                card_html += f'<a href="{src}" target="_blank" class="source-link" style="display: block; margin-bottom: 0.25rem; text-decoration: none;">🔗 {src[:80]}...</a>'
        card_html += '</div>'

    card_html += '</div>'

    st.markdown(card_html, unsafe_allow_html=True)


def render_all_claims(results: list[dict], filter_verdict: str = "All"):
    """Render all claim cards, optionally filtered."""
    filtered = results
    if filter_verdict != "All":
        filtered = [r for r in results if r.get("verdict") == filter_verdict]

    if not filtered:
        st.info(f"No claims with verdict '{filter_verdict}' found.")
        return

    for i, claim in enumerate(filtered):
        render_claim_card(claim, i)
