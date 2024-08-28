import fetch from 'node-fetch';
import { getTokenLogin } from '../utils/apiUtils.mjs';

const userDataCache = new Map();

export default async function getUserData(req, res) {
    const authorizationCode = req.query.authorizationCode;

    if (userDataCache.has(authorizationCode)) {
        res.status(200).json(userDataCache.get(authorizationCode));
        return;
    }

    try {
        const accountId = process.env.ACCOUNT_ID;
        const accessToken = await getTokenLogin(authorizationCode);
        console.log(accessToken)

        // Fetch user data
        const userResponse = await fetch(`https://api.wildapricot.org/v2.3/accounts/${accountId}/contacts/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        const userData = await handleResponse(userResponse);
        if (userData.error) {
            res.status(userResponse.status).json(userData);
            return;
        }

        // Extract contactId from user data
        const contactId = userData.Id;
        console.log(contactId)

        // Fetch event registrations
        const registrationsResponse = await fetch(`https://api.wildapricot.org/v2.3/accounts/${accountId}/eventregistrations?contactId=${contactId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        console.log(registrationsResponse.text())
        // if (registrationsData.error) {
        //     res.status(registrationsResponse.status).json(registrationsData);
        //     return;
        // }

        // Prepare the combined response
        const responseData = {
            Id: contactId,
            FirstName: userData.FirstName,
            LastName: userData.LastName,
            Email: userData.Email,
            // Registrations: registrationsData
        };

        // Cache the combined data
        userDataCache.set(authorizationCode, responseData);

        // Send the combined data as JSON response
        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
