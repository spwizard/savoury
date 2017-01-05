PACKAGE_VERSION=$(cat package.json | jq '.version' | sed 's/[", ]//g')

IMAGE_NAME='savory-web'

./node_modules/.bin/grunt build

docker build -t frfrm/$IMAGE_NAME:$PACKAGE_VERSION .

docker push frfrm/$IMAGE_NAME:$PACKAGE_VERSION

