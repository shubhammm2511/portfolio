import streamlit as st
import json
import time

# Page config — must be first Streamlit command
st.set_page_config(
    page_title="Fact-Check Agent — Automated Claim Verification",
    page_icon="🔍",
    layout="wide",
    initial_sidebar_state="expanded",
)

from ui.styles import CUSTOM_CSS
from ui.components import render_header, render_stats, render_all_claims
from core.pdf_extractor import extract_text_from_pdf
from core.claim_extractor import extract_claims
from core.web_searcher import search_all_claims
from core.verdict_engine import verify_all_claims

# Inject custom CSS
st.markdown(CUSTOM_CSS, unsafe_allow_html=True)


def get_api_keys():
    """Get API keys from Streamlit secrets or sidebar input."""
    gemini_key = None
    serper_key = None

    # Try secrets first (for Streamlit Cloud)
    try:
        gemini_key = st.secrets.get("GEMINI_API_KEY", None)
        serper_key = st.secrets.get("SERPER_API_KEY", None)
    except Exception:
        pass

    # Sidebar input as fallback
    with st.sidebar:
        st.markdown("### 🔑 API Configuration")

        if not gemini_key:
            gemini_key = st.text_input(
                "Google Gemini API Key",
                type="password",
                help="Get a free key at [aistudio.google.com](https://aistudio.google.com)",
                placeholder="Enter your Gemini API key...",
            )

        if not serper_key:
            serper_key = st.text_input(
                "Serper API Key",
                type="password",
                help="Get a free key at [serper.dev](https://serper.dev)",
                placeholder="Enter your Serper API key...",
            )

        if gemini_key and serper_key:
            st.success("✅ API keys configured!")
        else:
            st.warning("⚠️ Please enter both API keys to start.")

        st.markdown("---")
        st.markdown(
            """
        <div style="font-size: 0.8rem; color: rgba(255,255,255,0.4); line-height: 1.6;">
            <strong>How it works:</strong><br>
            1. Upload a PDF document<br>
            2. AI extracts factual claims<br>
            3. Claims are searched on the web<br>
            4. AI verifies each claim<br>
            5. Get your truth report
        </div>
        """,
            unsafe_allow_html=True,
        )

    return gemini_key, serper_key


def process_pdf(pdf_bytes: bytes, gemini_key: str, serper_key: str):
    """Run the full fact-checking pipeline."""

    # Step 1: Extract text
    status = st.empty()
    progress = st.progress(0, text="Extracting text from PDF...")

    pdf_data = extract_text_from_pdf(pdf_bytes)
    if not pdf_data["full_text"].strip():
        st.error("❌ Could not extract any text from the PDF. The file may be scanned/image-based.")
        return None

    progress.progress(15, text=f"✅ Extracted text from {pdf_data['total_pages']} pages")
    time.sleep(0.5)

    # Step 2: Extract claims
    progress.progress(20, text="🧠 Analyzing document for factual claims...")

    with st.spinner("AI is identifying factual claims..."):
        claims = extract_claims(pdf_data["full_text"], gemini_key)

    if not claims:
        st.error("❌ No verifiable claims found in the document.")
        return None

    progress.progress(40, text=f"✅ Found {len(claims)} factual claims")
    time.sleep(0.5)

    # Step 3: Web search
    progress.progress(45, text="🔍 Searching the web for evidence...")

    search_status = st.empty()
    enriched_claims = []
    for i, claim in enumerate(claims):
        search_status.markdown(
            f'<p style="font-size: 0.85rem; color: rgba(255,255,255,0.5);">'
            f'Searching ({i+1}/{len(claims)}): "{claim.get("claim", "")[:80]}..."</p>',
            unsafe_allow_html=True,
        )
        from core.web_searcher import search_claim
        import copy

        query = claim.get("search_query", claim.get("claim", ""))
        search_data = search_claim(query, serper_key)
        claim_copy = dict(claim)
        claim_copy["search_results"] = search_data
        enriched_claims.append(claim_copy)
        pct = 45 + int((i + 1) / len(claims) * 30)
        progress.progress(pct, text=f"🔍 Searched {i+1}/{len(claims)} claims...")
        time.sleep(0.3)

    search_status.empty()
    progress.progress(75, text="✅ Web search complete")
    time.sleep(0.5)

    # Step 4: Verify claims
    progress.progress(78, text="⚖️ AI is verifying claims against evidence...")

    verify_status = st.empty()
    results = []
    for i, claim_data in enumerate(enriched_claims):
        verify_status.markdown(
            f'<p style="font-size: 0.85rem; color: rgba(255,255,255,0.5);">'
            f'Verifying ({i+1}/{len(enriched_claims)}): "{claim_data.get("claim", "")[:80]}..."</p>',
            unsafe_allow_html=True,
        )
        from core.verdict_engine import verify_claim

        result = verify_claim(claim_data, gemini_key)
        results.append(result)
        pct = 78 + int((i + 1) / len(enriched_claims) * 20)
        progress.progress(pct, text=f"⚖️ Verified {i+1}/{len(enriched_claims)} claims...")

    verify_status.empty()
    progress.progress(100, text="✅ Fact-checking complete!")
    time.sleep(1)
    progress.empty()

    return results


def main():
    """Main application."""

    # Render header
    render_header()

    # Get API keys
    gemini_key, serper_key = get_api_keys()

    # Initialize session state
    if "results" not in st.session_state:
        st.session_state.results = None
    if "pdf_name" not in st.session_state:
        st.session_state.pdf_name = None

    # File upload
    uploaded_file = st.file_uploader(
        "Upload a PDF document for fact-checking",
        type=["pdf"],
        help="Upload a PDF containing factual claims to verify",
        key="pdf_uploader",
    )

    if uploaded_file is not None:
        # Show file info
        col1, col2 = st.columns([3, 1])
        with col1:
            st.markdown(
                f'<p style="color: rgba(255,255,255,0.6); font-size: 0.9rem;">'
                f'📄 <strong>{uploaded_file.name}</strong> ({uploaded_file.size / 1024:.1f} KB)</p>',
                unsafe_allow_html=True,
            )
        with col2:
            run_check = st.button("🚀 Run Fact-Check", use_container_width=True, type="primary")

        if run_check:
            if not gemini_key or not serper_key:
                st.error("❌ Please enter both API keys in the sidebar before running.")
                return

            # Reset previous results
            st.session_state.results = None
            st.session_state.pdf_name = uploaded_file.name

            pdf_bytes = uploaded_file.read()

            with st.container():
                results = process_pdf(pdf_bytes, gemini_key, serper_key)
                if results:
                    st.session_state.results = results

    # Display results
    if st.session_state.results:
        results = st.session_state.results

        st.markdown("---")

        # Summary header
        st.markdown(
            f"""
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
            <h2 style="margin: 0; font-weight: 700; color: #e2e8f0;">
                📋 Fact-Check Report
            </h2>
            <span style="font-size: 0.85rem; color: rgba(255,255,255,0.4);">
                {st.session_state.pdf_name}
            </span>
        </div>
        """,
            unsafe_allow_html=True,
        )

        # Stats
        render_stats(results)

        # Filter controls
        st.markdown("---")

        col1, col2 = st.columns([2, 3])
        with col1:
            filter_option = st.selectbox(
                "Filter by verdict",
                ["All", "Verified", "Inaccurate", "False", "Unverifiable"],
                key="verdict_filter",
            )
        with col2:
            sort_option = st.selectbox(
                "Sort by",
                ["Default order", "Confidence (high → low)", "Confidence (low → high)"],
                key="sort_option",
            )

        # Sort results
        display_results = list(results)
        if sort_option == "Confidence (high → low)":
            display_results.sort(key=lambda x: x.get("confidence", 0), reverse=True)
        elif sort_option == "Confidence (low → high)":
            display_results.sort(key=lambda x: x.get("confidence", 0))

        # Render claims
        render_all_claims(display_results, filter_option)

        # Download report
        st.markdown("---")

        # Clean results for JSON export (remove search_results which is bulky)
        export_data = []
        for r in results:
            export_item = {
                "claim": r.get("claim", ""),
                "category": r.get("category", ""),
                "verdict": r.get("verdict", ""),
                "confidence": r.get("confidence", 0),
                "explanation": r.get("explanation", ""),
                "correct_info": r.get("correct_info"),
                "sources": r.get("sources", []),
            }
            export_data.append(export_item)

        report_json = json.dumps(export_data, indent=2, ensure_ascii=False)

        st.download_button(
            label="📥 Download Report as JSON",
            data=report_json,
            file_name=f"fact_check_report_{st.session_state.pdf_name}.json",
            mime="application/json",
            use_container_width=True,
        )

    elif uploaded_file is None:
        # Welcome state
        st.markdown(
            """
        <div style="text-align: center; padding: 3rem 1rem;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">📄</div>
            <h3 style="color: rgba(255,255,255,0.7); font-weight: 500; margin-bottom: 0.5rem;">
                Upload a PDF to get started
            </h3>
            <p style="color: rgba(255,255,255,0.4); font-size: 0.9rem; max-width: 500px; margin: 0 auto;">
                The Fact-Check Agent will extract factual claims from your document,
                search the web for evidence, and provide a detailed verification report.
            </p>
        </div>
        """,
            unsafe_allow_html=True,
        )


if __name__ == "__main__":
    main()
