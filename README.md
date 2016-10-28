# Nike+ Importer

This is a small CLI utility that will download JSON data representing all runs you have logged in Nike+. It will try to download all relevant data for each run, including heart rate, GPS coordinates, and timestamps.

## Setup

Simply `cd` to the nikeimporter directory, and install node and all dependencies:

```
brew install node
npm install
```

## Usage

Then, to run the application, simply run the script with your username as the first argument and your password as the second argument:

```
node nikeimporter.js username@email.com yourpasswordhere
```

The script will output the JSON to the terminal. To put it in a file instead, simply redirect the output to a file:

```
node nikeimporter.js username@email.com yourpasswordhere >> output.json
```
