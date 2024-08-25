import express from 'express';
import cors from 'cors';
import getVolunteerOpportunities from '../api/getVolunteerOpportunities.mjs';
import registerForEvent from '../api/registerVolunteer.mjs';
import getUserData from '../api/getUserData.mjs';

const app = express();
const port = 3000;
const corsOptions = {
    origin: 'https://theccfa.net',
    methods: 'GET,POST,OPTIONS',
    optionsSuccessStatus: 204 // for handling OPTIONS requests
};
app.use(express.json());
app.use(cors())

app.get('/getVolunteerOpportunities', getVolunteerOpportunities);
app.post('/registerVolunteer', registerForEvent);
app.get('/getUserData', getUserData);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
