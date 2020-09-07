#!/bin/bash

# TODO: set it up with docker

# clean database
yarn typeorm-cli schema:drop
# dump database
pg_dump -Fc -f rds.bak postgres://$RDS_USERNAME:$RDS_PASSWORD@$RDS_HOSTNAME:5432/$RDS_NAME
# restore local database
pg_restore -c -U $DB_USERNAME -h $DB_HOSTNAME -d $DB_NAME -Fc --no-acl rds.bak
# clean file
rm rds.bak


