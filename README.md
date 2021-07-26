# tiled-kaboom

This is a map-loader for [kaboom](https://kaboomjs.com/) to load [tiled](https://www.mapeditor.org/) JSON maps.

![screenshot](screenshot.png)


Here is an [example of it running](https://notnullgames.github.io/tiled-kaboom/). Here is [the source](https://github.com/konsumer/tiled-kaboom/blob/main/index.html). This demo uses the latest ES6 module & JSON-import support in up-to-date browsers, and will not work in old browsers, but you can still use the methods below to support them, too.

---


## features

- easy & fun to work with
- think of it as an "advanced map" if you outgrow the awesome built-in kaboom maps
- easier to make more complex maps
- generates regular kaboom text-maps
- handles layers in csv, base64, and 3 kinds of compression
- many ways to import the plugin, depending on how your app is setup
- use tiled map directly, so you don't need to generate a seperate map file for your game


## usage

In your map-files, make sure the encoding is csv/base64/gzip/zlib (not Zstandard or Xml.) Embed your tilemaps.


The basic usage with Kaboom goes like this:

```js
const k = kaboom({
  plugins: [ tiledKaboom ]
})

// then later

const { sprites, levels, key } = await k.loadTiledMap(YOUR_MAP_OBJECT)
for (let level of levels) {
  k.addLevel(level, { width: 32, height: 32, ...key })
}
```

There are a few different ways to get `tiledKaboom` depending on how you are doing things.


### regular tag

If you are not using `type="module"` in your `<script>` tags, and aren't using a bundler, you can do this:

```html
<script src="https://unpkg.com/tiled-kaboom"></script>
```

For compressed maps, you also need pako:

```html
<script src="https://unpkg.com/pako@2.0.3/dist/pako.min.js"></script>
```


This will add `tiledKaboom` to your global-scope, so it can be used with `kaboom`.


### npm-based project

If you are using an npm-based project (like with a bundler of some kind) you can do this:

```sh
npm i tiled-kaboom
```

And then use it:


```js
import tiledKaboom from 'tiled-kaboom'
```

or 

```js
const tiledKaboom = require('tiled-kaboom')
```

### browser es6 module

I personally like to use the new ES6 module support in modern browsers. You can do this a couple ways:

```html
<script type="module">
import tiledKaboom from 'https://unpkg.com/tiled-kaboom@latest/dist/tiled-kaboom.modern.js'
</script>
```

You can also use an import-map, if you want it to look neater in your actual code:

```html
<!-- first tell your browser where to find tiled-kaboom -->
<script type="importmap">
{
  "imports": {
    "pako": "https://unpkg.com/pako@2.0.3/dist/pako.esm.mjs",
    "tiled-kaboom": "https://unpkg.com/tiled-kaboom@latest/dist/tiled-kaboom.modern.js"
  }
}
</script>

<!-- now your imports will look like they do in node -->
<script type="module">
import tiledKaboom from 'tiled-kaboom'
</script>
```

This method is the way to go, if you are using compressed maps and browser ES6 module support.


## credits

- The terrain tiles in demo came from [here](https://opengameart.org/content/tiled-terrains) and uses a terrain-set to make it really fast & easy to make cool maps in tiled.
- The waterfall in demo came from [here](https://opengameart.org/content/lpc-animated-water-and-waterfalls)
- Obviously thanks to [kaboom](https://kaboomjs.com/) and [tiled](https://www.mapeditor.org/), 2 great tools for making games



## TODO

- more testing. only basic map is working
- per-tile collision shapes is nice for things like coastlines
- support for tags ("custom properties")
- support for object-layers (both shapes and images)
- support for animations
- automatic linkage, by name, with objects and sprites
- it might be cool to be able to assign your own symbols to specifc tiles to make maps a little more readable.
- load maps directly (not via `addLevel`) so we can do more advanced things (different map-types, spacing/margin/etc)
- external tilesets
- XML maps/tilesets