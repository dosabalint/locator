import { City } from '@locator/models';

export const getCities = (): City[] => {
  return [
    {
      name: 'New York',
      coords: [40.6943, -73.9249],
    },
    {
      name: 'Los Angeles',
      coords: [34.1141, -118.4068],
    },
    {
      name: 'Chicago',
      coords: [41.8375, -87.6866],
    },
    {
      name: 'Miami',
      coords: [25.784, -80.2101],
    },
  ];
};
