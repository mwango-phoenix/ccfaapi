import fetch from 'node-fetch';
import { getTokenLogin } from '../utils/apiUtils.mjs';

const userDataCache = new Map();

export default async function getUserData(req, res) {
    const authorizationCode = req.query.authorizationCode;
    if (userDataCache.has(authorizationCode)) {
        res.status(200).json(userDataCache.get(authorizationCode));
        return;
    } else {
        try {
            const accountId = process.env.ACCOUNT_ID;
            const accessToken = await getTokenLogin(authorizationCode);

            // Fetch user data
            const userResponse = await fetch(`https://api.wildapricot.org/v2.3/accounts/${accountId}/contacts/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!userResponse.ok) {
                const errorData = await userResponse.json();
                res.status(userResponse.status).json({ error: errorData.message || 'Failed to fetch user data' });
                return;
            }

            const userData = await userResponse.json();

            // Extract contactId from user data
            const contactId = userData.Id;

            // Fetch event registrations
            const registrationsResponse = await fetch(`https://api.wildapricot.org/v2.3/accounts/${accountId}/eventregistrations?contactId=${contactId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!registrationsResponse.ok) {
                const errorData = await registrationsResponse.json();
                res.status(registrationsResponse.status).json({ error: errorData.message || 'Failed to fetch event registrations' });
                return;
            }

            const registrationsData = await registrationsResponse.json();

            // Prepare the combined response
            const responseData = {
                Id: contactId,
                FirstName: userData.FirstName,
                LastName: userData.LastName,
                Email: userData.Email,
                Registrations: registrationsData
            };

            // Cache the combined data
            userDataCache.set(authorizationCode, responseData);
            
            // Send the combined data as JSON response
            res.status(200).json(responseData);
        } catch (error) {
            console.error('Error fetching user data:', error);
            res.status(500).json({ error: 'Failed to fetch user data' });
        }
    }
}
