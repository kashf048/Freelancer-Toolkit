from openai import OpenAI
from flask import current_app

def init_openai_client():
    """Initializes the OpenAI client."""
    # The client automatically uses the OPENAI_API_KEY environment variable
    # which is set in the sandbox environment.
    return OpenAI()

def generate_document_draft(doc_type, client_info, project_info, custom_details):
    """Generates a document draft using the OpenAI API."""
    client = init_openai_client()
    
    system_prompt = (
        "You are an expert freelance business assistant. Your task is to draft professional business documents "
        "based on the provided type and details. The output must be the full text of the document, "
        "formatted nicely with Markdown, ready to be converted into a PDF. Do not include any conversational "
        "text, preambles, or explanations. Just the document content."
    )
    
    user_prompt = f"""
    Draft a **{doc_type}** document.
    
    **Client Information:**
    - Name: {client_info.get('name')}
    - Company: {client_info.get('company')}
    - Email: {client_info.get('email')}
    
    **Project Information:**
    - Title: {project_info.get('title')}
    - Description: {project_info.get('description')}
    - Budget: {project_info.get('budget')}
    - Timeline: {project_info.get('start_date')} to {project_info.get('end_date')}
    
    **Custom Details/Instructions:**
    {custom_details}
    
    Ensure the document is comprehensive and professional.
    """
    
    try:
        response = client.chat.completions.create(
            model="gemini-2.5-flash", # Using the available model
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
        )
        
        return response.choices[0].message.content
        
    except Exception as e:
        current_app.logger.error(f"OpenAI API error: {e}")
        return f"Error generating document draft: {e}"
