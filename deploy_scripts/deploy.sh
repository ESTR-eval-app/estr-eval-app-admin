#!/usr/bin/env bash
set -x
if [ $TRAVIS_BRANCH == 'master' ] ; then
    git init

    git remote add deploy "evalapp@stevenlyall.me:~/deploy/admin"
    git config user.name "Travis CI"
    git config user.email "travisCI@travisci.com"

    git add .
    git commit -m "Deploy"
    git push --force deploy master
else
    echo "Not deploying, since this branch isn't master."
fi