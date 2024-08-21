import { load } from 'cheerio';
import fetch from 'node-fetch';

async function getAccessToken() {
    const API_KEY = process.env.API_KEY;
    const authHeader = Buffer.from(`APIKEY:${API_KEY}`).toString('base64');

    const response = await fetch('https://oauth.wildapricot.org/auth/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${authHeader}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials&scope=auto',
    });

    if (!response.ok) {
        throw new Error('Failed to get access token');
    }

    const data = await response.json();
    return data.access_token;
}

async function getEventDetails(eventId, accessToken, accountId) {
    const response = await fetch(`https://api.wildapricot.org/v2.3/accounts/${accountId}/events/${eventId}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch details for event ID ${eventId}. Status: ${response.status}`);
    }

    const eventDetails = await response.json();
    return eventDetails;
}

async function getEvents() {
    const accountId = process.env.ACCOUNT_ID;
    const accessToken = await getAccessToken();

    const response = await fetch(`https://api.wildapricot.org/v2.3/accounts/${accountId}/events?%24filter=Tags%20in%20%5Bvolunteer%5D&idsOnly=true`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch event identifiers');
    }

    const { EventsIdentifiers } = await response.json();

    const eventDetailsPromises = EventsIdentifiers.map(eventId => getEventDetails(eventId, accessToken, accountId));
    const events = await Promise.all(eventDetailsPromises);

    return events.map(event => {
        const $ = load(event.Details.DescriptionHtml);
        const pointAllocation = $('p').text().trim();
        return {
            role: event.Name,
            positionsLeft: event.RegistrationsLimit ? event.RegistrationsLimit - event.ConfirmedRegistrationsCount : 'N/A',
            pointAllocation: pointAllocation || 'TBD',
            date: new Date(event.StartDate).toLocaleDateString(),
            id: event.Id
        };
    });
}

// Export a handler function for the API route
export async function handler(req, res) {
    try {
        const events = await getEvents();
        res.status(200).json(events);
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).send('Internal Server Error');
    }
}
