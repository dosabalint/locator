import express from 'express';
import cors from 'cors';
import { RawCity } from './models/raw-city';
import { loadCities } from './load-cities';
import { cityRepository } from './state/city-repository';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
app.use(cors());

app.get('/cities', (req, res) => {
  res.send({
    cities:
      req.query.lat && req.query.lat
        ? cityRepository.getClosestCities(
            +req.query.lat,
            +req.query.lng,
            +req.query.cityCount
          )
        : cityRepository.listAll().map((rawCity: RawCity) => ({
            name: rawCity.city,
            coords: [rawCity.lat, rawCity.lng],
          })),
  });
});

const seedData = async () => {
  await loadCities();
};

seedData().then(() => {
  app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
  });
});
