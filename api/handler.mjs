import { getEventDetails } from './getVolunteerOpportunities.mjs';
import registerForEvent  from './registerVolunteer.mjs';

export default async function handler(req, res) {
    try {
        if (req.method === 'POST') {
            const { eventId, userData } = req.body;
            const registrationResult = await registerForEvent(eventId, userData);
            res.status(200).json(registrationResult);
        } else {
            const events = await getEventDetails();
            console.log("yay")
            res.status(200).json(events);
        }
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).send('Internal Server Error');
    }
}