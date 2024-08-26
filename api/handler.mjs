import getVolunteerOpportunities from './getVolunteerOpportunities.mjs';
import registerForEvent from './registerVolunteer.mjs';
import getUserData from './getUserData.mjs';

export default async function handler(req, res) {
    try {
        // Add CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        // Determine the route and handle accordingly
        if (req.url === '/getVolunteerOpportunities' && req.method === 'GET') {
            console.log("Getting Opportunities List")
            await getVolunteerOpportunities(req, res);
        } else if (req.url === '/getUserData' && req.method === 'GET') {
            await getUserData(req, res);
        } else if (req.url === '/registerVolunteer' && req.method === 'POST') {
            const { eventId, userData } = req.body;
            const registrationResult = await registerForEvent(eventId, userData);
            res.status(200).json(registrationResult);
        } else {
            res.status(404).json({ error: 'Route not found' });
        }
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).send('Internal Server Error');
    }
}