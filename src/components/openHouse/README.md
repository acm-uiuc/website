# Open House Page

Interactive venue map and booth directory for ACM Open House events.

## File Structure

```
openHouse/
  page.tsx                        # Main Preact component (client:load island)
  data/
    oh_config.ts                  # OH-specific overrides + partner org definitions
    assignments_config.json       # Maps table positions to org IDs
    tables_config.json            # Table pixel coordinates for map click detection
```

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

Edit `data/assignments_config.json`. Each key (`"left"`, `"right"`) is a row of tables. The array index corresponds to the table position (0 = first table in that row). The value is the org ID assigned to that table.

```json
{
  "left":  ["C01", "C05", "C04", ...],
  "right": ["C02", "C06", "C07", ...]
}
```

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

The map images (`oh_map.svg` for landscape, `oh_map_vertical.svg` for portrait) live in `src/images/openHouse/`. They are imported and optimized at build time in `open-house.astro` via `getImage()`, and the resulting URLs are passed to the Preact component as `mapSrc` and `mapVerticalSrc` props.

When a user clicks the map, `page.tsx` translates the click coordinates into a table position using `data/tables_config.json`, then looks up the assigned org in `data/assignments_config.json`.

`tables_config.json` has `horizontal` and `vertical` variants with:

- `image_details`: pixel dimensions of the SVG and individual table size
- `rows`: named rows with orientation, table count, and starting pixel coordinates

If the map SVGs change, the pixel coordinates in `tables_config.json` must be updated to match.
