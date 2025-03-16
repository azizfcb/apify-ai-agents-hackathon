#!/bin/bash

docker run -it -v /home/vagrant/PhpstormProjects/apify-scrapers/cover-letter-ai/storage/:/usr/src/app/storage  $(docker build -q .)
