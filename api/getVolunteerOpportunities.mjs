// getVolunteerOpportunities.mjs
import fetch from 'node-fetch';
import { load } from 'cheerio';
import { getAccessToken, getEventDetails } from '../utils/apiUtils.mjs'; 

export default async function getVolunteerOpportunities(req, res) {
    try {
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

        const formattedEvents = events.map(event => {
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

        res.status(200).json(formattedEvents);
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).send('Internal Server Error');
    }
}
