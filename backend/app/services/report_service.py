import io
from datetime import datetime
from typing import Dict, Any
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)

def generate_pdf_report(analysis_data: Dict[str, Any]) -> io.BytesIO:
    """
    Generates a professional multi-page PDF analysis report for a student contract.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()

    # Custom styles
    primary_color = colors.HexColor("#7C3AED")     # Electric Violet
    dark_bg = colors.HexColor("#0F0F17")           # Near Black
    card_bg = colors.HexColor("#F8F9FA")           # Off-white for clean printing
    text_color = colors.HexColor("#1F2937")        # Dark slate
    muted_color = colors.HexColor("#6B7280")       # Gray

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=primary_color,
        spaceAfter=4
    )

    tagline_style = ParagraphStyle(
        'DocTagline',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=10,
        leading=14,
        textColor=muted_color,
        spaceAfter=12
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=primary_color,
        spaceBefore=12,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=text_color
    )

    bold_body = ParagraphStyle(
        'DocBoldBody',
        parent=body_style,
        fontName='Helvetica-Bold'
    )

    meta_style = ParagraphStyle(
        'MetaText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=muted_color
    )

    finding_title_style = ParagraphStyle(
        'FindingTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor("#111827")
    )

    quote_style = ParagraphStyle(
        'ClauseQuote',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor("#4B5563")
    )

    disclaimer_style = ParagraphStyle(
        'DisclaimerText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#6B7280"),
        alignment=1  # Centered
    )

    elements = []

    # Header / Branding
    elements.append(Paragraph("ContractAI — Student Contract Analysis Report", title_style))
    elements.append(Paragraph("Understand Before You Sign • AI-Powered Contract Intelligence for Students", tagline_style))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=primary_color, spaceBefore=0, spaceAfter=10))

    # Meta Table
    filename = analysis_data.get("filename", "Agreement.pdf")
    created_at = analysis_data.get("created_at")
    if isinstance(created_at, datetime):
        date_str = created_at.strftime("%B %d, %Y - %H:%M UTC")
    else:
        date_str = str(created_at or datetime.utcnow().strftime("%B %d, %Y"))

    page_count = analysis_data.get("page_count", 1)
    findings = analysis_data.get("findings", [])
    overall_duration = analysis_data.get("overall_duration", "Not specified")

    meta_data = [
        [
            Paragraph(f"<b>Agreement:</b> {filename}", meta_style),
            Paragraph(f"<b>Date:</b> {date_str}", meta_style)
        ],
        [
            Paragraph(f"<b>Pages Analyzed:</b> {page_count}", meta_style),
            Paragraph(f"<b>Overall Duration:</b> {overall_duration}", meta_style)
        ],
        [
            Paragraph(f"<b>Total Findings:</b> {len(findings)} conditions identified", meta_style),
            Paragraph("<b>Status:</b> Completed & Verified", meta_style)
        ]
    ]
    meta_table = Table(meta_data, colWidths=[260, 260])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F3F0FF")),
        ('PADDING', (0, 0), (-1, -1), 6),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#DDD6FE")),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    elements.append(meta_table)
    elements.append(Spacer(1, 12))

    # Executive Summary
    elements.append(Paragraph("Executive Summary", h1_style))
    summary_text = analysis_data.get("summary", "No summary available.")
    elements.append(Paragraph(summary_text, body_style))
    elements.append(Spacer(1, 10))

    # Key Points / Highlights
    key_points = analysis_data.get("key_points", [])
    if key_points:
        elements.append(Paragraph("Key Highlights", h1_style))
        for kp in key_points:
            elements.append(Paragraph(f"• {kp}", body_style))
            elements.append(Spacer(1, 3))
        elements.append(Spacer(1, 10))

    # Student Obligations Breakdown
    student_obs = analysis_data.get("student_obligations", {})
    if student_obs:
        elements.append(Paragraph("Student Obligations & Action Dashboard", h1_style))
        
        obs_categories = [
            ("What You Need to Pay", student_obs.get("what_you_need_to_pay", [])),
            ("What You Need to Do", student_obs.get("what_you_need_to_do", [])),
            ("What You Cannot Do", student_obs.get("what_you_cannot_do", [])),
            ("When You Need to Give Notice", student_obs.get("when_you_need_to_give_notice", [])),
            ("What Happens if You Cancel / Leave Early", student_obs.get("what_happens_if_you_cancel_or_leave_early", [])),
            ("Important Deadlines", student_obs.get("important_deadlines", []))
        ]

        obs_cells = []
        for cat_name, items in obs_categories:
            if items:
                items_p = "<br/>".join([f"• {item}" for item in items])
                obs_cells.append([
                    Paragraph(f"<b>{cat_name}</b>", bold_body),
                    Paragraph(items_p, body_style)
                ])

        if obs_cells:
            obs_table = Table(obs_cells, colWidths=[180, 340])
            obs_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#FAFAFA")),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E5E7EB")),
                ('PADDING', (0, 0), (-1, -1), 6),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ]))
            elements.append(obs_table)
            elements.append(Spacer(1, 14))

    # Detailed Findings
    elements.append(Paragraph("Detailed Clause Findings (Student Attention Guide)", h1_style))
    elements.append(Paragraph("Compare original legal wording with the plain student-friendly translation below:", meta_style))
    elements.append(Spacer(1, 6))

    for idx, f in enumerate(findings, 1):
        importance = f.get("importance", "Medium")
        imp_color = colors.HexColor("#EF4444") if importance == "High" else colors.HexColor("#F59E0B") if importance == "Medium" else colors.HexColor("#10B981")
        
        finding_box = [
            [
                Paragraph(f"<b>#{idx} — {f.get('title', 'Condition')}</b> ({f.get('category', 'General')})", finding_title_style),
                Paragraph(f"<b>Attention: <font color='{imp_color.hexval()}'>{importance}</font></b> | Page {f.get('page_number', 1)}", meta_style)
            ],
            [
                Paragraph("<b>Student Explanation:</b>", bold_body),
                Paragraph(f.get("simple_explanation", ""), body_style)
            ],
            [
                Paragraph("<b>Original Clause:</b>", meta_style),
                Paragraph(f'"{f.get("original_clause", "")}"', quote_style)
            ]
        ]
        
        t = Table(finding_box, colWidths=[120, 400])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#FBFBFE")),
            ('LINEBELOW', (0, 0), (-1, 0), 1, colors.HexColor("#DDD6FE")),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E5E7EB")),
            ('PADDING', (0, 0), (-1, -1), 5),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ]))
        elements.append(t)
        elements.append(Spacer(1, 8))

    # Legal Disclaimer Footer
    elements.append(Spacer(1, 15))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#E5E7EB"), spaceBefore=5, spaceAfter=8))
    elements.append(Paragraph(
        "<b>Disclaimer:</b> This report contains AI-generated explanations for educational and informational purposes only and does not constitute professional legal advice. ContractAI and its developers assume no liability for actions taken based upon this report. Always review agreements thoroughly or consult a qualified legal professional before signing.",
        disclaimer_style
    ))

    doc.build(elements)
    buffer.seek(0)
    return buffer
