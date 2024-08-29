import getVolunteerOpportunities from './getVolunteerOpportunities.mjs';
import registerForEvent from './registerVolunteer.mjs';
import getUserData from './getUserData.mjs';
import deleteRegistration from './cancelRegistration.mjs';
import updatePoints from './updatePoints.mjs';

const userDataCache = new Map(); // In-memory cache

// Common CORS handler
function handleCORS(req, res) {
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return true;
    }
    return false;
}

// Route handler mapping
const routeHandlers = {
    '/api/getVolunteerOpportunities': {
        GET: getVolunteerOpportunities,
    },
    '/api/getUserData': {
        GET: async (req, res) => {
            const { authorizationCode } = req.query;

            if (!authorizationCode) {
                res.status(400).json({ error: 'Bad Request: Missing authorization code' });
                return;
            }

            if (userDataCache.has(authorizationCode)) {
                res.status(200).json(userDataCache.get(authorizationCode));
                return;
            }

            try {
                const userData = await getUserData(req, res);
                userDataCache.set(authorizationCode, userData);
                res.status(200).json(userData);
            } catch (error) {
                res.status(500).json({ error: 'Failed to fetch user data' });
            }
        },
    },
    '/api/registerVolunteer': {
        POST: async (req, res) => {
            try {
                await registerForEvent(req, res);
            } catch (error) {
                console.error('Error registering for event:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        },
    },
    '/api/cancelRegistration': {
        DELETE: deleteRegistration, 
    },
    '/api/updatePoints': {
        PUT: async (req, res) => {
            const { value } = req.body;
            console.log(value)
            await updatePoints(req, res, value);
        }
    }
};

export default async function handler(req, res) {
    try {
        // Handle CORS
        if (handleCORS(req, res)) return;

        // Remove query string from req.url
        const path = req.url.split('?')[0];

        // Extract handler based on path and method
        const route = routeHandlers[path];
        const methodHandler = route?.[req.method];

        if (methodHandler) {
            await methodHandler(req, res);
        } else {
            res.status(404).json({ error: 'Route Not Found' });
        }
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).send('Internal Server Error');
    }
}
