#!/bin/bash

docker run -it -v /home/vagrant/PhpstormProjects/apify-scrapers/ai-agent-ghost-poster/storage/:/usr/src/app/storage  $(docker build -q .)
