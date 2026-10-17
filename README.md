# hever-map

This is a small script I made to fetch all the places that accepts hever cards (blue and yellow) and put all that data to a map layer supported format

## Generating the map

Run:

```bash
bun install
bun start
```

there sould be a `places.kml` file formed in the root folder

## Using the generated map layer

- go to [google my maps](https://www.google.co.il/maps/d/u/0/) and click "create new map"
- click "import" to import a new layer and choose the `places.kml` file
- give your map a name
- now the new map is saved in your google drive and you can choose and display it in google maps
