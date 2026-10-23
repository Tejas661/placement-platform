from django.http import JsonResponse
from django.contrib.auth.models import User
import json

from django.views.decorators.csrf import csrf_exempt
from .models import StudentProfile, UserRole

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
@csrf_exempt
def signup(request):
    if request.method == "POST":
        data = json.loads(request.body)

        username = data.get("username")
        password = data.get("password")
        role = data.get("role", "student")

        if role not in ["student", "recruiter"]:
            return JsonResponse(
                {"error": "Invalid role"},
                status=400
            )

        if User.objects.filter(username=username).exists():
            return JsonResponse(
                {"error": "Username already exists"},
                status=400
            )

        user = User.objects.create_user(
            username=username,
            password=password
        )

        UserRole.objects.create(
            user=user,
            role=role
        )

        return JsonResponse({
            "message": "User created successfully",
            "username": user.username,
            "role": role
        })

    return JsonResponse(
        {"error": "Only POST method allowed"},
        status=405
    )

@csrf_exempt
def login(request):
    if request.method == "POST":
        data = json.loads(request.body)

        username = data.get("username")
        password = data.get("password")

        user = User.objects.filter(username=username).first()

        if user and user.check_password(password):
            return JsonResponse({
                "message": "Login successful"
            })

        return JsonResponse({
            "error": "Invalid username or password"
        }, status=401)

    return JsonResponse({
        "error": "Only POST method allowed"
    })
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    return JsonResponse({
        "username": request.user.username,
        "message": "You are logged in"
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_profile(request):
    profile = StudentProfile.objects.create(
        user=request.user,
        college=request.data.get("college"),
        course=request.data.get("course"),
        skills=request.data.get("skills"),
        graduation_year=request.data.get("graduation_year")
    )

    return JsonResponse({
        "message": "Profile created successfully",
        "college": profile.college,
        "course": profile.course,
        "skills": profile.skills,
        "graduation_year": profile.graduation_year
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    profile = StudentProfile.objects.get(user=request.user)

    return JsonResponse({
        "college": profile.college,
        "course": profile.course,
        "skills": profile.skills,
        "graduation_year": profile.graduation_year
    })


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    profile = StudentProfile.objects.get(user=request.user)

    profile.college = request.data.get("college")
    profile.course = request.data.get("course")
    profile.skills = request.data.get("skills")
    profile.graduation_year = request.data.get("graduation_year")

    profile.save()

    return JsonResponse({
        "message": "Profile updated successfully",
        "college": profile.college,
        "course": profile.course,
        "skills": profile.skills,
        "graduation_year": profile.graduation_year
    })
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_role(request):
    try:
        user_role = UserRole.objects.get(user=request.user)

        return JsonResponse({
            "username": request.user.username,
            "role": user_role.role
        })

    except UserRole.DoesNotExist:
        return JsonResponse(
            {"error": "User role not found"},
            status=404
        )
    