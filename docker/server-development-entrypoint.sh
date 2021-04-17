#!/bin/sh

# install dependencies
yarn && \

# wait on 5432 port (database) for 15 seconds
yarn wait-on tcp:database:5432 --timeout 15000 && \

# migrate database
yarn db:migrate && \

# run command
exec "$@"
