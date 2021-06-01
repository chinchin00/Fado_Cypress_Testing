#!/bin/bash

docker run \
    --name fado-cypress-testing \
    \
    -it --rm \
    \
    -v $PWD:/e2e \
    \
    -w /e2e \
    \
    -e CYPRESS_ENV_NAME=docker \
    \
    --network=bridge \
    \
    --cpus=1.0 \
    \
    --memory=4096m \
    --memory-swap=0 \
    --memory-swappiness=0 \
    --memory-reservation=3584m \
    --oom-kill-disable \
    \
    cypress/included:7.4.0
