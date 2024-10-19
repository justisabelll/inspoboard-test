# inspoboard-test (react-19)

little react-19 app to test out some ideas, probably will redo this with next.js

## requirements

- docker
- bun

## setup

1. create your `.env` file based on the `.example.env` file

   - make sure you generate a jwt secret
     - `openssl rand -base64 32`
   - set your siteowner username and password
     - this is the credentials you will use to login to the app and add/remove content
   - change the `VITE_API_URL` whenever you are ready to deploy to production to whatever your production url is

2. run the following to setup the database

```bash
bun run api db:setup
```

## seed

```bash
bun run api db:seed
```

### extra

in case you want to reset the database or delete it

```bash
bun run api db:reset # to remove all rows and tables
bun run api db:delete # to delete the database file
```

## not working

- make sure your api url does not include a '/' at the end

- there are errors in some ui components, that i believe are due to this being a react-19 project, this should not be a problem for the app

- you might need to run the docker commnads with sudo (probably depending on your os and and docker setups)
