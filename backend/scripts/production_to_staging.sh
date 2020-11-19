#!/bin/bash

heroku run yarn typeorm schema:drop -a balans-staging
pg_dump -F p -f remote.sql $PRODUCTION_DB_URL
psql $STAGING_DB_URL < remote.sql
heroku run echo 'Migration starts automatically with docker' -a balans-staging
rm remote.sql
