# !/bin/bash
echo "Current branch is $CF_PAGES_BRANCH".
if [ "$CF_PAGES_BRANCH" != "main" ]; then
    # use development variables
    echo "Using staging variables in build"
    cp .env.staging .env.production
fi
yarn
yarn run build
