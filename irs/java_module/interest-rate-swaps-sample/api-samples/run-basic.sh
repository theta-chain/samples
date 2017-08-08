#!/bin/bash

function postJson {
        curl -H "Content-Type: application/json" -X POST $*
}


postJson -d @runContractInput-1.json  http://localhost:5521/api/runContract
postJson -d @runContractInput-2.json  http://localhost:5521/api/runContract
postJson -d @addInterestRate-input1.json  http://localhost:5521/api/runContract
#postJson -d @checkForPayments-1.json	  http://localhost:5521/api/runContract

