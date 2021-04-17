FROM node:12-alpine

# setup environment
ENV NODE_ENV=production

# working directory
WORKDIR /app

# copy dependencies files
COPY package.json ./
COPY yarn.lock ./

# install dependencies
RUN yarn

# copy rest of the files
COPY ./ ./
COPY tsconfig.prod.json tsconfig.json

# build source
RUN yarn build

# remove src files
RUN rm -r src/

# set default port
ENV PORT=4000

# entrypoint
ENTRYPOINT ["sh", "/app/docker/entrypoint.sh"]

# start process
CMD ["yarn", "start"]
