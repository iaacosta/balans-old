#!/bin/bash

# TODO: set it up with docker

# clean database
yarn typeorm-cli schema:drop
# get database url
DATABASE_URL=$(eval heroku config:get DATABASE_URL -a balans-production)
# dump database
pg_dump --verbose --no-owner --format c -f remote.sql $DATABASE_URL
# restore local database
pg_restore --verbose --clean --no-acl --no-owner -h $DB_HOSTNAME -U $DB_USERNAME -d $DB_NAME remote.sql
# clean file
rm remote.sql


