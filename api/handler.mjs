import getVolunteerOpportunities from './getVolunteerOpportunities.mjs';
import registerForEvent from './registerVolunteer.mjs';
import getUserData from './getUserData.mjs';

const userDataCache = new Map(); // In-memory cache

export default async function handler(req, res) {
    try {
        // Add CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        // Handle OPTIONS request for CORS preflight
        if (req.method === 'OPTIONS') {
            res.status(200).end();
            return;
        }

        // Handle the different routes
        switch (req.url) {
            case '/getVolunteerOpportunities':
                if (req.method === 'GET') {
                    console.log("Getting Opportunities List");
                    await getVolunteerOpportunities(req, res);
                } else {
                    res.status(405).json({ error: 'Method Not Allowed' });
                }
                break;

            case '/getUserData':
                if (req.method === 'GET') {
                    const { authorizationCode } = req.query;

                    if (!authorizationCode) {
                        res.status(400).json({ error: 'Bad Request: Missing authorization code' });
                        return;
                    }

                    // Check cache first
                    if (userDataCache.has(authorizationCode)) {
                        console.log("here")
                        res.status(200).json(userDataCache.get(authorizationCode));
                    } else {
                        // Fetch and cache data
                        try {
                            console.log("HERE")
                            const userData = await getUserData(req, res);
                            userDataCache.set(authorizationCode, userData);
                            res.status(200).json(userData);
                        } catch (error) {
                            res.status(500).json({ error: 'Failed to fetch user data' });
                        }
                    }
                } else {
                    res.status(405).json({ error: 'Method Not Allowed' });
                }
                break;

            case '/registerVolunteer':
                if (req.method === 'POST') {
                    const { eventId, userData } = req.body;
                    // Validate eventId and userData before calling the function
                    if (!eventId || !userData) {
                        res.status(400).json({ error: 'Bad Request: Missing eventId or userData' });
                        return;
                    }
                    const registrationResult = await registerForEvent(eventId, userData);
                    res.status(200).json(registrationResult);
                } else {
                    res.status(405).json({ error: 'Method Not Allowed' });
                }
                break;

            default:
                res.status(404).json({ error: 'Route Not Found' });
                break;
        }
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).send('Internal Server Error');
    }
}
