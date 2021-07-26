// big array of characters that are suitable for maps
// TODO: I got annoyed after 3001
const mapsymbols = [...new Array(4052)].reduce((a, v, c) => {
  if ([
    92,
    173,
    847,
    888,
    889,
    907,
    909,
    930,
    1328,
    1367,
    1368,
    1376,
    1416,
    1419,
    1420,
    1421,
    1424,
    1565,
    1867,
    1868,
    2081,
    2082,
    2094,
    2095,
    2111,
    2140,
    2141,
    2445,
    2446,
    2449,
    2450,
    2473,
    2481,
    2490,
    2491,
    2501,
    2502,
    2505,
    2506,
    2526,
    2532,
    2533,
    2564,
    2577,
    2578,
    2601,
    2609,
    2612,
    2615,
    2618,
    2619,
    2621,
    2633,
    2634,
    2638,
    2639,
    2640,
    2653,
    2692,
    2702,
    2706,
    2729,
    2737,
    2740,
    2746,
    2747,
    2758,
    2762,
    2766,
    2767,
    2788,
    2789,
    2820,
    2829,
    2830,
    2833,
    2834,
    2857,
    2865,
    2868,
    2874,
    2875,
    2885,
    2886,
    2889,
    2890,
    2910,
    2916,
    2917,
    2948,
    2955,
    2956,
    2957,
    2961,
    2966,
    2967,
    2968,
    2971,
    2973,
    2976,
    2977,
    2978,
    2981,
    2982,
    2983,
    2987,
    2988,
    2989,

    ].includes(c)) {
    return a
  }
  
  if (c < 33) {
    return a
  }

  const ranges = [
    [126, 161],
    [895, 900],
    [1479, 1488],
    [1514, 1520],
    [1524, 1536],
    [1969, 1984],
    [2042, 2048],
    [2142, 2207],
    [2238, 2260],
    [2384, 2389],
    [2482, 2486],
    [2510, 2519],
    [2519, 2524],
    [2555, 2561],
    [2570, 2575],
    [2626, 2631],
    [2641, 2649],
    [2654, 2662],
    [2677, 2689],
    [2768, 2784],
    [2801, 2809],
    [2809, 2817],
    [2893, 2902],
    [2903, 2908],
    [2935, 2946]
  ]

  for (let r of ranges) {
    if (c > r[0]  && c < r[1]) {
      return a
    }
  }

  return [...a, String.fromCharCode(c)]
}, [])

function verifyTiledMap (mapObj) {
  // TODO: add more validation here
  if (!mapObj) {
    throw new Error('Map parameter is required.')
  }

  if (mapObj.orientation !== 'orthogonal') {
    throw new Error(`Map is ${mapObj.orientation}. Only orthogonal is currently supported.`)
  }
  if (mapObj.renderorder !== 'right-down') {
    throw new Error(`Map is ${mapObj.renderorder}. Only right-down is currently supported.`)
  }
}

// decode data in Tiled base64 format
function base64Decode(data) {
    const len = data.length
    const bytes = new Array(len / 4)

    // Interpret data as an array of bytes representing little-endian encoded uint32 values.
    for (let i = 0; i < len; i += 4) {
        bytes[i / 4] = (
            data.charCodeAt(i) |
            data.charCodeAt(i + 1) << 8 |
            data.charCodeAt(i + 2) << 16 |
            data.charCodeAt(i + 3) << 24
        ) >>> 0
    }

    return bytes
}

export default (k) => {
  return {
    verifyTiledMap,

    async loadTiledMap(mapObj, location='') {
      verifyTiledMap(mapObj)
      
      const map = {
        sprites: [],
        levels: [],
        key: {}
      }

      let pako

      for (let tileset of mapObj.tilesets) {
        if (tileset.margin !== 0) {
          console.error(`${tileset.name} uses margins. That is currently unsupported. Skipping.`)
          continue
        }
        if (tileset.spacing !== 0) {
          console.error(`${tileset.name} uses spacing. That is currently unsupported. Skipping.`)
          continue
        }

        const sliceX = tileset.imagewidth / tileset.tilewidth
        const sliceY = tileset.imageheight / tileset.tileheight
        map.sprites.push(await k.loadSprite(tileset.name, `${location}${tileset.image}`, { sliceX, sliceY }))

        for (let frame = tileset.firstgid; frame < (tileset.firstgid+tileset.tilecount); frame++){
          map.key[ mapsymbols[frame] ] = [k.sprite(tileset.name, { frame: frame-1 })]
        }
      }

      for (let layer of mapObj.layers) {
        if (layer.type === "tilelayer" && layer.visible) {
          const { width, height } = layer
          let { data } = layer

          if (layer.encoding === 'base64') {
            if (!layer.compression || layer.compression === '') {
              data = base64Decode(atob(data))
            } else {
              if (typeof pako === 'undefined'){
                pako = await import('pako')
              }
              const d = Uint8Array.from(atob(data).split('').map(c => c.charCodeAt(0)))
              data = base64Decode(String.fromCharCode(...pako.inflate(d)))
            }
          }

          const mapArray = [...new Array(width)].map(() => (new Array(height+1).fill(' ')))
          for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
              const cell = (y * width) + x
              if (data[cell] !== 0) {
                mapArray[y][x] = mapsymbols[ data[cell] ]
              }
            }
          }
          map.levels.push(mapArray.map(l => l.join('')))
        }
      }

      return map
    }
  }
}