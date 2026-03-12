import { fetchEvents } from '@/lib/luma-api';
import { groupIntoSchedule, getPreConferenceEvents } from '@/lib/time-slots';

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    const events = await fetchEvents();
    const schedule = groupIntoSchedule(events);
    const preConference = getPreConferenceEvents(events);

    return Response.json({
      schedule,
      preConference,
      totalEvents: events.length,
    });
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return Response.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
