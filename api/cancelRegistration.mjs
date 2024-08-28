import { getAccessToken, deleteRequest } from '../utils/apiUtils.mjs';

export default async function deleteRegistration(req, res) {
    const { registrationId } = req.query;

    // Validate that registrationId is provided
    if (!registrationId) {
        return res.status(400).json({ error: 'registrationId is missing' });
    }

    try {
        const accessToken = await getAccessToken();
        const accountId = process.env.ACCOUNT_ID;

        const url = `https://api.wildapricot.org/v2.3/accounts/${accountId}/eventregistrations/${registrationId}`;
        const result = await deleteRequest(url, accessToken);
        res.json(result);
    } catch (error) {
        console.error('Error deleting registration:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
