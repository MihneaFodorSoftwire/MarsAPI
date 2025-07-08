import express from "express";
import axios from "axios";
import {Photo} from "./photo";
import {PhotoResponse} from "./photoResponse";
import {TrimmedPhoto} from "./trimmedPhoto";

const app = express();
const port = 8000;
const NASA_API_KEY = 'IpwfgIXjt6qCwGbXccCBXGK2nCldkcxcSiPXBbu3';

enum Camera {
    FHAZ = 'FHAZ',
    RHAZ = 'RHAZ',
    MAST = 'MAST',
    CHEMCAM = 'CHEMCAM',
    MAHLI = 'MAHLI',
    MARDI = 'MARDI',
    NAVCAM = 'NAVCAM',
    PANCAM = 'PANCAM',
    MINITES = 'MINITES'
}

enum Rovers {
    Curiosity = 'Curiosity',
    Opportunity = 'Opportunity',
    Spirit =  'Spirit'
}

app.use(express.json());

const router = express.Router();
router.get('/test', (_req: any, res: any) => res.send('Hello world!'));

app.get('/rovers', async (_req: any, res: any) => {
    try {
        const { data } = await axios.get(`https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=IpwfgIXjt6qCwGbXccCBXGK2nCldkcxcSiPXBbu3`);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch rover data from NASA API' });
    }
});

app.get('/rovers/:rover/photos/:camera', async (_req: any, res: any) => {
    const { rover, camera } = _req.params;
    const sol = parseInt(_req.query.sol as string) || 1000;

    const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?camera=${camera}&sol=${sol}&api_key=${NASA_API_KEY}`;

    try {
        const { data } = await axios.get<PhotoResponse>(url);

        const trimmedPhotos: TrimmedPhoto[] = data.photos.map((photo: Photo) => ({
            id: photo.id,
            sol: photo.sol,
            camera_name: photo.camera.name,
            img_src: photo.img_src,
            earth_date: photo.earth_date,
            rover_name: photo.rover.name
        }));
        res.json(trimmedPhotos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch rover photos from NASA API' });
    }
});

app.use('/', router);

app.listen(port, () => {
    console.log(`Test backend is running on port ${port}`);
});
