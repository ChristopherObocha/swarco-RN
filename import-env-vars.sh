#!/usr/bin/env bash
## Getting values from 1Password and adding to .env file 

# Login to 1Password. 
# Assumes you have installed the OP CLI and performed the initial configuration
# For more details see https://support.1password.com/command-line-getting-started/
eval $(op signin)

# My setup uses a 1Password type of 'Password' and stores all records within a 
# single section. The label is the key, and the value is the value.
projectVaultName='TD-Project-Swarco'
variablesItemName='env.app'

ev=`op item get --vault=$projectVaultName $variablesItemName --format json | jq -r '.fields'`

# Clear .env file
> .env

echo "$ev" | jq -c -r '.[]' | while IFS= read -r field; do
    label=$(jq -r '.label' <<< "$field")
    value=$(jq -r '.value' <<< "$field")

    if [ "$label" != "null" ] && [ "$value" != "null" ]; then
  
        echo "${label}=${value}" >> .env
    else
       
        echo "${label}: empty field skipped"
    fi
 done
 
