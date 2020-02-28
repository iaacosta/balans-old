/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createConnection, Connection, getConnection } from 'typeorm';
import { query, mutate, seedPlaces, place } from '../../utils';
import { places } from '../../utils/data.json';
import Place from '../../../models/Place';

const { GET_PLACES, GET_PLACE, UPDATE_PLACE, DELETE_PLACE } = place;
console.log = jest.fn();

describe('place API calls', () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await createConnection();
  });

  beforeEach(() => seedPlaces());
  afterAll(() => connection.close());

  describe('getPlaces', () => {
    it('should get correct places', async () => {
      const { data } = await query({ query: GET_PLACES });

      expect(data!.getPlaces).toHaveLength(3);

      places.forEach((cat, idx) => {
        expect(data!.getPlaces[idx]).toMatchObject({
          name: cat.name,
          photoUri: cat.photoUri,
          latitude: cat.latitude,
          longitude: cat.longitude,
        });
      });
    });
  });

  describe('getPlace', () => {
    it('should get correct place', async () => {
      const { data } = await query({
        query: GET_PLACE,
        variables: { id: 1 },
      });

      expect(data!.getPlace).toMatchObject({
        id: '1',
        name: places[0].name,
        photoUri: places[0].photoUri,
        latitude: places[0].latitude,
        longitude: places[0].longitude,
      });
    });
  });

  describe('updatePlace', () => {
    it('should update a place', async () => {
      await mutate({
        mutation: UPDATE_PLACE,
        variables: { id: 1, name: 'Modified place' },
      });

      const result = await getConnection()
        .createQueryBuilder()
        .select('place')
        .from(Place, 'place')
        .where('place.id = :id', { id: 1 })
        .getOne();

      expect(result).not.toBeUndefined();
      expect(result!.name).toBe('Modified place');
    });

    it('should not update a place', async () => {
      await mutate({
        mutation: UPDATE_PLACE,
        variables: { id: 1, name: '', latitude: 91, longitude: 181 },
      });

      const result = await getConnection()
        .createQueryBuilder()
        .select('place')
        .from(Place, 'place')
        .where('place.id = :id', { id: 1 })
        .getOne();

      expect(result).not.toBeUndefined();
      expect(result!.name).toBe('Example Place 1');
    });
  });

  describe('deletePlace', () => {
    it('should delete a place ', async () => {
      await mutate({
        mutation: DELETE_PLACE,
        variables: { id: 1 },
      });

      const result = await getConnection()
        .createQueryBuilder()
        .select('place')
        .from(Place, 'place')
        .where('place.id = :id', { id: 1 })
        .getOne();

      expect(result).toBeUndefined();
    });
  });
});
