import { getRequest } from '../utils/apiUtils.mjs';
import { getAccessToken } from '../utils/tokenUtils.mjs';
import { load } from 'cheerio';

export async function getEventDetails(eventId, accessToken, accountId) {
    const url = `https://api.wildapricot.org/v2.3/accounts/${accountId}/events/${eventId}`;
    return await getRequest(url, accessToken);
}

export async function getEvents() {
    const accountId = process.env.ACCOUNT_ID;
    const accessToken = await getAccessToken();

    const url = `https://api.wildapricot.org/v2.3/accounts/${accountId}/events?%24filter=Tags%20in%20%5Bvolunteer%5D&idsOnly=true`;
    const { EventsIdentifiers } = await getRequest(url, accessToken);

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
