# Map fixture images

Images for non-booth items on the Open House map (food tables, signage). Drop a
file here and reference it by basename from the `image` field of a fixture entry
in `src/components/openHouse/data/assignments_config.json`:

```json
{ "label": "Food", "image": "burrito" }
```

matches `burrito.png`, `burrito.svg`, etc. Accepted extensions: `png`, `jpg`,
`jpeg`, `webp`, `svg`. Images are width-optimized to WebP at build time with
their aspect ratio preserved, so wide artwork is not cropped.

A fixture whose image is missing falls back to drawing its `label` as text, so
the map still renders before the artwork lands.
