#!/bin/sh

# install dependencies
yarn && \

# run command
exec "$@"
