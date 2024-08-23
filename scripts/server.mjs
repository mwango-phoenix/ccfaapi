import express from 'express';
import cors from 'cors';
import getVolunteerOpportunities from '../api/getVolunteerOpportunities.mjs';
import registerForEvent from '../api/registerVolunteer.mjs';
import getUserData from '../api/getUserData.mjs';

const app = express();
const port = 3000;

// Use the cors middleware with specific origin
app.use(cors({
    origin: 'https://theccfa.net',
}));

app.use(express.json());

app.get('/getVolunteerOpportunities', getVolunteerOpportunities);
app.post('/registerVolunteer', registerForEvent);
app.get('/getUserData', getUserData);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
