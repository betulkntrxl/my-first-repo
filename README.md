# What is this

This is the code repository for ChatApp. ChatApp is a web application which has similar functionality to ChatGPT. The ChatApp supports two languages, English and French.

Currently there are two instances running in production (You need to be on VPN)

- [McKesson ChatApp](https://chatapp.mckesson.com/)
- [Uson ChatApp](https://chatapp.usoncology.com/)

# What's in this repository

- Application code
  - React Frond end [src folder](src/)
  - NodeJS/Express Server [server folder](server/)
- [Dockerfile](Dockerfile)
- Kubernetes deployment configuration [.kube folder](.kube/)
- GitHub Actions CI/CD and dependabot workflows [workflows folder](.github/workflows/)
- General development configuration, linting, formatting, SonarQube etc...

# Setting up locally for development

## Install Requirements:

- Node 18.16.0+
- Npm 9.8.0+
- Yarn 1.22.19+

## Set up environmental variables:

To run the application locally you need to trust the internal CA certs and set environmental variables to communicate with Okta, Mulesoft etc...

When running locally the session store is configured to be in memory so no configuration/creds is needed, in the deployed Kubernetes environment the session store is configured to use Redis.

Below are the environmetal variables you need to set, sensitive values are ommitted, these values can be got from another developer working on ChatApp or from our ChatApp Azure KeyVault <TODO: link to Azure KeyVault>

### Trust CA Certs:

The certs are checked into this repository in the [certs folder](certs/) so we just need to set the following environmental variable

NODE_EXTRA_CA_CERTS=certs/mule-chain.pem

### Mulesoft Creds:

MULESOFT_OPENAI_CLIENT_SECRET=

MULESOFT_OPENAI_CLIENT_ID=

### Mulesoft URLs:

// GPT-3.5 Turbo 4K

MULESOFT_OPENAI_CHAT_API_URL=

// GPT-4

MULESOFT_OPENAI_CHAT_API_URL_GPT4=

### Run McKesson Instance:

ORG_DEPLOYMENT='mckesson'

OKTA_APP_BASE_URL=

OKTA_CLIENT_SECRET=

OKTA_CLIENT_ID=

OKTA_ISSUER=

### Run USON Instance:

ORG_DEPLOYMENT='uson'

USON_OKTA_BASE_URL=

USON_OKTA_CLIENT_SECRET=

USON_OKTA_CLIENT_ID=

USON_OKTA_ISSUER=

## Installing dependencies:

In the root folder type the following to install dependencies for the React code

- yarn

In the root folder type the following to install dependencies for the Server code

- cd server
- yarn

## Running locally:

NOTE: You need to be on VPN to run locally because the Mulesoft APIs are internal only

In the root folder follow these steps

- yarn prod-server
- When the server starts go to http://localhost:8080 the ChatApp UI should now be running
