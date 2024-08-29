import { getAccessToken, getRequest } from '../utils/apiUtils.mjs'; 
import { load } from 'cheerio';

export async function getEventDetails(eventId, accessToken, accountId) {
    const url = `https://api.wildapricot.org/v2.3/accounts/${accountId}/events/${eventId}`;
    return getRequest(url, accessToken); // Use getRequest from apiUtils.mjs
}

export default async function getVolunteerOpportunities(req, res) {
    try {
        const accountId = process.env.ACCOUNT_ID;
        const accessToken = await getAccessToken();

        const url = `https://api.wildapricot.org/v2.3/accounts/${accountId}/events?%24filter=Tags%20in%20%5Bvolunteer%5D&idsOnly=true`;
        const { EventsIdentifiers } = await getRequest(url, accessToken); // Use getRequest from apiUtils.mjs

        const eventDetailsPromises = EventsIdentifiers.map(eventId => getEventDetails(eventId, accessToken, accountId));
        const events = await Promise.all(eventDetailsPromises);

        const formattedEvents = events.map(event => {
            const $ = load(event.Details.DescriptionHtml);
            const pointAllocation = $('p').text().trim();
            return {
                role: event.Name,
                url: `https://theccfa.net/event-${event.Id}`,
                positionsLeft: event.RegistrationsLimit ? event.RegistrationsLimit - event.ConfirmedRegistrationsCount : 'N/A',
                pointAllocation: pointAllocation || 'TBD',
                date: new Date(event.StartDate).toLocaleDateString(),
                id: event.Id,
                regId: event.Details.RegistrationTypes[0]?.Id
            };
        });

        res.status(200).json(formattedEvents);
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).send('Internal Server Error');
    }
}
