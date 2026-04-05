import requests
import os
from dotenv import load_dotenv
import json
import re


load_dotenv()

API_KEY = os.environ.get('OPEN_ROUTER_API_KEY')
API_URL = os.environ.get('OPEN_ROUTER_URL')




def sanitize_text(text: str) -> str:
    """Strip prompt injection attempts and excessive whitespace."""
    if not text:
        return ""
    # Remove anything that looks like a system/role injection
    text = re.sub(r'(?i)(system:|user:|assistant:|<\|.*?\|>|ignore previous)', '', text)
    return text.strip()



def entry_assist(data: dict) -> dict:
    draft_title = sanitize_text(data.get('draft_title', ''))
    draft_body = sanitize_text(data.get('draft_body', ''))

    # --- Safeguards ---
    if not draft_body:
        return {"error": "draft_body is required."}


    # --- Prompt ---
    system_prompt = """
        You are an AI writing assitant your job is to fix raw log entry. Fix grammar, Improve the clarity of the raw entry,
        and add more details and make the tone Optimistic and still keeping the developer's voice and intent. Do not fabricate details that aren't entry.
        You can include generic filler sentence but still keeping it short. The suggested_body should be only 3 sentences maximum.


        Respond ONLY with a valid JSON object in this exact shape:
        {
        "suggested_title": "...",
        "suggested_body": "..."
        }
        No markdown, no explanation, no extra keys.
    """

    user_message = f"""

        Draft Title: {draft_title or '(none provided)'}
        Draft Body:
        {draft_body}

        Improve the entry. If no title was provided, generate a concise one based on the body.
    """

    try:
        response = requests.post(
            url=API_URL,
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "openai/gpt-oss-120b:free",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message},
                ],
                "temperature": 0.4,
            },
            timeout=30,
        )
        response.raise_for_status()
    except requests.exceptions.Timeout:
        return {"error": "AI service timed out. Please try again."}
    except requests.exceptions.RequestException as e:
        return {"error": f"AI service error: {str(e)}"}

    try:
        raw = response.json()
        content = raw["choices"][0]["message"]["content"].strip()
        # Strip markdown fences if model wraps it anyway
        content = re.sub(r'^```json|```$', '', content, flags=re.MULTILINE).strip()
        result = json.loads(content)

        return {
            "suggested_title": str(result.get("suggested_title", "")),
            "suggested_body": str(result.get("suggested_body", "")),
        }
    except (KeyError, json.JSONDecodeError) as e:
        return {"error": f"Failed to parse AI response: {str(e)}"}
    
