// getVolunteerOpportunities.mjs
import fetch from 'node-fetch';
import { getTokenLogin } from '../utils/apiUtils.mjs';

const userDataCache = new Map();

export default async function getUserData(req, res) {
    const authorizationCode = req.query.authorizationCode;
    if (userDataCache.has(authorizationCode)) {
        res.status(200).json(userDataCache.get(authorizationCode));
        console.log("check")
        return;
    } else {
        try {
            const accountId = process.env.ACCOUNT_ID;
            const accessToken = await getTokenLogin(authorizationCode);

            // Fetch user data
            const response = await fetch(`https://api.wildapricot.org/v2.3/accounts/${accountId}/contacts/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                // If the response is not OK, set the status code of the response
                const errorData = await response.json();
                res.status(response.status).json({ error: errorData.message || 'Failed to fetch user data' });
                return;
            }

            const data = await response.json();

            // Send user data as JSON response
            userDataCache.set(authorizationCode, data);
            res.status(200).json(data);
        } catch (error) {
            console.error('Error fetching user data:', error);
            res.status(500).json({ error: 'Failed to fetch user data' });
        }
    }
}
