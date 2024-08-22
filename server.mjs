import express from 'express';
import handler from './api/handler.mjs';

const app = express();
const port = 3000;

app.use(express.json());

app.all('*', handler);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});