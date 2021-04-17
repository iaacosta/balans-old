#!/bin/bash

heroku run yarn --cwd backend typeorm schema:drop -a balans-staging
PRODUCTION_DB_URL=$(eval heroku config:get DATABASE_URL -a balans-production)
STAGING_DB_URL=$(eval heroku config:get DATABASE_URL -a balans-staging)
pg_dump --verbose --format p -f remote.sql $PRODUCTION_DB_URL
psql $STAGING_DB_URL < remote.sql
heroku run yarn --cwd backend typeorm migration:run -a balans-staging
rm remote.sql
