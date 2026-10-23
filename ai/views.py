from rest_framework.decorators import api_view
from rest_framework.response import Response
from .nlp_processor import process_resume
from .resume_parser import extract_text_from_pdf
from .ats_score import calculate_ats_score


@api_view(["POST"])
def analyze_resume(request):

    if "resume" not in request.FILES:
        return Response(
            {"error": "Resume file is required"},
            status=400
        )

    resume = request.FILES["resume"]

    text = extract_text_from_pdf(resume)

    nlp_result = process_resume(text)
    ats_score = calculate_ats_score(
    text,
    nlp_result["skills"]
)

    return Response({
    "message": "Resume analyzed successfully",
    "text": text,
    "nlp": nlp_result,
    "ats_score": ats_score
})