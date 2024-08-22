import express from 'express';
import getVolunteerOpportunities from '../api/getVolunteerOpportunities.mjs';
import registerForEvent from '../api/registerVolunteer.mjs';
import getUserData from '../api/getUserData.mjs';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/getVolunteerOpportunities', getVolunteerOpportunities);
app.post('/registerVolunteer', registerForEvent)
app.get('/getUserData', getUserData)

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
