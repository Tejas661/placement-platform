from django.shortcuts import render
from django.http import JsonResponse
import json
from accounts.models import StudentProfile
from rest_framework.permissions import IsAdminUser
from .models import Job, Application

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated



from django.views.decorators.csrf import csrf_exempt
@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_job(request):

    job = Job.objects.create(
        title=request.data.get("title"),
        company=request.data.get("company"),
        location=request.data.get("location"),
        description=request.data.get("description"),
        required_skills=request.data.get("required_skills"),
        salary=request.data.get("salary"),
        deadline=request.data.get("deadline")
    )

    return JsonResponse({
        "message": "Job created successfully",
        "job_id": job.id
    })



def get_jobs(request):
    if request.method == "GET":
        jobs = Job.objects.all()

        data = []

        for job in jobs:
            data.append({
                "id": job.id,
                "title": job.title,
                "company": job.company,
                "location": job.location,
                "description": job.description,
                "required_skills": job.required_skills,
                "salary": job.salary,
                "deadline": job.deadline
            })

        return JsonResponse(data, safe=False)

    return JsonResponse({
        "error": "Only GET method allowed"
    })



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_job(request, job_id):

    job = Job.objects.get(id=job_id)

    existing_application = Application.objects.filter(
        user=request.user,
        job=job
    ).exists()

    if existing_application:
        return JsonResponse({
            "error": "You have already applied for this job"
        }, status=400)

    Application.objects.create(
        user=request.user,
        job=job
    )

    return JsonResponse({
        "message": "Applied successfully",
        "job": job.title
    })



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_applications(request):

    applications = Application.objects.filter(user=request.user)

    data = []

    for application in applications:
        data.append({
            "job_id": application.job.id,
            "job_title": application.job.title,
            "company": application.job.company,
            "location": application.job.location,
            "applied_at": application.applied_at
        })

    return JsonResponse(data, safe=False)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recommended_jobs(request):

    profile = StudentProfile.objects.get(user=request.user)

    student_skills = [
        skill.strip().lower()
        for skill in profile.skills.split(',')
    ]

    jobs = Job.objects.all()

    recommendations = []

    for job in jobs:
        required_skills = [
            skill.strip().lower()
            for skill in job.required_skills.split(',')
        ]

        matched_skills = []

        for skill in required_skills:
            if skill in student_skills:
                matched_skills.append(skill)

        if len(matched_skills) > 0:

            match_percentage = (
                len(matched_skills) / len(required_skills)
            ) * 100

            recommendations.append({
                "job_id": job.id,
                "title": job.title,
                "company": job.company,
                "location": job.location,
                "matched_skills": matched_skills,
                "match_count": len(matched_skills),
                "match_percentage": round(match_percentage, 2)
            })

    recommendations.sort(
        key=lambda x: x["match_percentage"],
        reverse=True
    )

    return JsonResponse(recommendations, safe=False)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def job_applicants(request, job_id):

    job = Job.objects.get(id=job_id)

    applications = Application.objects.filter(job=job)

    data = []

    for application in applications:
        data.append({
            "username": application.user.username,
            "job": job.title,
            "applied_at": application.applied_at
        })

    return JsonResponse(data, safe=False)









@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_job(request, job_id):

    job = Job.objects.get(id=job_id)

    job.title = request.data.get("title", job.title)
    job.company = request.data.get("company", job.company)
    job.location = request.data.get("location", job.location)
    job.description = request.data.get("description", job.description)
    job.required_skills = request.data.get("required_skills", job.required_skills)
    job.salary = request.data.get("salary", job.salary)
    job.deadline = request.data.get("deadline", job.deadline)

    job.save()

    return JsonResponse({
        "message": "Job updated successfully"
    })


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_job(request, job_id):

    job = Job.objects.get(id=job_id)

    job.delete()

    return JsonResponse({
        "message": "Job deleted successfully"
    })