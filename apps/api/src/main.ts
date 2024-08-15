import express from 'express';
import { City } from './models/city';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

const mapOfCities = new Map<number, Map<number, City>>();

app.get('/cities', (req, res) => {
  res.send({
    cities: [
      { name: 'Egypt', coords: [26.8206, 30.8025] },
      { name: 'United Kingdom', coords: [55.3781, 3.436] },
      { name: 'United States', coords: [37.0902, -95.7129] },
    ],
  });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
