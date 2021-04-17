import express from 'express';
import { createConnection } from 'typeorm';
import { mountApollo } from './config/apollo';
import { mountStaticFiles } from './config/static';

const { PORT, NODE_ENV } = process.env;
const app = express();

/* istanbul ignore next */
if (NODE_ENV !== 'test') {
  createConnection()
    .then(async () => {
      console.log('TypeORM connected to Postgres database');
      const server = await mountApollo();
      mountStaticFiles(app);
      server.applyMiddleware({ app });
      app.listen(PORT, () =>
        console.log(`Express app running on port ${PORT}`),
      );
    })
    .catch((err) => console.error(err));
}

export default app;
