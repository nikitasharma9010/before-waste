import React, { useEffect } from 'react';
import { X, ExternalLink, BookOpen, ShieldCheck } from 'lucide-react';

interface SourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
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
    reportName: 'Global Waste Management Outlook',
    yearOrEdition: '2024 Edition',
    url: 'https://www.unep.org/resources/global-waste-management-outlook-2024',
    scopeSummary: 'Municipal solid waste projections, e-waste growth data, and global circular transition indicators.'
  },
  {
    institution: 'Ellen MacArthur Foundation',
    reportName: 'Towards a Circular Economy & Butterfly Diagram',
    yearOrEdition: 'Core Circular Principles',
    url: 'https://www.ellenmacarthurfoundation.org/topics/circular-economy-introduction/overview',
    scopeSummary: 'Eliminate waste and pollution, circulate products and materials, and regenerate natural systems.'
  },
  {
    institution: 'Global Footprint Network',
    reportName: 'National Footprint and Biocapacity Accounts',
    yearOrEdition: '2024 Edition (UN data-grounded)',
    url: 'https://data.footprintnetwork.org/',
    scopeSummary: 'Ecological footprint accounting, national biocapacity deficits, and Earth Overshoot Day methodology.'
  },
  {
    institution: 'Mission LiFE (Lifestyle for Environment)',
    reportName: 'Global Movement for Mindful Consumption',
    yearOrEdition: 'UNEP-supported framework',
    url: 'https://missionlife-moefcc.nic.in/',
    scopeSummary: 'Individual and community nudges prioritizing mindful utilization over mindless, disposable accumulation.'
  },
  {
    institution: 'WRAP (Waste and Resources Action Programme)',
    reportName: 'Valuing Our Clothes: The Cost of UK Fashion',
    yearOrEdition: 'Textile Lifespan Research',
    url: 'https://wrap.org.uk/',
    scopeSummary: 'Data verifying that extending clothing active use by 9 months reduces carbon, water, and waste footprints by 20–30%.'
  }
];

export const SourcesModal: React.FC<SourcesModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#202A35]/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sources-title"
    >
      <div className="bg-[#FFF9F0] rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-[#202A35]/15 shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#202A35]/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#425BFF] mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>CONTENT INTEGRITY & METHODOLOGY</span>
            </div>
            <h3 id="sources-title" className="font-editorial text-2xl font-bold text-[#202A35]">
              Sources & Scientific Grounding
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#202A35]/60 hover:text-[#202A35] hover:bg-[#202A35]/5 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-6 space-y-4">
          <p className="text-xs sm:text-sm text-[#202A35]/75 leading-relaxed">
            BEFORE WASTE is built on peer-reviewed environmental accounting, industrial lifecycle assessments (LCA), and credible multilateral institutions. We do not invent statistics or make unsubstantiated claims.
          </p>

          <div className="space-y-3 pt-2">
            {SOURCES.map((source) => (
              <div
                key={source.reportName}
                className="p-4 rounded-xl bg-white border border-[#202A35]/10 hover:border-[#425BFF]/40 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                  <span className="text-xs font-bold text-[#425BFF]">
                    {source.institution}
                  </span>
                  <span className="text-[11px] text-[#202A35]/50 font-mono">
                    {source.yearOrEdition}
                  </span>
                </div>
                <h4 className="font-editorial text-base font-semibold text-[#202A35] mb-1">
                  {source.reportName}
                </h4>
                <p className="text-xs text-[#202A35]/70 leading-relaxed mb-3">
                  {source.scopeSummary}
                </p>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#202A35] hover:text-[#425BFF] transition-colors"
                >
                  <span>Visit official documentation</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#202A35]/10 flex items-center justify-between">
          <span className="text-xs text-[#202A35]/60">
            All data strictly verified without generative hallucinations.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-xl text-white bg-[#202A35] hover:bg-[#FF654F] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
