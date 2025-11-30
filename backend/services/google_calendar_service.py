from flask import current_app
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from datetime import datetime, timedelta
from models.project_model import Milestone
from utils.google_oauth_utils import get_google_credentials # To get user's credentials

# Placeholder for a real service function
def get_calendar_service(user_id):
    """Initializes and returns the Google Calendar service."""
    # credentials = get_google_credentials(user_id)
    # if not credentials:
    #     return None
    # return build('calendar', 'v3', credentials=credentials)
    return None

def create_calendar_event(user_id, milestone: Milestone):
    """Creates a Google Calendar event for a new milestone."""
    service = get_calendar_service(user_id)
    if not service:
        current_app.logger.warning(f"Google Calendar service not available for user {user_id}")
        return None
        
    try:
        # Assuming due_date is an ISO string
        due_date = datetime.fromisoformat(milestone.due_date)
        
        event = {
            'summary': f"Milestone: {milestone.title}",
            'location': 'Client Project',
            'description': f"Project Milestone for Project ID: {milestone.project_id}. Notes: {milestone.notes}",
            'start': {
                'dateTime': due_date.isoformat(),
                'timeZone': 'UTC', # Assuming UTC for simplicity
            },
            'end': {
                'dateTime': (due_date + timedelta(hours=1)).isoformat(), # 1 hour duration
                'timeZone': 'UTC',
            },
            'reminders': {
                'useDefault': False,
                'overrides': [
                    {'method': 'email', 'minutes': 24 * 60},
                    {'method': 'popup', 'minutes': 10},
                ],
            },
        }

        event = service.events().insert(calendarId='primary', body=event).execute()
        return event.get('id')
        
    except Exception as e:
        current_app.logger.error(f"Error creating Google Calendar event: {e}")
        return None

def delete_calendar_event(user_id, event_id):
    """Deletes a Google Calendar event."""
    service = get_calendar_service(user_id)
    if not service:
        current_app.logger.warning(f"Google Calendar service not available for user {user_id}")
        return
        
    try:
        service.events().delete(calendarId='primary', eventId=event_id).execute()
    except Exception as e:
        current_app.logger.error(f"Error deleting Google Calendar event: {e}")

def get_calendar_events(user_id, time_min, time_max):
    """Fetches calendar events for a given time range."""
    service = get_calendar_service(user_id)
    if not service:
        return []
        
    try:
        events_result = service.events().list(
            calendarId='primary', 
            timeMin=time_min, 
            timeMax=time_max,
            singleEvents=True,
            orderBy='startTime'
        ).execute()
        events = events_result.get('items', [])
        return events
    except Exception as e:
        current_app.logger.error(f"Error fetching Google Calendar events: {e}")
        return []
