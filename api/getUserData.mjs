import fetch from 'node-fetch';
import { getAccessToken } from '../utils/apiUtils.mjs';

export default async function getUserData(req, res) {
    try {
        const accountId = process.env.ACCOUNT_ID;
        const accessToken = await getAccessToken();

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
            const errorData = await response.text(); // Get response as text
            res.status(response.status).json({ error: errorData || 'Failed to fetch user data' });
            return;
        }

        // Try to parse the response as JSON
        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            console.error('Error parsing JSON:', jsonError);
            res.status(500).json({ error: 'Failed to parse user data' });
            return;
        }

        // Send user data as JSON response
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Failed to fetch user data' });
    }
}
