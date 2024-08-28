import { getAccessToken, putRequest } from '../utils/apiUtils.mjs';

export default async function updateRegistrationCheckIn(req, res) {
    const { registrationId, isCheckedIn } = req.body;
    
    // Validate that registrationId, and isCheckedIn are provided
    if (!registrationId || typeof isCheckedIn !== 'boolean') {
        return res.status(400).json({ error: 'registrationId, or isCheckedIn is missing' });
    }

    try {
        const accessToken = await getAccessToken();
        const accountId = process.env.ACCOUNT_ID;

        const registrationData = {
            "Id": registrationId,
            "IsCheckedIn": isCheckedIn
        };

        const url = `https://api.wildapricot.org/v2.3/accounts/${accountId}/eventregistrations/${registrationId}`;
        const result = await putRequest(url, accessToken, registrationData);
        res.json(result);
    } catch (error) {
        console.error('Error updating registration check-in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
