#!/bin/sh
docker run -it --rm -e WEB_API_URL=http://host.docker.internal:4000 -e NATS_URL=http://host.docker.internal:4222 -e STACK_ID=10442485691877829195 testchain-stack-helloworld
