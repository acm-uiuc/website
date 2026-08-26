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

Logos are resolved at build time via `import.meta.glob` from `src/images/logos/{orgId}.{ext}` (same pattern as the home page org grid). They are optimized to WebP at **256px wide, height left to follow the source aspect ratio**. The filename must match the org ID exactly:

- API orgs: `src/images/logos/S01.png`, `src/images/logos/C04.png`, etc.
- Partners: `src/images/logos/P01.png`, `src/images/logos/P02.png`, etc.

If no logo file exists for an org, a fallback placeholder with the org name is shown.

> **Do not pass `height` to `getImage()` here.** Giving it both dimensions lets
> the image service resize to fill and crop the edges off any logo that is not
> square. Local sharp happens to ignore the height, so the damage only shows up
> in the deployed build — several logos are far from square (WCS is 3.92:1).
> The tiles already use `object-contain`, so a non-square image is letterboxed
> correctly on its own.

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
  S17: { demo_time: '7:00 – 7:10 PM' },
  S13: { demo_time: '7:40 – 7:50 PM' }, // new
};
```

Partner orgs can have `demo_time` set directly in their `partnerOrgs` entry. Any org with a non-null `demo_time` appears in the "Demo Schedule" dropdown, which sits above the booth directory and collapses like the other sections.

### Change booth/table assignments

Edit `data/assignments_config.json`. Each key is a section of the room
(`"top"`, `"right"`, `"bottom"`, `"left"`, `"center"`) and the array index is
the table position within that section, counting clockwise-ish: left-to-right
along `top` and `bottom`, top-to-bottom along `left` and `right`, and row-major
for `center`. The value is the org ID at that table.

```json
{
  "top": ["C07", "S07", "S09", "S08", "S17", "S05", "C08", "S04"],
  "right": ["P02", "P03", "P04", "P06", "P10"],
  "bottom": [
    "S03",
    "S14",
    "S19",
    "S15",
    "S02",
    "S16",
    "S18",
    null,
    { "label": "Entrance" }
  ],
  "left": ["S11", "S10", "S12", "S13", "S01", "S06"],
  "center": [{ "label": "ACM Info", "image": "acm", "span": 2 }, null, "..."]
}
```

Partners sit on individual tables along the right wall, the same as any other
org — their `P##` IDs go in the wall run and they pick up their logos and
descriptions exactly like SIGs and committees do.

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

A slot can hold a **fixture** instead of an org ID: a food table, the entrance
marker, signage — anything with no entry in the org data. Fixtures carry their
own label and image, which is what keeps them out of the `S##`/`C##`/`P##` ID
space entirely.

```json
{ "label": "Food", "image": "burrito", "span": 3 }
```

- **`label`** (required) — the accessible name, and the visible text when no
  image resolves.
- **`image`** (optional) — basename of a file in
  `src/images/openHouse/fixtures/`. See the README there. Missing images fall
  back to the label, so the map renders before the artwork exists.
- **`span`** (optional, default 1) — how many consecutive slots the fixture
  covers. The slots are merged into one rectangle, gaps included, so a run of
  slots can become one wide table or a whole bar along a wall.
- **`description`** (optional) — a blurb shown in the detail panel. **Adding
  one is what makes the fixture clickable.**
- **`links`** (optional) — the same `{ text, url }` list orgs use, shown in the
  dialog under the description.

A fixture with no `description` has nothing to show, so it renders as an inert
label rather than a button — that is the right shape for pure signage like the
`Entrance` marker. Give it a description and it becomes a real button, keyboard
focusable and screen-reader labelled like a booth.

### Spans and slot numbering

`span` is a **fixture-only** field. An org entry is a bare ID string, so there is
nowhere to put one and a booth always covers exactly one slot; to give an org a
double table, place a fixture over it instead.

In every case **the array index stays the table position**, so a span leaves the
slots behind it occupied — pad them with `null` if something follows in the same
run:

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

The booth directory sections (SIGs, Committees, Partners) are driven by the `boothSections` array in `page.tsx`:

```ts
const boothSections: { title: string; type: OrgType }[] = [
  { title: 'Special Interest Groups', type: 'sig' },
  { title: 'Committees', type: 'committee' },
  { title: 'Partners', type: 'partner' },
];
```

Add, remove, or reorder entries here. The `type` must match the org's `type` field.

## Before the Event

Things in the page that are deliberately temporary:

- **Placeholder copy.** Search the component and `data/oh_config.ts` for `TODO`.
  Any partner added without a real blurb carries `TODO: add description.`, which
  renders verbatim in the detail panel.
- **Layout churn.** The venue map has changed shape several times. Re-check
  `data/tables_config.json` against the final floor plan before the event; the
  wall counts and the assignments are separate files and can drift apart, and a
  wall count that shrinks silently drops the tables past the end of the run.

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
  "walls": { "top": 9, "right": 6, "bottom": 9, "left": 6 },
  "center": { "rows": 1, "cols": 5, "orientation": "horizontal" }
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
  its own side (e.g. a 6-table wall opposite a 9-table wall sits centered).
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
