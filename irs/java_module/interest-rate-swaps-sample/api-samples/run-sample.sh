#!/bin/bash

curl -H "Content-Type: application/json" -X POST -d @${1} http://localhost:5521/api/runContract
