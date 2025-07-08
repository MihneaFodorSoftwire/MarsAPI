import express from "express";
import axios from "axios";

const app = express();
const port = 8000;

app.use(express.json());
const router = express.Router();
router.get('/test', (req: any, res: any) => res.send('Hello world !'));
app.get('/rovers', async (_req: any, res: any) => {
    try {
        const { data } = await axios.get(`https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=${'IpwfgIXjt6qCwGbXccCBXGK2nCldkcxcSiPXBbu3'}`);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch rover data from NASA API' });
    }
});
app.use('/', router);

app.listen(port, () => {
    console.log(`Test backend is running on port ${port}`);
});
