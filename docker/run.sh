#!/bin/bash

docker run \
    --name miczone_common-kafka_cluster \
    \
    -it --rm \
    \
    -v $PWD:/e2e \
    \
    -w /e2e \
    \
    -e CYPRESS_VIDEO=false \
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
