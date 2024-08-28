import { getAccessToken, postRequest } from '../utils/apiUtils.mjs';

export default async function registerForEvent(req, res) {

    const eventId = req.query.eventId;
    const userData = JSON.parse(req.query.userData);
    // Validate that eventId and userData are provided
    if (!eventId || !userData) {
        return res.status(400).json({ error: 'eventId or userData is missing' });
    }

    try {
        const accessToken = await getAccessToken();
        const accountId = process.env.ACCOUNT_ID;
        const registrationData = {
            "Id": 0,
            "Event": {
                "Id": 5842936
            },
            "Contact": {
                "Id": userData.Id,
            },
            "RegistrationTypeId": 9326765,
            "IsCheckedIn": false,
            "RegistrationFields": [
                {
                    "FieldName": "First name",
                    "Value": userData.FirstName,
                    "SystemCode": "FirstName"
                },
                {
                    "FieldName": "Last name",
                    "Value": userData.LastName,
                    "SystemCode": "LastName"
                },
                {
                    "FieldName": "e-Mail",
                    "Value": userData.Email,
                    "SystemCode": "Email"
                },
                {
                    "FieldName": "Waiver",
                    "Value": true,
                    "SystemCode": "custom-14890495"
                }
            ],
            "ShowToPublic": false
        };

        const url = `https://api.wildapricot.org/v2.3/accounts/${accountId}/eventregistrations`;
        const result = await postRequest(url, accessToken, registrationData);
        res.json(result);
    } catch (error) {
        console.error('Error registering for event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
