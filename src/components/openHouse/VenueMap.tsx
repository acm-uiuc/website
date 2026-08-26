import type { OHOrgData } from './data/oh_config';
import {
  computeVenueLayout,
  isFixtureInteractive,
  resolvePlacements,
  type AssignmentConfig,
  type MapFixture,
  type Placement,
  type SectionId,
  type VenueLayoutConfig,
} from './data/layout';

interface VenueMapProps {
  layoutConfig: VenueLayoutConfig;
  assignments: AssignmentConfig;
  orgsData: Record<string, OHOrgData>;
  /** Optimized images for map fixtures, keyed by the config's `image` value. */
  fixtureImages: Record<string, string>;
  selectedBooth: string | null;
  onSelect: (orgId: string) => void;
}

const sectionLabels: Record<SectionId, string> = {
  top: 'Top wall',
  right: 'Right wall',
  bottom: 'Bottom wall',
  left: 'Left wall',
  center: 'Center',
};

/** Shared geometry classes for anything drawn on the floor. */
const tableBase =
  'absolute flex items-center justify-center overflow-hidden rounded-md border p-[2px] shadow-sm';

/**
 * Draws the venue floor plan from the layout config.
 *
 * Only configured slots are drawn, so a short (or `null`-gapped) row in
 * `assignments_config.json` simply leaves empty floor where that table would
 * have been. Slots holding a fixture rather than an org ID are drawn as
 * non-interactive labels — they are not booths, so there is nothing to open.
 */
export default function VenueMap({
  layoutConfig,
  assignments,
  orgsData,
  fixtureImages,
  selectedBooth,
  onSelect,
}: VenueMapProps) {
  const layout = computeVenueLayout(layoutConfig);
  const placements = resolvePlacements(layout, assignments);
  // Everything unpicked steps back while a table is open, so the selected one
  // reads at a glance rather than being hunted for.
  const anySelected = selectedBooth !== null;

  const boxStyle = (placement: Placement) => ({
    left: `${(placement.x / layout.width) * 100}%`,
    top: `${(placement.y / layout.height) * 100}%`,
    width: `${(placement.w / layout.width) * 100}%`,
    height: `${(placement.h / layout.height) * 100}%`,
  });

  // Tall, narrow boxes read better with their label running along the long axis.
  const isUpright = (placement: Placement) => placement.h > placement.w;

  const labelClass = (placement: Placement) =>
    `overflow-hidden text-center leading-[1.15] font-medium break-words hyphens-auto ${
      isUpright(placement)
        ? 'max-h-full [writing-mode:vertical-rl]'
        : 'max-w-full'
    }`;

  // Fixture labels scale with the box they sit in, so a bar merged across a
  // whole wall gets big type while a single-slot table still fits its text.
  // Both box dimensions are a fraction of `layout.width` once the aspect ratio
  // is applied, so one divisor covers either axis. `cqw` resolves against the
  // map container, which is fluid between its min and max width.
  const fixtureLabelStyle = (placement: Placement) => {
    const across = isUpright(placement) ? placement.w : placement.h;
    const cqw = (across / layout.width) * 100 * 0.2;
    return { fontSize: `clamp(0.5rem, ${cqw.toFixed(2)}cqw, 1rem)` };
  };

  const renderFixture = (placement: Placement, fixture: MapFixture) => {
    const image = fixture.image ? fixtureImages[fixture.image] : undefined;
    const isSelected = selectedBooth === placement.key;
    const body = image ? (
      <img
        src={image}
        alt={fixture.label}
        decoding="async"
        className="size-full object-contain"
      />
    ) : (
      <span
        className={`${labelClass(placement)} text-gray-600`}
        style={fixtureLabelStyle(placement)}
      >
        {fixture.label}
      </span>
    );

    // Fixtures keep the neutral fill even when selected, so the palette still
    // reads "navy = interactive" rather than "navy = booth".
    if (!isFixtureInteractive(fixture)) {
      return (
        <div
          key={placement.key}
          className={`${tableBase} border-surface-150 bg-surface-100`}
          style={boxStyle(placement)}
          title={fixture.label}
        >
          {body}
        </div>
      );
    }

    return (
      <button
        key={placement.key}
        id={`booth-${placement.key}`}
        type="button"
        onClick={() => onSelect(placement.key)}
        aria-label={`${fixture.label} — ${sectionLabels[placement.section]}`}
        aria-pressed={isSelected}
        title={fixture.label}
        // Fixtures are not scaled on hover the way booth tiles are: they range
        // from a single slot to a whole wall, and growing a wall-length bar
        // pushes it outside the room outline.
        className={`${tableBase} cursor-pointer bg-surface-100 transition-all duration-200 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-600 ${
          isSelected
            ? 'z-20 border-navy-600 ring-3 ring-navy-500/45 shadow-[0_0_0_2px_rgba(255,255,255,0.9),0_4px_18px_rgba(0,119,255,0.55)]'
            : anySelected
              ? 'border-surface-150 opacity-70 hover:opacity-100'
              : 'border-surface-150 hover:border-navy-300 hover:bg-surface-150'
        }`}
        style={boxStyle(placement)}
      >
        {body}
      </button>
    );
  };

  const renderBooth = (placement: Placement, orgId: string) => {
    const org = orgsData[orgId];
    // An ID that no longer resolves (a SIG dropped from the API, say) leaves
    // empty floor rather than an anonymous table.
    if (!org) {
      return null;
    }
    const isSelected = selectedBooth === orgId;
    return (
      <button
        key={placement.key}
        // Lets the detail panel find and scroll to this table. The id matches
        // whatever value onSelect passes, so booths and fixtures share it.
        id={`booth-${orgId}`}
        type="button"
        onClick={() => onSelect(orgId)}
        aria-label={`${org.name} — ${sectionLabels[placement.section]}, table ${placement.index + 1}`}
        aria-pressed={isSelected}
        title={org.name}
        className={`${tableBase} cursor-pointer transition-all duration-200 hover:z-10 hover:scale-110 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-600 ${
          isSelected
            ? 'z-20 scale-[1.28] border-navy-600 bg-navy-50 ring-3 ring-navy-500/45 shadow-[0_0_0_2px_rgba(255,255,255,0.9),0_4px_18px_rgba(0,119,255,0.55)]'
            : anySelected
              ? 'border-navy-200 bg-white opacity-70 hover:opacity-100'
              : 'border-navy-300 bg-white'
        }`}
        style={boxStyle(placement)}
      >
        {org.logo ? (
          <img
            src={org.logo}
            alt=""
            // No width/height: the box is fixed by CSS, so declaring a square
            // ratio only tells the browser to draw non-square art stretched
            // until the real dimensions arrive.
            decoding="async"
            className="size-full object-contain"
          />
        ) : (
          <span
            className={`${labelClass(placement)} text-[0.5rem] text-navy-700`}
          >
            {org.name}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div
        className="relative mx-auto min-w-[720px] max-w-4xl rounded-2xl border border-surface-150 bg-[#fbfcfe]"
        style={{
          aspectRatio: `${layout.width} / ${layout.height}`,
          containerType: 'inline-size',
          // Faint dot grid so the floor reads as a surface rather than a void.
          backgroundImage:
            'radial-gradient(circle, rgb(148 163 184 / 0.22) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
        role="group"
        aria-label="Venue map. Select a table to see booth details."
      >
        {placements.map((placement) =>
          typeof placement.entry === 'string'
            ? renderBooth(placement, placement.entry)
            : renderFixture(placement, placement.entry)
        )}
      </div>
    </div>
  );
}
