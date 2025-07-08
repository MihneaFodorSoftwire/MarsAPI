import express from "express";
import axios from "axios";
import {Photo} from "./photo";
import {PhotoResponse} from "./photoResponse";
import {TrimmedPhoto} from "./trimmedPhoto";

require('dotenv').config();
const NASA_API_KEY = process.env.NASA_API_KEY;

const app = express();
const port = 8000;

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
router.get('/test', (req: any, res: any) => res.send('Hello world!'));

app.get('/rovers', async (req: any, res: any) => {
    try {
        const url = `https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=${NASA_API_KEY}`;
        const { data } = await axios.get(url);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch rover data from NASA API' });
    }
});

app.get('/rovers/:rover/photos/:camera', async (req: any, res: any) => {
    const { rover, camera } = req.params;
    const { sol, earth_date, paginationStart, paginationEnd } = req.query;

    let startIndex: number|undefined;
    let endIndex: number|undefined;

    let earthDate: string|undefined;

    let url: string = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?camera=${camera}&sol=${sol}&api_key=${NASA_API_KEY}`;

    if (paginationStart && paginationEnd) {
        if (paginationStart > paginationEnd) {
            return res.status(400).json({error: 'paginationStart must be smaller than paginationEnd'});
        }
        startIndex = parseInt(paginationStart, 10);
        endIndex = parseInt(paginationEnd, 10);
    }

    if (earth_date) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(earth_date as string)) {
            return res.status(400).json({error: 'Invalid earth_date format. Use YYYY-MM-DD'});
        }
        earthDate = `${earth_date}`;
    }

    try {
        const { data } = await axios.get<PhotoResponse>(url);

        const trimmedPhotos: TrimmedPhoto[] = data.photos.map((photo: Photo) => ({
            id: photo.id,
            sol: photo.sol,
            cameraName: photo.camera.name,
            imgSrc: photo.img_src,
            earthDate: photo.earth_date,
            roverName: photo.rover.name
        }));
        res.json(trimmedPhotos
            .slice(startIndex, endIndex)
            .filter((photo): photo is TrimmedPhoto => photo.earthDate === earthDate));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch rover photos from NASA API' });
    }
});

app.use('/', router);

app.listen(port, () => {
    console.log(`Test backend is running on port ${port}`);
});
