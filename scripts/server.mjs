import express from 'express';
import cors from 'cors';
import getVolunteerOpportunities from '../api/getVolunteerOpportunities.mjs';
import registerForEvent from '../api/registerVolunteer.mjs';
import getUserData from '../api/getUserData.mjs';

const app = express();
const port = 3000;

var corsOptions = {
    origin: 'https://theccfa.net', // Your frontend domain
    allowedHeaders: 'Content-Type', // Allowed headers
}
app.use(express.json());

app.get('/getVolunteerOpportunities', cors(corsOptions), getVolunteerOpportunities);
app.post('/registerVolunteer', cors(corsOptions), registerForEvent);
app.get('/getUserData', cors(corsOptions), getUserData);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
