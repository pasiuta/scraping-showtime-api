
# Web Scraping API

## Overview
The Web Scraping API facilitates the extraction of structured data from web pages. It is designed for content aggregation, data analysis, and automating data collection processes from websites.

## Prerequisites
Before using the Web Scraping API, ensure the following are installed:

- **Node.js**: Download and install from [Node.js official website](https://nodejs.org/).
- **NPM (Node Package Manager)**: Install via `npm install -g npm`.
- **Axios**: Ensure Axios is installed for HTTP requests.
- **Cheerio**: Required for HTML parsing and manipulation.
- **Postman**: For API testing, download from [Postman website](https://www.postman.com/downloads/).
- **Database**: Set up a PostgreSQL database for data persistence.

## Installation
1. Clone the project repository.
2. Navigate to the project directory.
3. Run `npm install` to install dependencies.

## Usage

### Starting the API
Run the API server using the command:

```bash
npm run start:dev
```

### Scraping a Website
To initiate scraping, send a GET request to `http://localhost:3000/scrape` with the required URL query parameter.

Example Request:

```http
GET http://localhost:3000/scrape?url=http://example.com
```

### Responses
The API responds with structured data extracted from the provided URL.

## API Endpoints

### GET /scrape
- **Description**: Initiates the scraping process.
- **Query Parameters**:
    - `url`: URL of the website to scrape.
- **Responses**:
    - `200 OK`: Returns scraped data.
    - `400 Bad Request`: Invalid or missing URL.
    - `500 Internal Server Error`: Server-side error during scraping.

## Error Handling
- `400 Bad Request`: Occurs if the URL is missing or improperly formatted.
- `500 Internal Server Error`: Indicates server-side issues in fetching or parsing HTML.
```