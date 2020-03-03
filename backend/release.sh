yarn build
mkdir release/

mv dist/ release/
cp package.json release/
cp yarn.lock release/
cp ormconfig.prod.js release/ormconfig.js
cp docker-compose.yml release/
cp Dockerfile release/

scp -r ./release/* $SERVER_USER@$SERVER_IP:finanzie/
rm -rf release/
