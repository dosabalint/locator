import { RawCity } from '../models/raw-city';
import { precisionMultiplier, precisionStep } from '../config';
import { City } from '@locator/models';

class CityRepository {
  private mapOfCities = new Map<number, Map<number, RawCity[]>>();

  insert(city: RawCity): void {
    if (!city.city || !city.lat || !city.lng) {
      console.log('Invalid city: ', city);
      return;
    }

    console.log('Inserting city: ', city);

    const latKey =
      Math.floor(city.lat * precisionMultiplier) / precisionMultiplier;
    const lngKey =
      Math.floor(city.lng * precisionMultiplier) / precisionMultiplier;

    if (!this.mapOfCities.has(latKey)) {
      this.mapOfCities.set(latKey, new Map<number, RawCity[]>());
    }

    if (!this.mapOfCities.get(latKey).has(lngKey)) {
      this.mapOfCities.get(latKey).set(lngKey, []);
    }

    this.mapOfCities.get(latKey).get(lngKey).push(city);
  }

  listAll(): RawCity[] {
    const cities: RawCity[] = [];
    for (const [_, cityMap] of this.mapOfCities) {
      for (const [_, cityList] of cityMap) {
        cities.push(...cityList);
      }
    }
    return cities;
  }

  toTree(): { [key: string]: { [key: string]: RawCity[] } } {
    const tree: { [key: string]: { [key: string]: RawCity[] } } = {};
    for (const [latKey, cityMap] of this.mapOfCities) {
      for (const [lngKey, cityList] of cityMap) {
        if (!tree[latKey]) {
          tree[latKey] = {};
        }
        tree[latKey][lngKey] = cityList;
      }
    }
    return tree;
  }

  debugTree(): void {
    for (const [latKey, latMap] of Object.entries(cityRepository.toTree())) {
      console.log('lat key', latKey);
      for (const [lngKey, cityList] of Object.entries(latMap)) {
        console.log('  * lng key ', lngKey);
        for (const city of cityList) {
          console.log('    * ', city);
        }
      }
    }
  }

  getClosestCities(lat: number, lng: number, cityCount: number): City[] {
    const latMiddle =
      Math.floor(lat * precisionMultiplier) / precisionMultiplier;
    const lngMiddle =
      Math.floor(lng * precisionMultiplier) / precisionMultiplier;

    const findCities = (iteration: number): RawCity[] => {
      console.log('iteration:', iteration);
      const results = this.getCitiesInCircle(
        { lat: latMiddle, lng: lngMiddle },
        precisionStep * iteration * iteration
      );

      if (results.length >= cityCount + 1) {
        return results;
      }

      return findCities(iteration + 1);
    };

    return findCities(1)
      .map(
        (rawCity): City => ({
          name: rawCity.city,
          coords: [rawCity.lat, rawCity.lng],
        })
      )
      .sort(
        (a, b) =>
          Math.sqrt((a.coords[0] - lat) ** 2 + (a.coords[1] - lng) ** 2) -
          Math.sqrt((b.coords[0] - lat) ** 2 + (b.coords[1] - lng) ** 2)
      )
      .slice(0, cityCount + 1);
  }

  getCitiesInCircle(
    center: { lat: number; lng: number },
    radius: number
  ): RawCity[] {
    const cities = [];
    for (const [latKey, cityMap] of this.mapOfCities) {
      for (const [lngKey, cityList] of cityMap) {
        if (this.isInCircle(center, { lat: latKey, lng: lngKey }, radius)) {
          cities.push(...cityList);
        }
      }
    }
    return cities;
  }

  isInCircle(
    center: { lat: number; lng: number },
    point: { lat: number; lng: number },
    radius: number
  ): boolean {
    return (
      Math.sqrt(
        (center.lat - point.lat) ** 2 + (center.lng - point.lng) ** 2
      ) <= radius
    );
  }
}

export const cityRepository = new CityRepository();
