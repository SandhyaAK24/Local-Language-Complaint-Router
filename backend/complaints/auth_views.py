from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json


@csrf_exempt
def signup(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=405)

    try:
        data = json.loads(request.body)

        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        if not name or not email or not password:
            return JsonResponse(
                {"error": "All fields are required"},
                status=400
            )

        if User.objects.filter(username=email).exists():
            return JsonResponse(
                {"error": "Account already exists"},
                status=400
            )

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=name
        )

        return JsonResponse({
            "message": "Account created successfully"
        }, status=201)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def user_login(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=405)

    try:
        data = json.loads(request.body)

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return JsonResponse(
                {"error": "Email and password are required"},
                status=400
            )

        user = authenticate(
            request,
            username=email,
            password=password
        )

        if user is None:
            return JsonResponse(
                {"error": "Invalid email or password"},
                status=401
            )

        login(request, user)

        return JsonResponse({
            "message": "Login successful",
            "user": {
                "name": user.first_name,
                "email": user.email
            }
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)