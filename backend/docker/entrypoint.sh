#!/bin/sh

# migrate database
yarn typeorm migration:run

# exec CMD
exec "$@"
