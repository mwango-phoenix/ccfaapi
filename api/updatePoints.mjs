import { getAccessToken, putRequest } from '../utils/apiUtils.mjs';

export default async function updatePoints(req, res, value) {
    try {
        const accountId = process.env.ACCOUNT_ID;
        const accessToken = await getAccessToken();
        const userId = req.query.id;

        console.log(userId)

        // Fetch volunteer data to get points
        const url = `https://api.wildapricot.org/v2.3/accounts/${accountId}/contacts/${userId}`
        const updateData = {
            "FieldValues": [
                {
                    "FieldName": "Volunteer Points",
                    "Value": value,
                    "SystemCode": "custom-16464376"
                }
            ],
        }
        const result = await putRequest(url, accessToken, updateData);

        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
