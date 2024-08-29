import { getTokenLogin, getAccessToken, getRequest } from '../utils/apiUtils.mjs';

export default async function getUserData(req, res) {
    try {
        const authorizationCode = req.query.authorizationCode;

        const accountId = process.env.ACCOUNT_ID;
        const accessToken = await getTokenLogin(authorizationCode);

        // Fetch user data
        const userDataUrl = `https://api.wildapricot.org/v2.3/accounts/${accountId}/contacts/me`;
        const userData = await getRequest(userDataUrl, accessToken);

        // Extract contactId from user data
        const contactId = userData.Id;

        // Get a new access token for subsequent requests
        const newAccessToken = await getAccessToken();

        // Fetch event registrations
        const registrationsUrl = `https://api.wildapricot.org/v2.3/accounts/${accountId}/eventregistrations?contactId=${contactId}`;
        const registrationsData = await getRequest(registrationsUrl, newAccessToken);
        const registrations = registrationsData.map((registration) => [
            registration.Event.Id, // eventId
            registration.Id,       // registration Id
        ]);

        // Fetch volunteer data to get points
        const volunteerData = await getRequest(userData.Url, newAccessToken);
        const volunteerPoints = volunteerData.FieldValues.find(
            (field) => field.FieldName === 'Volunteer Points'
        )?.Value || 0;

        // Prepare the combined response
        const responseData = {
            Id: contactId,
            FirstName: userData.FirstName,
            LastName: userData.LastName,
            Email: userData.Email,
            Registrations: registrations,
            Points: volunteerPoints,
        };

        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
