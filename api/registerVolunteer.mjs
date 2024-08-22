import { getAccessToken, postRequest } from '../utils/apiUtils.mjs';

export default async function registerForEvent(eventId, userData) {
    const accessToken = await getAccessToken();
    const accountId = process.env.ACCOUNT_ID;
    
    const registrationData = {
        "Id": 0,
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

    const url = `https://api.wildapricot.org/v2.3/accounts/${accountId}/eventregistrations`;
    return await postRequest(url, accessToken, registrationData);
}