#!/bin/bash
# npm run build
# ssh root@120.78.177.9 "mkdir /usr/local/nginx/time-record"
scp -r ./dist.crx root@120.55.51.191:/app/img/extension
