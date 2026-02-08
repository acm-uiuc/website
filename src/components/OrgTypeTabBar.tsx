import { useStore } from '@nanostores/preact';

import {
  $activeOrgType,
  $committees,
  $sigs,
  setActiveOrgType,
  type OrgType,
} from '../stores/organization';

interface Props {
  initialCounts: Record<OrgType, number>;
}

const tabs: { type: OrgType; label: string; description: string }[] = [
  {
    type: 'sig',
    label: 'SIGs',
    description:
      'SIGs, or Special Interest Groups, focus on specific areas of computer science.',
  },
  {
    type: 'committee',
    label: 'Committees',
    description:
      'Committees serve the broader ACM and CS community, often working across multiple groups.',
  },
];

const OrgTypeTabBar = ({ initialCounts }: Props) => {
  const activeType = useStore($activeOrgType);
  const sigs = useStore($sigs);
  const committees = useStore($committees);

  const counts: Record<OrgType, number> = {
    sig: sigs.length || initialCounts.sig,
    committee: committees.length || initialCounts.committee,
  };

  const activeTab = tabs.find((t) => t.type === activeType)!;

  return (
    <div class="flex flex-col items-center mb-4">
      <div class="inline-flex rounded-lg bg-gray-200 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.type}
            onClick={() => setActiveOrgType(tab.type)}
            class={`px-6 py-2 rounded-md text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
              activeType === tab.type
                ? 'bg-navy-900 text-white shadow-sm'
                : 'text-gray-600 hover:text-navy-900'
            }`}
          >
            {tab.label}
            {counts[tab.type] > 0 && (
              <span
                class={`text-xs rounded-full px-1.5 py-0.5 font-medium ${
                  activeType === tab.type
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {counts[tab.type]}
              </span>
            )}
          </button>
        ))}
      </div>
      <p class="mt-3 text-sm text-gray-500 max-w-2xl text-center">
        {activeTab.description}
      </p>
    </div>
  );
};

export default OrgTypeTabBar;
