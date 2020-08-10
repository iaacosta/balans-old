import express from 'express';
import './config/typeorm';
import { createConnection } from 'typeorm';

import { mountApollo } from './config/apollo';

const { PORT, NODE_ENV } = process.env;
const app = express();
app.get('/', (req, res) => res.send('Cy.ok').status(200));

/* istanbul ignore next */
if (NODE_ENV !== 'test') {
  createConnection()
    .then(async (connection) => {
      console.log('TypeORM connected to Postgres database');
      const server = await mountApollo(connection);
      server.applyMiddleware({ app });
      app.listen(PORT, () =>
        console.log(`Express app running on port ${PORT}`),
      );
    })
    .catch((err) => console.error(err));
}

export default app;
