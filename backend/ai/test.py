from google import genai
from django.conf import settings


client = genai.Client(api_key=settings.GEMENI_API_KEY)

print(settings.GEMENI_API_KEY)

def Test(input = "Hello World"):
    response = client.models.generate_content(
        model="gemini-2.5-flash", contents=input,
    )

    return response.text