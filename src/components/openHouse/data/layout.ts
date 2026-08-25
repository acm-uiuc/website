/**
 * Venue layout geometry.
 *
 * The map is drawn from `tables_config.json` rather than a static image, so the
 * room re-proportions itself whenever the table counts change. Everything here
 * is pure math in abstract units; the component converts the result to
 * percentages, so the units only matter relative to each other.
 */

export type WallId = 'top' | 'right' | 'bottom' | 'left';

export const WALL_IDS: WallId[] = ['top', 'right', 'bottom', 'left'];

/** Key used in `assignments_config.json` for the free-standing center tables. */
export const CENTER_ID = 'center';

export type SectionId = WallId | typeof CENTER_ID;

export interface CenterConfig {
  rows: number;
  cols: number;
  /** Long axis of each center table. Defaults to 'horizontal'. */
  orientation?: 'horizontal' | 'vertical';
}

export interface Geometry {
  /** Long side of a table. */
  tableLength: number;
  /** Short side of a table (how far it juts out from the wall). */
  tableDepth: number;
  /** Space between neighbouring tables in the same run. */
  gap: number;
  /** Space between a wall run and the edge of the map. */
  edgePad: number;
  /** Aisle kept clear around the center block. */
  aisle: number;
}

export interface VenueLayoutConfig {
  /** Number of table slots along each wall. Omit or use 0 for a bare wall. */
  walls: Partial<Record<WallId, number>>;
  /** Optional block of free-standing tables in the middle of the room. */
  center?: CenterConfig;
  /** Optional overrides for the drawing proportions. */
  geometry?: Partial<Geometry>;
}

export interface TableRect {
  section: SectionId;
  /** Position within its section, matching the index in `assignments_config.json`. */
  index: number;
  /**
   * Which line of tables this slot belongs to: always 0 for a wall, the grid
   * row for the center block. A spanning entry never merges across lines.
   */
  runIndex: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * A map item that is not a booth: the "Partner orgs" bar, a food table, and so
 * on. Fixtures carry their own label and image instead of an org ID, so they
 * do not need to exist in the org data.
 */
export interface MapFixture {
  /** Accessible name, and the visible text when no image resolves. */
  label: string;
  /** Basename of a file in `src/images/openHouse/fixtures/`. */
  image?: string;
  /** How many consecutive slots this item occupies. Defaults to 1. */
  span?: number;
  /**
   * Blurb shown when the fixture is opened. Giving a fixture a description is
   * what makes it clickable — without one there is nothing to show, so it stays
   * an inert label.
   */
  description?: string;
  links?: { text: string; url: string }[];
}

/** A fixture is clickable exactly when it has something to say. */
export const isFixtureInteractive = (fixture: MapFixture) =>
  Boolean(fixture.description);

/** A slot holds an org ID, a fixture, or nothing. */
export type AssignmentEntry = string | MapFixture | null;

export type AssignmentConfig = Partial<
  Record<SectionId, AssignmentEntry[] | undefined>
>;

/** A resolved slot: an entry plus the rectangle it actually covers. */
export interface Placement {
  key: string;
  section: SectionId;
  index: number;
  entry: string | MapFixture;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface VenueLayout {
  /** Room dimensions in the same units as the rects; use for the aspect ratio. */
  width: number;
  height: number;
  tables: TableRect[];
}

const DEFAULT_GEOMETRY: Geometry = {
  tableLength: 10,
  tableDepth: 10,
  gap: 2,
  edgePad: 2.5,
  aisle: 5,
};

/** Length of a run of `n` tables laid end to end. */
const runLength = (n: number, tableLength: number, gap: number) =>
  n > 0 ? n * tableLength + (n - 1) * gap : 0;

/**
 * Turns table counts into positioned rectangles.
 *
 * The room is sized to whichever wall is longest on each axis; shorter walls
 * are centered against their own wall. If the center block would not fit
 * between the wall runs, the room grows to make room for it.
 */
export function computeVenueLayout(config: VenueLayoutConfig): VenueLayout {
  const geo = { ...DEFAULT_GEOMETRY, ...config.geometry };
  const { tableLength, tableDepth, gap, edgePad, aisle } = geo;

  const count = (wall: WallId) =>
    Math.max(0, Math.trunc(config.walls[wall] ?? 0));
  const counts: Record<WallId, number> = {
    top: count('top'),
    right: count('right'),
    bottom: count('bottom'),
    left: count('left'),
  };

  const run = (n: number) => runLength(n, tableLength, gap);

  // Center block dimensions, so the room can be grown to fit it if needed.
  const center = config.center;
  const centerRows = center ? Math.max(0, Math.trunc(center.rows)) : 0;
  const centerCols = center ? Math.max(0, Math.trunc(center.cols)) : 0;
  const centerVertical = center?.orientation === 'vertical';
  const centerTableW = centerVertical ? tableDepth : tableLength;
  const centerTableH = centerVertical ? tableLength : tableDepth;
  const hasCenter = centerRows > 0 && centerCols > 0;
  const blockW = hasCenter
    ? centerCols * centerTableW + (centerCols - 1) * geo.aisle
    : 0;
  const blockH = hasCenter
    ? centerRows * centerTableH + (centerRows - 1) * geo.aisle
    : 0;

  // Interior span on each axis: the longest wall run, but never so small that
  // the center block collides with the wall tables.
  const hSpan = Math.max(
    run(Math.max(counts.top, counts.bottom)),
    hasCenter ? blockW + 2 * aisle : 0
  );
  const vSpan = Math.max(
    run(Math.max(counts.left, counts.right)),
    hasCenter ? blockH + 2 * aisle : 0
  );

  // Wall runs are inset by the depth of the perpendicular tables so the corners
  // do not overlap. A wall with no tables needs no inset.
  const xInset =
    counts.left > 0 || counts.right > 0 ? edgePad + tableDepth + gap : edgePad;
  const yInset =
    counts.top > 0 || counts.bottom > 0 ? edgePad + tableDepth + gap : edgePad;

  const width = hSpan + 2 * xInset;
  const height = vSpan + 2 * yInset;

  // Shorter runs are centered along their wall.
  const startX = (n: number) => xInset + (hSpan - run(n)) / 2;
  const startY = (n: number) => yInset + (vSpan - run(n)) / 2;

  const tables: TableRect[] = [];

  for (let i = 0; i < counts.top; i++) {
    tables.push({
      section: 'top',
      index: i,
      runIndex: 0,
      x: startX(counts.top) + i * (tableLength + gap),
      y: edgePad,
      w: tableLength,
      h: tableDepth,
    });
  }

  for (let i = 0; i < counts.bottom; i++) {
    tables.push({
      section: 'bottom',
      index: i,
      runIndex: 0,
      x: startX(counts.bottom) + i * (tableLength + gap),
      y: height - edgePad - tableDepth,
      w: tableLength,
      h: tableDepth,
    });
  }

  for (let i = 0; i < counts.left; i++) {
    tables.push({
      section: 'left',
      index: i,
      runIndex: 0,
      x: edgePad,
      y: startY(counts.left) + i * (tableLength + gap),
      w: tableDepth,
      h: tableLength,
    });
  }

  for (let i = 0; i < counts.right; i++) {
    tables.push({
      section: 'right',
      index: i,
      runIndex: 0,
      x: width - edgePad - tableDepth,
      y: startY(counts.right) + i * (tableLength + gap),
      w: tableDepth,
      h: tableLength,
    });
  }

  if (hasCenter) {
    const blockX = (width - blockW) / 2;
    const blockY = (height - blockH) / 2;
    for (let r = 0; r < centerRows; r++) {
      for (let c = 0; c < centerCols; c++) {
        tables.push({
          section: CENTER_ID,
          index: r * centerCols + c,
          runIndex: r,
          x: blockX + c * (centerTableW + geo.aisle),
          y: blockY + r * (centerTableH + geo.aisle),
          w: centerTableW,
          h: centerTableH,
        });
      }
    }
  }

  return { width, height, tables };
}

/**
 * Pairs each configured slot with the rectangle it covers.
 *
 * Empty slots (`null`, a short array, or an index swallowed by a preceding
 * span) produce no placement, so nothing is drawn there. An entry with
 * `span > 1` is merged into a single rectangle covering that many consecutive
 * slots — including the gaps between them — which is how a run of wall slots
 * becomes one long bar. Spans stop at the end of their line of tables, so a
 * center-grid entry can never bleed into the next row.
 */
export function resolvePlacements(
  layout: VenueLayout,
  assignments: AssignmentConfig
): Placement[] {
  const bySection = new Map<SectionId, TableRect[]>();
  for (const rect of layout.tables) {
    const rects = bySection.get(rect.section);
    if (rects) {
      rects.push(rect);
    } else {
      bySection.set(rect.section, [rect]);
    }
  }

  const placements: Placement[] = [];

  for (const [section, rects] of bySection) {
    const entries = assignments[section] ?? [];
    const swallowed = new Set<number>();

    for (let i = 0; i < rects.length; i++) {
      if (swallowed.has(i)) {
        continue;
      }
      const entry = entries[i];
      if (entry == null) {
        continue;
      }

      const span =
        typeof entry === 'string'
          ? 1
          : Math.max(1, Math.trunc(entry.span ?? 1));
      const first = rects[i];
      let last = first;
      for (let k = 1; k < span; k++) {
        const next = rects[i + k];
        if (!next || next.runIndex !== first.runIndex) {
          break;
        }
        last = next;
        swallowed.add(i + k);
      }

      const x = Math.min(first.x, last.x);
      const y = Math.min(first.y, last.y);
      placements.push({
        key: `${section}-${i}`,
        section,
        index: i,
        entry,
        x,
        y,
        w: Math.max(first.x + first.w, last.x + last.w) - x,
        h: Math.max(first.y + first.h, last.y + last.h) - y,
      });
    }
  }

  return placements;
}

/**
 * Indexes every fixture in the config by the same key `resolvePlacements`
 * assigns, so a selection can be resolved back to its fixture without
 * recomputing the layout.
 */
export function collectFixtures(
  assignments: AssignmentConfig
): Record<string, MapFixture> {
  const fixtures: Record<string, MapFixture> = {};
  for (const [section, entries] of Object.entries(assignments)) {
    if (!Array.isArray(entries)) {
      continue;
    }
    entries.forEach((entry, index) => {
      if (entry !== null && typeof entry === 'object') {
        fixtures[`${section}-${index}`] = entry;
      }
    });
  }
  return fixtures;
}
