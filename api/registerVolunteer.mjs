import { getAccessToken, postRequest } from '../utils/apiUtils.mjs';

export default async function registerForEvent(req, res) {
    // Check if req.body is defined
    if (!req.body) {
        return res.status(400).json({ error: 'Request body is missing' });
    }

    // Destructure eventId and userData from req.body
    const { eventId, userData } = req.body;

    // Validate that eventId and userData are provided
    if (!eventId || !userData) {
        return res.status(400).json({ error: 'eventId or userData is missing' });
    }

    try {
        const accessToken = await getAccessToken();
        const accountId = process.env.ACCOUNT_ID;
        const registrationData = {
            "Event": {
                "Id": eventId
            },
            "Contact": {
                "Id": userData.contactId
            },
            "RegistrationTypeId": 9326765,
            "GuestRegistrationsSummary": {
                "NumberOfGuests": 0,
                "NumberOfGuestsCheckedIn": 0,
                "GuestRegistrations": []
            },
            "IsCheckedIn": false,
            "RegistrationFields": [
                {
                    "FieldName": "First name",
                    "Value": userData.firstName,
                    "SystemCode": "FirstName"
                },
                {
                    "FieldName": "Last name",
                    "Value": userData.lastName,
                    "SystemCode": "LastName"
                },
                {
                    "FieldName": "e-Mail",
                    "Value": userData.email,
                    "SystemCode": "Email"
                },
                {
                    "FieldName": "Phone",
                    "Value": userData.phone,
                    "SystemCode": "Phone"
                },
                {
                    "FieldName": "Waiver",
                    "Value": true,
                    "SystemCode": "custom-14890495"
                }
            ],
            "ShowToPublic": false
        };

        console.log(registrationData)
        const url = `https://api.wildapricot.org/v2.3/accounts/${accountId}/eventregistrations`;
        const result = await postRequest(url, accessToken, registrationData);
        res.json(result);
    } catch (error) {
        console.error('Error registering for event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
