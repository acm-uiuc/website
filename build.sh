# !/bin/bash
if [ "$CF_PAGES_BRANCH" != "production" ]; then
    # use development variables
    echo "Using development variables in build"
    cp .env.development .env.production
    yarn run build
fi