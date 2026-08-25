# Open House Page

Interactive venue map and booth directory for ACM Open House events.

## File Structure

```
openHouse/
  page.tsx                        # Main Preact component (client:load island)
  VenueMap.tsx                    # Draws the floor plan from the layout config
  data/
    oh_config.ts                  # OH-specific overrides + partner org definitions
    assignments_config.json       # Maps table positions to org IDs
    tables_config.json            # Room layout: tables per wall + center block
    layout.ts                     # Layout geometry + slot/entry resolution
```

Fixture artwork (food tables, signage) lives in
`src/images/openHouse/fixtures/`.

**Entry point:** `src/pages/open-house.astro`

## How Data Is Pulled

### SIGs and Committees (API orgs)

Org data (name, description, type, links) is fetched **at build time** from the ACM core API in `open-house.astro`:

```ts
const apiOrgs = await organizationApiClient.apiV1OrganizationsGet();
```

Only orgs with `type === 'sig'` or `type === 'committee'` are included. Their IDs come from the API (e.g. `S01`, `C04`).

### Partner Organizations

Partners are **not** in the API. They are defined manually in `data/oh_config.ts` in the `partnerOrgs` record, keyed by a `P##` ID:

```ts
export const partnerOrgs: Record<string, PartnerOrg> = {
  P01: { name: '...', type: 'partner', description: '...', links: [...] },
};
```

### Logos

Logos are resolved at build time via `import.meta.glob` from `src/images/logos/{orgId}.{ext}` (same pattern as the home page org grid). They are optimized to 256x256 WebP. The filename must match the org ID exactly:

- API orgs: `src/images/logos/S01.png`, `src/images/logos/C04.png`, etc.
- Partners: `src/images/logos/P01.png`, `src/images/logos/P02.png`, etc.

If no logo file exists for an org, a fallback placeholder with the org name is shown.

## Common Tasks

### Add a new partner org

1. Pick the next available `P##` ID (e.g. `P09`).
2. Add the entry to `partnerOrgs` in `data/oh_config.ts`:
   ```ts
   P09: {
     name: 'New Org',
     type: 'partner',
     description: 'Description here.',
     links: [{ text: 'Website', url: 'https://example.com' }],
   },
   ```
3. (Optional) Add a logo at `src/images/logos/P09.png`.
4. Add the org ID to `data/assignments_config.json` at the desired table position.

### Remove an org from Open House

1. Remove its ID from `data/assignments_config.json`.
2. If it's a partner, remove the entry from `partnerOrgs` in `data/oh_config.ts`.
   - API orgs (SIGs/committees) are auto-included from the API, so removing them from `assignments_config.json` is sufficient to remove them from the map. They will still appear in the booth directory unless you filter them out in `open-house.astro`.

### Add a demo time

Add or update an entry in `ohOverrides` in `data/oh_config.ts`:

```ts
export const ohOverrides: Record<string, OHOverride> = {
  S13: { demo_time: '8:10 - 8:15 PM' },
  S05: { demo_time: '8:30 - 8:35 PM' }, // new
};
```

Partner orgs can have `demo_time` set directly in their `partnerOrgs` entry. Any org with a non-null `demo_time` will appear in the "Demo Schedule" modal.

### Change booth/table assignments

Edit `data/assignments_config.json`. Each key is a section of the room
(`"top"`, `"right"`, `"bottom"`, `"left"`, `"center"`) and the array index is
the table position within that section, counting clockwise-ish: left-to-right
along `top` and `bottom`, top-to-bottom along `left` and `right`, and row-major
for `center`. The value is the org ID at that table.

```json
{
  "top": ["C07", "S07", "S09", "S08", "S17", "S05", "C08", "S04"],
  "right": [{ "label": "Partner orgs", "span": 6 }],
  "bottom": ["S03", "S14", "S19", "S15", "S02", "S16", "S18"],
  "left": ["S11", "S10", "S12", "S13", "S01", "S06"],
  "center": [{ "label": "ACM", "image": "acm", "span": 2 }, null, "..."]
}
```

The partner orgs share one bar along the right wall rather than having
individual tables, so no `P##` appears in the wall runs; they are still listed
in the Partners section of the booth directory.

**Leaving a table out.** A table is only drawn when its slot has an org that
exists in the org data. To leave a gap in the middle of a run, put `null` at
that index; to leave the end of a run empty, just make the array shorter than
the wall's table count. Either way the floor is simply empty there — the
remaining tables do not shift.

```json
{ "bottom": ["C02", null, "C07"] }
```

An ID that no longer resolves to an org (for example a SIG removed from the
API) is treated the same way, so a stale entry leaves a gap rather than
rendering a blank table.

### Put something on the map that isn't a booth

A slot can hold a **fixture** instead of an org ID: the "Partner orgs" bar, a
food table, signage — anything with no entry in the org data. Fixtures carry
their own label and image, which is what keeps them out of the `S##`/`C##`/`P##`
ID space entirely.

```json
{ "label": "Food", "image": "burrito", "span": 3 }
```

- **`label`** (required) — the accessible name, and the visible text when no
  image resolves.
- **`image`** (optional) — basename of a file in
  `src/images/openHouse/fixtures/`. See the README there. Missing images fall
  back to the label, so the map renders before the artwork exists.
- **`span`** (optional, default 1) — how many consecutive slots the fixture
  covers. The slots are merged into one rectangle, gaps included, which is how
  a whole wall becomes a single long bar.

Fixtures are drawn as non-interactive labels, not buttons: they are not booths,
so there is nothing to open when you click one.

### Spans and slot numbering

`span` works on org entries too, for a booth that gets a double table. In every
case **the array index stays the table position**, so a span leaves the slots
behind it occupied — pad them with `null` if something follows in the same run:

```json
"center": [
  { "label": "ACM", "image": "acm", "span": 2 },
  null,
  { "label": "Food", "image": "burrito" }
]
```

Here the ACM table covers slots 0 and 1, and the first burrito is at slot 2. An
entry sitting in a slot already covered by a span is ignored, which shows up as
a missing table on the map rather than a silent shift. Spans also stop at the
end of their line, so a center-grid entry can never bleed into the next row.

### Add or rename a booth section

The booth directory sections (Committees, SIGs, Partners) are driven by the `boothSections` array in `page.tsx`:

```ts
const boothSections: { title: string; type: OrgType }[] = [
  { title: 'Committees', type: 'committee' },
  { title: 'Special Interest Groups', type: 'sig' },
  { title: 'Partners', type: 'partner' },
];
```

Add, remove, or reorder entries here. The `type` must match the org's `type` field.

## Interactive Map

The map is **drawn in code**, not loaded as an image. `VenueMap.tsx` reads
`data/tables_config.json`, runs it through `computeVenueLayout()` in
`data/layout.ts`, and renders each table as a positioned `<button>` with the
org's logo inside. There is no image to re-export and no pixel hit detection:
change the config and the map changes with it.

Because the tables are real buttons, they are keyboard-focusable, screen-reader
labelled (`"SIGPwny — Left wall, table 3"`), and rendered into the HTML at build
time, so the map is visible before the JavaScript island hydrates.

### Changing the room shape

`data/tables_config.json`:

```json
{
  "walls": { "top": 8, "right": 6, "bottom": 8, "left": 6 },
  "center": { "rows": 1, "cols": 3, "orientation": "horizontal" }
}
```

- **`walls`** — how many table slots run along each wall. Any wall may be
  omitted or set to `0` for a bare wall.
- **`center`** — an optional grid of free-standing tables in the middle of the
  room. `orientation` is the long axis of each center table and defaults to
  `"horizontal"`. Omit `center` entirely for no center tables.
- **`geometry`** — optional overrides for the drawing proportions
  (`tableLength`, `tableDepth`, `gap`, `edgePad`, `aisle`). The units are
  arbitrary and only matter relative to each other; the defaults in
  `layout.ts` are tuned for a room roughly like this one.

The room sizes itself from the table counts, so the aspect ratio follows the
config automatically:

- Each axis is sized by its longest wall, and a shorter wall is centered along
  its own side (e.g. a 6-table wall opposite an 8-table wall sits centered).
- Wall runs are inset by the depth of the perpendicular tables so corners never
  overlap.
- If the center block would not fit in the aisle between the wall runs, the
  room grows to make space for it.

### Logos on the map

Map tables reuse the same optimized logos as the booth directory, so they cost
no extra download. An org with no logo file falls back to its name in small
type, which can truncate on the narrow side-wall tables — add
`src/images/logos/{orgId}.png` for anything that should be recognizable on the
map.

### Mobile

The map keeps a minimum width so tables stay large enough to tap, and scrolls
horizontally below that with an on-screen hint. The booth directory underneath
is the full list and works at any width.
