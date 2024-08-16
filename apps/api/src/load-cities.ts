import { cityRepository } from './state/city-repository';

import fs from 'fs';
import readline from 'readline';
import { workspaceRoot } from 'nx/src/utils/app-root';

export const loadCities = async (): Promise<void> => {
  const fileStream = fs.createReadStream(
    `${workspaceRoot}/dist/apps/api/assets/usCities.csv`
  );

  const readlineInterface = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let i = 0;
  for await (const line of readlineInterface) {
    i++;
    if (!i) {
      // skip the first line
      continue;
    }

    const dataArray = line.split(',');

    const city = {
      city: dataArray[0].replace(/"/g, ''),
      lat: +dataArray[6].replace(/"/g, ''),
      lng: +dataArray[7].replace(/"/g, ''),
    };

    cityRepository.insert(city);
  }

  // cityRepository.debugTree();
  console.log(i + ' cities loaded');

  return Promise.resolve();
};
