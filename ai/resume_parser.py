import pymupdf

def extract_text_from_pdf(file):
    text = ""

    pdf = pymupdf.open(stream=file.read(), filetype="pdf")

    for page in pdf:
        text += page.get_text()

    pdf.close()

    return text