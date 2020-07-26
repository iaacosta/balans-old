docker build \
  --tag=nacho19/balans \
  --build-arg SECRET=$SECRET \
  --build-arg DB_HOSTNAME=$RDS_HOSTNAME \
  --build-arg DB_NAME=$RDS_NAME \
  --build-arg DB_USERNAME=$RDS_USERNAME \
  --build-arg DB_PASSWORD=$RDS_PASSWORD \
  .
