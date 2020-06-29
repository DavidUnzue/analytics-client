# Analytics Service Client

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.0.

## Configuration

You can define the API host url and the API Token (needed for authorization) in the file `environments/environments.ts`.

## Start dev server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Show analytics data

You can see all analytis metrics and data corresponding to page views in the dashboard under `http://localhost:4200/dashboard`.

## Generate new page views

You can generate new page views that get processed and stored by the API/server.

For doing that, I created 3 different predefined pages, which you can visit in the client under:

- `http://localhost:4200/page-1`
- `http://localhost:4200/page-2`
- `http://localhost:4200/page-3`

The server will retrieve the corresponding data (IP address, Browser, etc) from the request object sent by the client when you load one of those pages. Retrieving the Country of origin from the IP is buggy and defaults to Germany in case of failure.

If you want to programmatically generate mocked page views, you can do so targeting the corresponding API endpoint directly. Read more on the `analytics-api` repository's README.

## Author

David Unzué  
[davidunzue.com](davidunzue.com)
