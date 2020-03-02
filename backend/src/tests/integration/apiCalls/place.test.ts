import { createConnection, Connection, getConnection } from 'typeorm';
import {
  query,
  mutate,
  seedPlaces,
  place,
  getExpensesRelated,
  seedSubCategories,
  seedCategories,
  seedCurrencies,
  seedAccounts,
  seedIncomes,
  seedExpenses,
} from '../../utils';
import { places } from '../../utils/data.json';
import Place from '../../../models/Place';

const { GET_PLACES, GET_PLACE, UPDATE_PLACE, DELETE_PLACE } = place;
console.log = jest.fn();

describe('place API calls', () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await createConnection();
  });

  beforeEach(() =>
    seedPlaces()
      .then(seedCategories)
      .then(seedSubCategories)
      .then(seedCurrencies)
      .then(seedAccounts)
      .then(seedIncomes)
      .then(seedExpenses),
  );
  afterAll(() => connection.close());

  describe('getPlaces', () => {
    it('should get correct places', async () => {
      const { data } = await query({ query: GET_PLACES });

      expect(data!.getPlaces).toHaveLength(3);

      places.forEach((_place, idx) => {
        const expenses = getExpensesRelated(_place.id, 'place')!;

        expect(data!.getPlaces[idx]).toMatchObject({
          name: _place.name,
          photoUri: _place.photoUri,
          latitude: _place.latitude,
          longitude: _place.longitude,
          expenses,
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

      const expenses = getExpensesRelated(places[0].id, 'place')!;

      expect(data!.getPlace).toMatchObject({
        id: '1',
        name: places[0].name,
        photoUri: places[0].photoUri,
        latitude: places[0].latitude,
        longitude: places[0].longitude,
        expenses,
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
