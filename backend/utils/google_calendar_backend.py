import os
os.environ['OAUTHLIB_RELAX_TOKEN_SCOPE'] = '1'

from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import Flow

CLIENT_SECRETS_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'client_secret.json')
SCOPES = ['https://www.googleapis.com/auth/calendar.events']

def get_credentials_from_refresh_token(refresh_token: str):
    import json
    with open(CLIENT_SECRETS_FILE, 'r') as f:
        client_config = json.load(f)
    
    client_id = client_config['web']['client_id']
    client_secret = client_config['web']['client_secret']
    token_uri = client_config['web']['token_uri']

    creds = Credentials(
        token=None,
        refresh_token=refresh_token,
        token_uri=token_uri,
        client_id=client_id,
        client_secret=client_secret,
        scopes=SCOPES
    )
    return creds

def exchange_code_for_refresh_token(auth_code: str):
    flow = Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE,
        scopes=SCOPES,
        redirect_uri='postmessage' # Needed for @react-oauth/google's auth-code flow
    )
    flow.fetch_token(code=auth_code)
    credentials = flow.credentials
    return credentials.refresh_token

def create_event(refresh_token: str, task_details: dict):
    if not refresh_token:
        return None
    try:
        creds = get_credentials_from_refresh_token(refresh_token)
        service = build('calendar', 'v3', credentials=creds)
        
        event = {
            'summary': f"Validation Task: {task_details.get('line', '')}",
            'description': f"Validation review assigned for \n machineName : {task_details.get('machineName', 'none')} \n machine-no:  {task_details.get('machineNumber', 'none')} \n model: {task_details.get('model', 'none')}",
            'start': {
                'date': task_details.get('inspectionDate', '').split('T')[0],
                'timeZone': 'Asia/Kolkata',
            },
            'end': {
                'date': task_details.get('inspectionDate', '').split('T')[0],
                'timeZone': 'Asia/Kolkata',
            },
        }
        
        event_result = service.events().insert(calendarId='primary', body=event).execute()
        return event_result.get('id')
    except Exception as e:
        print(f"Error creating calendar event: {e}")
        return None

def delete_event(refresh_token: str, event_id: str):
    if not refresh_token or not event_id:
        return False
    try:
        creds = get_credentials_from_refresh_token(refresh_token)
        service = build('calendar', 'v3', credentials=creds)
        service.events().delete(calendarId='primary', eventId=event_id).execute()
        return True
    except Exception as e:
        print(f"Error deleting calendar event: {e}")
        return False
