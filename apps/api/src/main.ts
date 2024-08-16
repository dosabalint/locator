import express from 'express';
import cors from 'cors';
import { RawCity } from './models/raw-city';
import { getCities } from './load-cities';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
app.use(cors());

const mapOfCities = new Map<number, Map<number, RawCity>>();

app.get('/cities', (req, res) => {
  res.send({
    cities: getCities().slice(0, Number(req.query.cityCount)),
  });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
