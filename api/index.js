const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000;
const cheerio = require('cheerio');

app.use(express.json());

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

// Function to get detailed information for a single event
async function getEventDetails(eventId, accessToken, accountId) {
    try {
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
    } catch (error) {
        console.error('Error fetching event details:', error);
        throw error; 
    }
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

    // Fetch details for each event
    const eventDetailsPromises = EventsIdentifiers.map(eventId => getEventDetails(eventId, accessToken, accountId));
    const events = await Promise.all(eventDetailsPromises);

    // Process and map event data
    return events.map(event => {
        const $ = cheerio.load(event.Details.DescriptionHtml);
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

// GET endpoint to retrieve all volunteer opportunities
app.get('/api/getVolunteerOpportunities', async (req, res) => {
    try {
        const events = await getEvents();
        res.status(200).json(events); // Correctly format response
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
