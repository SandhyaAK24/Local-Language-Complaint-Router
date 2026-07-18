# import google.generativeai as genai

# genai.configure(api_key="AQ.Ab8RN6KlukiS4toJ0X4IEYsiZmbluKR5fq5bT71CD1mUk8gFEA")

# try:
#     model = genai.GenerativeModel("gemini-2.5-flash")
#     response = model.generate_content("Hello")
#     print(response.text)
# except Exception as e:
#     print(type(e).__name__)
#     print(e)
from google import genai

client = genai.Client(api_key="AQ.Ab8RN6KlukiS4toJ0X4IEYsiZmbluKR5fq5bT71CD1mUk8gFEA")

try:
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents="Hello"
    )
    print(response.text)
except Exception as e:
    print(type(e).__name__)
    print(e)