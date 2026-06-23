CUSTOM_CSS = """
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

/* Global */
.stApp {
    font-family: 'Inter', sans-serif;
}

/* Hide default Streamlit header/footer */
#MainMenu {visibility: hidden;}
footer {visibility: hidden;}
header {visibility: hidden;}

/* Hero header */
.hero-header {
    background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
    border-radius: 16px;
    padding: 2.5rem 2rem;
    margin-bottom: 2rem;
    text-align: center;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.08);
}

.hero-header::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at 30% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 70% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%);
    animation: pulse-glow 6s ease-in-out infinite;
}

@keyframes pulse-glow {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.05); }
}

.hero-header h1 {
    font-size: 2.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, #818cf8, #c084fc, #f472b6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 0.5rem 0;
    position: relative;
    z-index: 1;
}

.hero-header p {
    color: rgba(255,255,255,0.6);
    font-size: 1.1rem;
    font-weight: 300;
    margin: 0;
    position: relative;
    z-index: 1;
}

/* Upload area */
.upload-zone {
    background: rgba(30, 27, 75, 0.4);
    border: 2px dashed rgba(129, 140, 248, 0.3);
    border-radius: 16px;
    padding: 2rem;
    text-align: center;
    transition: all 0.3s ease;
    margin-bottom: 1.5rem;
}

.upload-zone:hover {
    border-color: rgba(129, 140, 248, 0.6);
    background: rgba(30, 27, 75, 0.6);
}

/* Stats cards */
.stats-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.stat-card {
    flex: 1;
    background: rgba(30, 27, 75, 0.5);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    padding: 1.25rem;
    text-align: center;
    backdrop-filter: blur(10px);
}

.stat-card .stat-number {
    font-size: 2rem;
    font-weight: 800;
    margin: 0;
}

.stat-card .stat-label {
    font-size: 0.8rem;
    color: rgba(255,255,255,0.5);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0.25rem 0 0 0;
}

.stat-verified .stat-number { color: #34d399; }
.stat-inaccurate .stat-number { color: #fbbf24; }
.stat-false .stat-number { color: #f87171; }
.stat-unverifiable .stat-number { color: #94a3b8; }
.stat-total .stat-number {
    background: linear-gradient(135deg, #818cf8, #c084fc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* Claim cards */
.claim-card {
    background: rgba(30, 27, 75, 0.4);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
}

.claim-card:hover {
    border-color: rgba(255,255,255,0.12);
    transform: translateY(-1px);
}

.claim-text {
    font-size: 1rem;
    font-weight: 500;
    color: rgba(255,255,255,0.9);
    margin-bottom: 0.75rem;
    line-height: 1.5;
}

/* Verdict badges */
.verdict-badge {
    display: inline-block;
    padding: 0.3rem 0.9rem;
    border-radius: 50px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.verdict-verified {
    background: rgba(52, 211, 153, 0.15);
    color: #34d399;
    border: 1px solid rgba(52, 211, 153, 0.3);
}

.verdict-inaccurate {
    background: rgba(251, 191, 36, 0.15);
    color: #fbbf24;
    border: 1px solid rgba(251, 191, 36, 0.3);
}

.verdict-false {
    background: rgba(248, 113, 113, 0.15);
    color: #f87171;
    border: 1px solid rgba(248, 113, 113, 0.3);
}

.verdict-unverifiable {
    background: rgba(148, 163, 184, 0.15);
    color: #94a3b8;
    border: 1px solid rgba(148, 163, 184, 0.3);
}

.explanation-text {
    font-size: 0.9rem;
    color: rgba(255,255,255,0.6);
    line-height: 1.6;
    margin-top: 0.75rem;
}

.correct-info {
    background: rgba(251, 191, 36, 0.08);
    border-left: 3px solid #fbbf24;
    padding: 0.75rem 1rem;
    border-radius: 0 8px 8px 0;
    margin-top: 0.75rem;
    font-size: 0.9rem;
    color: #fbbf24;
}

.source-link {
    font-size: 0.8rem;
    color: rgba(129, 140, 248, 0.8);
    word-break: break-all;
}

.category-tag {
    display: inline-block;
    padding: 0.2rem 0.6rem;
    border-radius: 6px;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    background: rgba(129, 140, 248, 0.1);
    color: rgba(129, 140, 248, 0.8);
    border: 1px solid rgba(129, 140, 248, 0.2);
    margin-left: 0.5rem;
}

/* Confidence bar */
.confidence-bar-bg {
    width: 100%;
    height: 4px;
    background: rgba(255,255,255,0.06);
    border-radius: 2px;
    margin-top: 0.75rem;
    overflow: hidden;
}

.confidence-bar-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.5s ease;
}

/* Progress styling */
.stProgress > div > div {
    background: linear-gradient(90deg, #818cf8, #c084fc);
}

/* Sidebar styling */
section[data-testid="stSidebar"] {
    background: rgba(15, 12, 41, 0.95);
    border-right: 1px solid rgba(255,255,255,0.06);
}

/* Filter section */
.filter-section {
    background: rgba(30, 27, 75, 0.3);
    border-radius: 12px;
    padding: 1rem;
    margin-bottom: 1rem;
    border: 1px solid rgba(255,255,255,0.06);
}

/* Scrollbar */
::-webkit-scrollbar {
    width: 6px;
}
::-webkit-scrollbar-track {
    background: rgba(0,0,0,0.1);
}
::-webkit-scrollbar-thumb {
    background: rgba(129, 140, 248, 0.3);
    border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
    background: rgba(129, 140, 248, 0.5);
}

/* Animations */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-in {
    animation: fadeInUp 0.5s ease forwards;
}

/* Button styling */
.stButton > button {
    background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
    color: white !important;
    border: none !important;
    border-radius: 10px !important;
    padding: 0.6rem 2rem !important;
    font-weight: 600 !important;
    font-family: 'Inter', sans-serif !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3) !important;
}

.stButton > button:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4) !important;
}

/* File uploader */
[data-testid="stFileUploader"] {
    border-radius: 12px;
}

[data-testid="stFileUploader"] > div {
    background: rgba(30, 27, 75, 0.3) !important;
    border: 2px dashed rgba(129, 140, 248, 0.3) !important;
    border-radius: 12px !important;
}

[data-testid="stFileUploader"] > div:hover {
    border-color: rgba(129, 140, 248, 0.6) !important;
}
</style>
"""
