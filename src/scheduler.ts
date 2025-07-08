import axios from 'axios';
import cron from 'node-cron';

const fetchRoverData = async () => {
    try {
        const url = `https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=DEMO_KEY`;
        const { data } = await axios.get(url);
        console.log('Rover data fetched successfully:', data);
    } catch (err) {
        console.error('Error fetching rover data:', err);
    }
};

cron.schedule('*/300 * * * *', () => {
    console.log('Running scheduled task to fetch rover data:');
    fetchRoverData();
});
