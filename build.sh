# !/bin/bash
if [ "$CF_PAGES_BRANCH" != "production" ]; then
    # use development variables
    cp .env.development .env.production
    yarn run build
fi