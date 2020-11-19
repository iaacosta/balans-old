#!/bin/bash

# TODO: set it up with docker

# clean database
yarn typeorm-cli schema:drop
# dump database
pg_dump -F p -f remote.sql $PRODUCTION_DB_URL
# restore local database
psql $DB_URL < remote.sql
# clean file
rm remote.sql


