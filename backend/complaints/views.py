from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user

from django.conf import settings
from django.views.decorators.csrf import csrf_exempt

from groq import Groq
from .models import Complaint

import json


# -----------------------------------------
# GROQ CLIENT
# -----------------------------------------

client = Groq(api_key=settings.GROQ_API_KEY)

print("GROQ KEY LOADED:", bool(settings.GROQ_API_KEY))


# -----------------------------------------
# ANALYZE COMPLAINT
# -----------------------------------------

@csrf_exempt
@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def analyze_complaint(request):

    complaint = request.data.get("complaint")

    if not complaint:
        return Response(
            {"error": "Complaint is required"},
            status=400
        )

    prompt = f"""
You are an AI Complaint Router.

Analyze the complaint and return ONLY valid JSON.

Rules:

1. Detect the language.
2. If the complaint is NOT in English, translate it into English.
3. If the complaint is ALREADY in English, return the ORIGINAL complaint as the translation.
4. Identify the correct department.
5. Assign the priority (Low, Medium, or High).

Department Rules:

- Public Works:
  Roads, potholes, street lights, bridges, drainage, footpaths.

- Sanitation:
  Garbage collection, waste disposal, dirty streets, sewage overflow, public toilets.

- Water Supply:
  Water leakage, no water supply, low water pressure, pipeline issues.

- Electricity:
  Power cuts, transformers, electric poles, damaged electric wires.

- Municipal Services:
  Birth certificates, death certificates, property tax, parks, licenses, civic administration.

Priority Rules:

- High:
  Dangerous situations, sewage overflow, no electricity, major water leakage,
  road accidents, fallen electric wires.

- Medium:
  Potholes, broken street lights, delayed garbage collection,
  moderate water issues.

- Low:
  General enquiries, park maintenance, documentation requests,
  minor complaints.

Return ONLY this JSON format:

{{
    "language": "",
    "translation": "",
    "department": "",
    "priority": ""
}}

Complaint:
{complaint}
"""

    try:
        chat_completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        result = chat_completion.choices[0].message.content

        cleaned = result.strip()

        if cleaned.startswith("```"):
            cleaned = (
                cleaned
                .replace("```json", "")
                .replace("```", "")
                .strip()
            )

        ai_result = json.loads(cleaned)

        print("AI RESULT:", ai_result)

        # Get logged-in user
        # user = None

        # if request.user.is_authenticated:
        #     user = request.user

        # print("LOGGED-IN USER:", request.user)
        # print("AUTHENTICATED:", request.user.is_authenticated)
        # Get logged-in Django user from the session
        user = get_user(request._request)

        print("LOGGED-IN USER:", user)
        print("AUTHENTICATED:", user.is_authenticated)

        # Save complaint
        Complaint.objects.create(
            user=user,
            name=request.data.get("name", "Anonymous"),
            phone=request.data.get("phone", ""),
            location=request.data.get("location", ""),
            complaint_text=complaint,
            language=ai_result.get("language", ""),
            translation=ai_result.get("translation", ""),
            department=ai_result.get("department", ""),
            priority=ai_result.get("priority", "")
        )

        return Response(ai_result, status=200)

    except json.JSONDecodeError:
        print("ERROR: Groq returned invalid JSON")

        return Response(
            {"error": "AI returned an invalid response."},
            status=500
        )

    except Exception as e:
        print("ERROR:", str(e))

        return Response(
            {"error": str(e)},
            status=500
        )


# -----------------------------------------
# MY COMPLAINTS
# -----------------------------------------

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_complaints(request):

    complaints = Complaint.objects.filter(
        user=request.user
    ).order_by("-created_at")

    data = []

    for complaint in complaints:
        data.append({
            "id": complaint.id,
            "name": complaint.name,
            "phone": complaint.phone,
            "location": complaint.location,
            "complaint_text": complaint.complaint_text,
            "language": complaint.language,
            "translation": complaint.translation,
            "department": complaint.department,
            "priority": complaint.priority,
            "status": complaint.status,
            "created_at": complaint.created_at,
        })

    return Response(data, status=200)


# -----------------------------------------
# ADMIN COMPLAINTS
# -----------------------------------------

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_complaints(request):

    if not request.user.is_superuser:
        return Response(
            {"error": "Admin access required"},
            status=403
        )

    complaints = Complaint.objects.all().order_by("-created_at")

    data = []

    for complaint in complaints:
        data.append({
            "id": complaint.id,
            "user": (
                complaint.user.username
                if complaint.user
                else "Anonymous"
            ),
            "name": complaint.name,
            "phone": complaint.phone,
            "location": complaint.location,
            "complaint_text": complaint.complaint_text,
            "language": complaint.language,
            "translation": complaint.translation,
            "department": complaint.department,
            "priority": complaint.priority,
            "status": complaint.status,
            "created_at": complaint.created_at,
        })

    return Response(data, status=200)

