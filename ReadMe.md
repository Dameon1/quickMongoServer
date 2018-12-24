# Quick Server with Mongo

[![Build Status](https://travis-ci.org/Dameon1/quickMongoServer.svg?branch=master)](https://travis-ci.org/Dameon1/quickMongoServer)
## Instructions
- Clone this repository into your directory of choice.
- Run 'npm install' in your terminal from directory root.
- Create an .env file in root directory that has this format:

    JWT_EXPIRY:'Expires In example '7d'

    JWT_SECRET='SECRET YOU WANT'

    DATABASE_URL="ENTER DATABASE URL"

- Run 'npm start' in your terminal to get the application up and running with Nodemon.
- Optionally you can run 'npm test' to after to ensure everything is working. 

## Attention
- The code to protect endpoints through authentication has been commented out