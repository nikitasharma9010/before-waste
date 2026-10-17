import React from 'react';
import { ExternalLink } from 'lucide-react';
import { AccessibleDialog } from './AccessibleDialog';

interface SourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

interface SourceItem {
  institution: string;
  reportName: string;
  yearOrEdition: string;
  url: string;
  scopeSummary: string;
}

const SOURCES: SourceItem[] = [
  {
    institution: 'UNEP (United Nations Environment Programme)',
    reportName: 'Global Waste Management Outlook 2024: Beyond an Age of Waste',
    yearOrEdition: 'Published 2024 (Data baseline 2020–2023)',
    url: 'https://www.unep.org/resources/global-waste-management-outlook-2024',
    scopeSummary: 'Municipal solid waste projections, global recycling baselines, and environmental lifecycle analysis.'
  },
  {
    institution: 'UN Global E-waste Monitor (ITU / UNITAR / UNEP)',
    reportName: 'The Global E-waste Monitor 2024',
    yearOrEdition: 'Published 2024 (Data year 2022)',
    url: 'https://ewastemonitor.info/',
    scopeSummary: 'Quantifies 62 million tonnes of global e-waste generated, with documented formal collection and recycling under 23%.'
  },
  {
    institution: 'Ellen MacArthur Foundation',
    reportName: 'A New Textiles Economy: Redesigning Fashion’s Future & Circular Principles',
    yearOrEdition: 'Report published 2017 (Updated 2023)',
    url: 'https://www.ellenmacarthurfoundation.org/a-new-textiles-economy',
    scopeSummary: 'Textile material flow analysis identifying that less than 1% of clothing material is recycled into new clothing, and ~73% is landfilled or incinerated.'
  },
  {
    institution: 'Global Footprint Network',
    reportName: 'National Footprint and Biocapacity Accounts',
    yearOrEdition: '2024 Edition (Data year 2022, based on UN FAO and IEA datasets)',
    url: 'https://data.footprintnetwork.org/',
    scopeSummary: 'Ecological footprint accounting, national biocapacity deficits, and global Earth Overshoot Day calculations. Distinguishes systemic national infrastructure from household consumption.'
  },
  {
    institution: 'WRAP (Waste and Resources Action Programme)',
    reportName: 'Valuing Our Clothes: The Cost of UK Fashion',
    yearOrEdition: 'Published 2017 (UK clothing sector)',
    url: 'https://www.wrap.ngo/resources/report/valuing-our-clothes-cost-uk-fashion',
    scopeSummary: 'UK clothing-sector research on durability, longer active use, and clothing-care practices. Findings depend on the garment and study assumptions.'
  },
  {
    institution: 'Mission LiFE (Lifestyle for Environment)',
    reportName: 'Framework for Mindful Consumption',
    yearOrEdition: 'Multilateral policy framework (MoEFCC & UNEP)',
    url: 'https://missionlife-moefcc.nic.in/',
    scopeSummary: 'Behavioral insights encouraging thoughtful pauses, repairs, and community reuse over disposable consumption.'
  }
];

export const SourcesModal: React.FC<SourcesModalProps> = ({ isOpen, onClose, triggerRef }) => {
  return (
    <AccessibleDialog
      isOpen={isOpen}
      onClose={onClose}
      triggerRef={triggerRef}
      titleId="sources-dialog-title"
      title="Sources & Environmental Methodology"
      descriptionId="sources-dialog-description"
      description="Peer-reviewed research, multilateral lifecycle assessments, and accounting models underlying this project."
      maxWidthClass="max-w-2xl"
    >
      <div className="space-y-4">
        <p className="text-xs sm:text-sm text-ink/80 leading-relaxed">
          BEFORE WASTE synthesizes peer-reviewed environmental accounting, industrial lifecycle assessments (LCA), and published reports from international scientific bodies. We distinguish between systemic infrastructure (such as national energy grids and industrial supply chains) and individual household choices.
        </p>

        <div className="space-y-3 pt-2">
          {SOURCES.map((source) => (
            <div
              key={source.reportName}
              className="p-4 rounded-xl bg-surface border border-ink/10 hover:border-forest/40 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                <span className="text-xs font-bold text-forest">
                  {source.institution}
                </span>
                <span className="text-[11px] text-ink/75 font-mono">
                  {source.yearOrEdition}
                </span>
              </div>
              <h3 className="font-editorial text-base font-semibold text-ink mb-1">
                {source.reportName}
              </h3>
              <p className="text-xs text-ink/75 leading-relaxed mb-3">
                {source.scopeSummary}
              </p>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-ink hover:text-forest focus-visible:ring-2 focus-visible:ring-forest rounded transition-colors"
              >
                <span>Visit official documentation</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-ink/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs text-ink/75">
            These references provide background. Estimates vary by study, product, location, and data year.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 min-h-[44px] text-xs font-medium rounded-xl text-white bg-forest hover:bg-forest-strong focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ink transition-colors cursor-pointer self-end sm:self-auto"
          >
            Close Dialog
          </button>
        </div>
      </div>
    </AccessibleDialog>
  );
};
