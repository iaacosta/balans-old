import express from 'express';
import { join } from 'path';
import { createConnection } from 'typeorm';

import { mountApollo } from './config/apollo';

const { PORT, NODE_ENV } = process.env;
const app = express();

app.use(express.static(join(__dirname, 'public')));
app.get('*', (req, res) => res.sendFile(join(__dirname, 'public', 'index.html')));

/* istanbul ignore next */
if (NODE_ENV !== 'test') {
  createConnection()
    .then(async () => {
      console.log('TypeORM connected to Postgres database');
      const server = await mountApollo();
      server.applyMiddleware({ app });
      app.listen(PORT, () =>
        console.log(`Express app running on port ${PORT}`),
      );
    })
    .catch((err) => console.error(err));
}

export default app;
