export const createCalendarEvent = async (accessToken: string, taskDetails: any) => {
  const event = {
    summary: `Validation Task: ${taskDetails.engineerId}`,
    description: `Validation review assigned for engineer ${taskDetails.engineerName}`,
    start: {
      date: taskDetails.inspectionDate.split('T')[0],
      timeZone: 'Asia/Kolkata',
    },
    end: {
      date: taskDetails.inspectionDate.split('T')[0],
      timeZone: 'Asia/Kolkata',
    },
  };

  const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });

  const data = await response.json();
  return data.id;
};

export const deleteCalendarEvent = async (accessToken: string, eventId: string) => {
  await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
};
