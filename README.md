# 2023-frontend-gent15

## Start the application

First, install the dependencies using `yarn install`.

To start the React app, create a `.env` file in the dist folder with the following content

```properties
NODE_ENV = development

REACT_APP_API_URL=url of your webservice

REACT_APP_AUTH0_DOMAIN=your auth0 domain
REACT_APP_AUTH0_CLIENT_ID=your auth0 client id
REACT_APP_AUTH0_API_AUDIENCE=your auth0 api audience
```

Then run `yarn start`.

## Tests

First, install the dependencies using `yarn install`.

Create a `cypress.env.json` file in the dist folder with the following content 


```properties
{
	"auth_audience": "{YOUR_API_IDENTIFIER}",
	"auth_url": "https://{YOUR_DOMAIN}/oauth/token",
	"auth_client_id": "{YOUR_CLIENT_ID}",
	"auth_client_secret": "{YOUR_CLIENT_SECRET}",
	"auth_username": "{YOUR_TEST_USERNAME}", // customer should exist in the database and be linked to a compant
	"auth_password": "{YOUR_TEST_PASSWORD}"
}
``` 

Start up the development server and always restart it before running the tests.

Then run `yarn test` if you want to use the Cypress UI (run them in chrome) or
`yarn test:cli` if you want to use the Cypress CLI.
