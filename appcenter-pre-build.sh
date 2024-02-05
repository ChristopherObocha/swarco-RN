#!/bin/bash
## Getting values from ApppCenter environment and adding to .env file 

cd ${APPCENTER_SOURCE_DIRECTORY}

# # Write variable into .env file
echo "GRAPHQL_URL_DEVELOPMENT=${GRAPHQL_URL_DEVELOPMENT}" >> .env
echo "GRAPHQL_URL_STAGING=${GRAPHQL_URL_STAGING}" >> .env
echo "GRAPHQL_URL_PRODUCTION=${GRAPHQL_URL_PRODUCTION}" >> .env
echo "X_API_KEY=${X_API_KEY}" >> .env
echo "REST_BASE_URL_DEVELOPMENT=${REST_BASE_URL_DEVELOPMENT}" >> .env
echo "REST_BASE_URL_STAGING=${REST_BASE_URL_STAGING}" >> .env
echo "REST_BASE_URL_PRODUCTION=${REST_BASE_URL_PRODUCTION}" >> .env
echo "ENCRYPTION_KEY=${ENCRYPTION_KEY}" >> .env

