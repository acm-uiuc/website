# !/bin/bash
echo "Current branch is $CF_PAGES_BRANCH".
if [ "$CF_PAGES_BRANCH" != "main" ]; then
    # use development variables
    echo "Using development variables in build"
    cp .env.development .env.production
fi
yarn run build