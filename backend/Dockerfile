FROM node:12.16.1

# Setup
WORKDIR /app

# Environment variables
ARG PORT=5000
ENV PORT=$PORT
EXPOSE ${PORT}

ARG SECRET
ENV SECRET=$SECRET

ARG DB_HOSTNAME
ENV DB_HOSTNAME=$DB_HOSTNAME

ARG DB_USERNAME
ENV DB_USERNAME=$DB_USERNAME

ARG DB_PASSWORD
ENV DB_PASSWORD=$DB_PASSWORD

ARG DB_NAME
ENV DB_NAME=$DB_NAME

ARG DB_PORT=5432
ENV DB_PORT=$DB_PORT

# Copy files
COPY . .
RUN cp ormconfig.prod.js ormconfig.js

# Install and build
RUN yarn
RUN yarn build

# Command
CMD bash -c "yarn db:migrate && yarn start"
