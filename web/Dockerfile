FROM node:12-alpine

# working directory
WORKDIR /app

# copy dependencies files
COPY package.json ./
COPY yarn.lock ./

# install dependencies
RUN yarn

# setup environment
ENV NODE_ENV=production
ENV REACT_APP_API_URL=https://api.balans.cf/graphql

# copy rest of the files
COPY ./ ./

# start process
CMD ["yarn", "build"]
