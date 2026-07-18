from .models import Complaint
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
from groq import Groq
import json

client = Groq(api_key=settings.GROQ_API_KEY)


@api_view(["POST"])
def analyze_complaint(request):
    complaint = request.data.get("complaint")

    if not complaint:
        return Response({"error": "Complaint is required"})

    prompt = f"""
You are an AI Complaint Router.

Analyze the complaint and return ONLY valid JSON.

Format:

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

        # Remove markdown if Groq returns ```json ... ```
        if cleaned.startswith("```"):
            cleaned = cleaned.replace("```json", "").replace("```", "").strip()

        ai_result = json.loads(cleaned)

        # Save complaint in database
        Complaint.objects.create(
            name=request.data.get("name", "Anonymous"),
            phone=request.data.get("phone", ""),
            location=request.data.get("location", ""),
            complaint_text=complaint,
            language=ai_result["language"],
            translation=ai_result["translation"],
            department=ai_result["department"],
            priority=ai_result["priority"]
        )

        return Response(ai_result)

    except Exception as e:
        return Response({"error": str(e)})