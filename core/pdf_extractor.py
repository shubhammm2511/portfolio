import fitz  # PyMuPDF
import io


def extract_text_from_pdf(pdf_bytes: bytes) -> dict:
    """
    Extract text from a PDF file.
    Returns a dict with 'full_text' and 'pages' (list of {page_num, text}).
    """
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    pages = []
    full_text_parts = []

    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text("text")
        if text.strip():
            pages.append({"page_num": page_num + 1, "text": text.strip()})
            full_text_parts.append(f"--- Page {page_num + 1} ---\n{text.strip()}")

    doc.close()

    return {
        "full_text": "\n\n".join(full_text_parts),
        "pages": pages,
        "total_pages": len(pages),
    }
