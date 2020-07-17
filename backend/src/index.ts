import express from 'express';
import { createConnection } from 'typeorm';

import { mountApollo } from './config/apollo';

const { PORT, NODE_ENV } = process.env;
const app = express();
app.get('/', (req, res) => res.redirect('/graphql'));

/* istanbul ignore next */
if (NODE_ENV !== 'test') {
  createConnection().then(async () => {
    console.log('TypeORM connected to Postgres database');
    const server = await mountApollo();
    server.applyMiddleware({ app });
    app.listen(PORT, () => console.log(`Express app running on port ${PORT}`));
  });
}

export default app;
