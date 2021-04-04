import express from 'express';
import { join } from 'path';
import { stat } from 'fs';

export const mountStaticFiles = (app: express.Application): void => {
  app.use(express.static(join(__dirname, 'public')));

  app.get('*', (_req, res, next) => {
    const path = join(__dirname, 'public', 'index.html');
    stat(path, (_err, stats) => {
      if (stats) return res.sendFile(path);
      return next();
    });
  });
};
