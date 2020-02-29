/* eslint-disable no-multi-assign */
/* eslint-disable no-empty */
import * as typeorm from 'typeorm';
import * as classValidator from 'class-validator';
import * as resolvers from '../../../graphql/resolvers/place';
import * as model from '../../../models/Place';
import { expensesById } from '../../../graphql/resolvers/expense';

const examplePlace: any = {
  id: 0,
  name: 'Example Place',
  photoUri: 'http://example.com/fileName',
  latitude: 0,
  longitude: 0,
  expenses: [{ id: 1 }, { id: 2 }, { id: 3 }],
};

jest.mock('../../../graphql/resolvers/expense', () => ({
  expensesById: jest.fn(),
}));

describe('Place resolvers', () => {
  let getRepository: jest.SpyInstance;
  let placeResolver: jest.SpyInstance;
  let placeById: jest.SpyInstance;
  let createReadStream: jest.Mock;
  let uploadFile: jest.Mock;
  let removeFile: jest.Mock;
  let find: jest.Mock;
  let findOne: jest.Mock;
  let save: jest.Mock;
  let remove: jest.Mock;
  let validateOrReject: jest.SpyInstance;
  let photo: Promise<any>;

  const Place = ((model.default as any) = jest.fn());

  beforeEach(() => {
    jest.resetModules();
    process.env = { S3_URL: 'http://example.com' };

    find = jest.fn(() => [examplePlace]);
    findOne = jest.fn(() => examplePlace);
    save = jest.fn(() => examplePlace);
    remove = jest.fn(() => 0);
    createReadStream = jest.fn(() => 'stream');
    removeFile = jest.fn(() => true);
    uploadFile = jest.fn(() => 'http://example.com/fileName');
    photo = Promise.resolve({
      createReadStream,
      mimetype: 'example/mimetype',
    });

    validateOrReject = jest
      .spyOn(classValidator, 'validateOrReject')
      .mockImplementation();

    getRepository = jest
      .spyOn(typeorm, 'getRepository')
      .mockImplementation(() => ({ find, findOne, save, remove } as any));
  });

  afterEach(() => {
    (expensesById as jest.Mock).mockClear();
    getRepository.mockClear();
    validateOrReject.mockClear();
    placeResolver.mockClear();
    find.mockClear();
    findOne.mockClear();
    save.mockClear();
    remove.mockClear();
    Place.mockClear();
  });

  describe('placeById', () => {
    beforeEach(() => {
      placeResolver = jest.spyOn(resolvers, 'placeResolver');
    });

    afterEach(() => placeResolver.mockClear());
    afterAll(() => placeResolver.mockRestore());

    it('should call placeResolver once', async () => {
      getRepository.mockImplementation(() => ({
        findOne: () => examplePlace,
      }));
      await resolvers.placeById(0);
      expect(placeResolver).toHaveBeenCalledTimes(1);
    });

    it('should call placeResolver with correct argument', async () => {
      getRepository.mockImplementation(() => ({
        findOne: () => examplePlace,
      }));
      await resolvers.placeById(0);
      expect(placeResolver).toHaveBeenCalledWith(examplePlace);
    });

    it("should throw error if find doesn't succeed", async () => {
      getRepository.mockImplementation(() => ({ findOne: () => null }));
      expect(resolvers.placeById(0)).rejects.toBeTruthy();
    });

    it("should not call placeResolver if find doesn't succeed", async () => {
      getRepository.mockImplementation(() => ({ findOne: () => null }));

      try {
        await resolvers.placeById(0);
      } catch (err) {}

      expect(placeResolver).not.toHaveBeenCalled();
    });
  });

  describe('placeResolver', () => {
    it('should generate static properties correctly', () => {
      const place = resolvers.placeResolver(examplePlace);
      expect(place.id).toBe(examplePlace.id);
      expect(place.name).toBe(examplePlace.name);
    });

    it('should call expensesById one time with correct arguments', () => {
      const account = resolvers.placeResolver(examplePlace);
      account.expenses();
      expect(expensesById).toHaveBeenCalledTimes(1);
      expect(expensesById).toHaveBeenCalledWith([1, 2, 3]);
    });
  });

  describe('Query', () => {
    describe('getPlaces', () => {
      const getPlaces = resolvers.default.Query.getPlaces as any;

      it('should call find when invoked getPlaces', async () => {
        await getPlaces();
        expect(find).toHaveBeenCalledTimes(1);
      });

      it('should map results of query into placeResolver', async () => {
        placeResolver = jest
          .spyOn(resolvers, 'placeResolver')
          .mockImplementation();

        getRepository.mockImplementation(() => ({ find: () => [1, 2, 3] }));
        await getPlaces();
        expect(placeResolver).toHaveBeenCalledTimes(3);

        /**
         * I put the next two arguments (number, index, list)
         * because of been called on a map
         */
        expect(placeResolver).toHaveBeenNthCalledWith(1, 1, 0, [1, 2, 3]);
        expect(placeResolver).toHaveBeenNthCalledWith(2, 2, 1, [1, 2, 3]);
        expect(placeResolver).toHaveBeenNthCalledWith(3, 3, 2, [1, 2, 3]);
        placeResolver.mockRestore();
      });
    });

    describe('getPlace', () => {
      const getPlace = resolvers.default.Query.getPlace as any;

      beforeEach(() => {
        placeById = jest.spyOn(resolvers, 'placeById').mockImplementation();
      });

      afterEach(() => placeById.mockClear());
      afterAll(() => placeById.mockRestore());

      it('should call placeById with correct id', async () => {
        await getPlace(null, { id: 0 });
        expect(placeById).toHaveBeenCalledTimes(1);
        expect(placeById).toHaveBeenCalledWith(0);
      });
    });
  });

  describe('Mutation', () => {
    describe('createPlace', () => {
      const createPlace = resolvers.default.Mutation.createPlace as any;

      beforeEach(() => findOne.mockImplementation(() => 'Example place'));

      it('should construct new Place when invoked', async () => {
        await createPlace(
          null,
          { name: 'Example place', photo, latitude: 0, longitude: 0 },
          { s3: { uploadFile } },
        );

        expect(Place).toHaveBeenCalledTimes(1);
        expect(Place).toHaveBeenCalledWith('Example place', 0, 0);
      });

      it('should call repository save method when invoked', async () => {
        await createPlace(
          null,
          { name: 'Example place', photo, latitude: 0, longitude: 0 },
          { s3: { uploadFile } },
        );

        const place = new Place('Example place', 0, 0);
        place.photoUri = 'http://example.com/fileName';

        expect(save).toHaveBeenCalledTimes(1);
        expect(save).toHaveBeenCalledWith(place);
      });

      it('should call uploadFile with correct arguments', async () => {
        await createPlace(
          null,
          { name: 'Example place', photo, latitude: 0, longitude: 0 },
          { s3: { uploadFile } },
        );

        expect(uploadFile).toHaveBeenCalledTimes(1);
        expect(uploadFile).toHaveBeenCalledWith('example/mimetype', 'stream');
      });

      it('should call validateOrReject when invoked', async () => {
        await createPlace(
          null,
          { name: 'Example place', photo, latitude: 0, longitude: 0 },
          { s3: { uploadFile } },
        );

        const place = new Place('Example place', 0, 0);
        place.photoUri = 'http://example.com/fileName';

        expect(validateOrReject).toHaveBeenCalledTimes(1);
        expect(validateOrReject).toHaveBeenCalledWith(place);
      });

      it('should reject if uploadFile fails', async () => {
        uploadFile.mockImplementation(() => {
          throw new Error();
        });

        expect(
          createPlace(
            null,
            { name: 'Example place', photo, latitude: 0, longitude: 0 },
            { s3: { uploadFile } },
          ),
        ).rejects.toBeTruthy();
      });

      it('should not call upload file if validateOrReject fails', async () => {
        validateOrReject.mockImplementation(() => {
          throw new Error();
        });

        try {
          await createPlace(
            null,
            { name: 'Example place', photo, latitude: 0, longitude: 0 },
            { s3: { uploadFile } },
          );
        } catch (err) {}

        expect(uploadFile).not.toHaveBeenCalled();
      });
    });

    describe('updatePlace', () => {
      const updatePlace = resolvers.default.Mutation.updatePlace as any;

      beforeEach(() => {
        placeResolver = jest
          .spyOn(resolvers, 'placeResolver')
          .mockImplementation();
      });

      it('should call findOne method of getRepository', async () => {
        await updatePlace(
          null,
          { id: 0, name: 'Example place', photo, latitude: 0, longitude: 0 },
          { s3: { uploadFile } },
        );

        expect(findOne).toHaveBeenCalledTimes(1);
        expect(findOne).toHaveBeenCalledWith(0, { relations: ['expenses'] });
      });

      it("should reject if findOne doesn't succeed", async () => {
        getRepository.mockImplementation(() => ({ findOne: () => null }));
        expect(
          updatePlace(
            null,
            { id: 0, name: 'Example place', photo, latitude: 0, longitude: 0 },
            { s3: { uploadFile } },
          ),
        ).rejects.toBeTruthy();
      });

      it('should change base attributes if given', async () => {
        const reference = { name: 'Not modified', latitude: 10, longitude: 10 };
        findOne.mockImplementation(() => reference);

        await updatePlace(
          null,
          { id: 0, name: 'Modified', latitude: 0, longitude: 0 },
          { s3: { uploadFile } },
        );

        expect(reference.name).toBe('Modified');
        expect(reference.latitude).toBe(0);
        expect(reference.longitude).toBe(0);
      });

      it('should call uploadFile with args if photo given', async () => {
        const reference = {
          id: 0,
          name: 'Not modified',
          photoUri: 'http://example.com/fileName',
        };

        findOne.mockImplementation(() => reference);

        await updatePlace(
          null,
          { id: 0, name: 'Modified', photo },
          { s3: { uploadFile } },
        );

        expect(uploadFile).toHaveBeenCalledTimes(1);
        expect(uploadFile).toHaveBeenCalledWith(
          'example/mimetype',
          'stream',
          'fileName',
        );
      });

      it('should call save on happy path', async () => {
        await updatePlace(null, { id: 0 }, { s3: { uploadFile } });

        expect(save).toHaveBeenCalledTimes(1);
        expect(save).toHaveBeenCalledWith(examplePlace);
      });

      it('should wrap result on placeResolver on happy path', async () => {
        save.mockImplementation(() => 'dummy');
        await updatePlace(null, { id: 0 }, { s3: { uploadFile } });
        expect(placeResolver).toHaveBeenCalledTimes(1);
        expect(placeResolver).toHaveBeenCalledWith('dummy');
      });

      it('should call validateOrReject on happy path', async () => {
        await updatePlace(null, { id: 0 }, { s3: { uploadFile } });
        expect(validateOrReject).toHaveBeenCalledTimes(1);
        expect(validateOrReject).toHaveBeenCalledWith(examplePlace);
      });

      it('should not call uploadFile if validateOrReject rejects and photo given', async () => {
        validateOrReject.mockImplementation(() => {
          throw new Error();
        });

        try {
          await updatePlace(null, { id: 0, photo }, { s3: { uploadFile } });
        } catch (err) {}

        expect(uploadFile).not.toHaveBeenCalled();
      });
    });

    describe('deletePlace', () => {
      const deletePlace = resolvers.default.Mutation.deletePlace as any;
      beforeEach(() => {
        placeResolver = jest
          .spyOn(resolvers, 'placeResolver')
          .mockImplementation();
      });

      it('should call findOne method of getRepository', async () => {
        await deletePlace(null, { id: 0 }, { s3: { uploadFile, removeFile } });
        expect(findOne).toHaveBeenCalledTimes(1);
        expect(findOne).toHaveBeenCalledWith(0);
      });

      it("should reject if find doesn't succeed", () => {
        getRepository.mockImplementation(() => ({ findOne: () => null }));
        expect(
          deletePlace(null, { id: 0 }, { s3: { uploadFile, removeFile } }),
        ).rejects.toBeTruthy();
      });

      it("should not call removeFile if find doesn't succeed", async () => {
        getRepository.mockImplementation(() => ({ findOne: () => null }));

        try {
          await deletePlace(
            null,
            { id: 0 },
            { s3: { uploadFile, removeFile } },
          );
        } catch (err) {}

        expect(removeFile).not.toHaveBeenCalled();
      });

      it('should call remove and removeFile on happy path', async () => {
        await deletePlace(null, { id: 0 }, { s3: { uploadFile, removeFile } });
        expect(remove).toHaveBeenCalledTimes(1);
        expect(removeFile).toHaveBeenCalledTimes(1);
        expect(remove).toHaveBeenCalledWith(examplePlace);
        expect(removeFile).toHaveBeenCalledWith('http://example.com/fileName');
      });
    });
  });
});
