# tiled-kaboom

This is a map-loader for [kaboom](https://kaboomjs.com/) to load [tiled](https://www.mapeditor.org/) JSON maps.

![screenshot](screenshot.png)

You can find a deployed example of it running, [here](https://notnullgames.github.io/tiled-kaboom/).


The terrain tiles came from [here](https://opengameart.org/content/tiled-terrains) and uses a terrain-set to make it really fast & easy to make cool maps in tiled.

In your map-files, make sure the layer-format is "CSV" and compression is turned off. Embed your tilemaps.

You can see example-usage of the library [here](https://github.com/konsumer/tiled-kaboom/blob/main/index.html).

You can test it out with this command:

```sh
npm start
```

### TODO

- more testing. only basic map is working
- support more modes/orientation
- margin/spacing will probably require more work on kaboom-side
- per-tile collision shapes is nice for things like coastlines
- support for tags ("custom properties")
- support for object-layers (both shapes and images)
- support for animations
- automatic linkage, by name, with objects and sprites