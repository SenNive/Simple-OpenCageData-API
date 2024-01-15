## Description

This is my simple college project that utilizes the OpenCageData API and Express.js. The API documentation is created using OpenAPI 3 and Swagger.

## Configuration

This project uses environment variables for configuration. These are stored in a `.env` file at the root of the project. Here's what you need to define:

- `DEFAULT_ADMIN_PASSWORD`: For Simple Admin Authentication to Access /admin/users Endpoint.
- `API_KEY`: The API key for the OpenCageData API.

Here's an example of what your `.env` file might look like:
DEFAULT_ADMIN_PASSWORD=password123
API_KEY=abcdefghij1234567890

## Database

The `sql/mapserviceusers.sql` file contains the SQL commands to create the necessary tables for the application.

## Running the Project

1. Install the required dependencies by running `npm install` in the project directory.
2. Start the project by running `npm start`.

## API Endpoints

Here are the main API endpoints provided by the application:

- `GET /map/worldwide?query={query}`: This endpoint performs worldwide geocoding. It takes a `query` parameter, which is a string representing the location to geocode. It returns the geocoded information for the location.

- `GET /map/reverse?lat={latitude}&lng={longitude}`: This endpoint performs reverse geocoding. It takes `lat` and `lng` parameters, which represent the latitude and longitude of a location. It returns the geocoded information for the location.

- `GET /map/forward?query={query}`: This endpoint performs forward geocoding. It takes a `query` parameter, which is a string representing the location to geocode. It returns the latitude and longitude of the location.

- `GET /map/calculateDistance?from={fromLocation}&to={toLocation}`: This endpoint calculates the distance between two locations. It takes `from` and `to` parameters, which are strings representing the locations to calculate the distance between. It returns the distance in kilometers.

All endpoints require authentication. The username for authentication is passed as a query parameter `username`. (It's just a basic authentication method, maybe i'll implement more secure authentication method)

For more detailed information about the API endpoints, please refer to the [Swagger documentation](docs/swagger.yaml).

## Project Structure

The project has the following structure:
- `controllers/`: This directory contains the controller files for the application. The `adminController.js` handles the admin-related routes and `mapController.js` handles the map-related routes.
- `handlers/`: This directory contains the handler files. The `adminHandler.js` handles the admin-related logic and `mapHandler.js` handles the map-related logic.
- `utils/`: This directory contains utility files. The `db.js` file is used for database-related operations. The `HTTP_STATUS_CODES.js` file contains HTTP status codes. The `sendRequest.js` file is used to send requests to the OpenCageData API.
- `server.js`: This is the entry point of the application.

## License

This project is licensed under the terms of the MIT license. See the [LICENSE](LICENSE.md) file for details.