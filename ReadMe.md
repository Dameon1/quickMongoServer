# Quick Server with Mongo

[![Build Status](https://travis-ci.org/Dameon1/quickMongoServer.svg?branch=master)](https://travis-ci.org/Dameon1/quickMongoServer)
## Instructions
- Clone this repository into your directory of choice.
- run 'npm install' in your teminal from directory root.
- Create an .env file in root directory that has this format:

    JWT_EXPIRY:'Expires In' example '7d'

    JWT_SECRET='SECRECT YOU WANT'

    DATABASE_URL="ENTER DATABASE URL"

- run 'npm start' in your teminal.

## Attention
- The code to protect endpoints through authentication has been commented out