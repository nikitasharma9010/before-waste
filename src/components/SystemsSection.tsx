import React from 'react';
import { Hammer, Building2, Scale, Heart } from 'lucide-react';

interface SystemPillar {
  icon: typeof Hammer;
  title: string;
  focus: string;
  explanation: string;
  examples: string[];
}

const SYSTEM_PILLARS: SystemPillar[] = [
  {
    icon: Hammer,
    title: 'Product Design & Right to Repair',
    focus: 'Manufacturers & Engineers',
    explanation: 'No matter how much an individual wants to fix an object, if the manufacturer glues the housing shut or restricts spare parts, repair becomes impossible.',
    examples: ['Standardized screws', 'Accessible replacement batteries', 'Free public service manuals']
  },
  {
    icon: Building2,
    title: 'Civic Infrastructure & Collection',
    focus: 'Municipalities & Cities',
    explanation: 'Responsible choices must be physically convenient. Citizens need curbside organics compost, clean drop-off depots, and community tool libraries within walking distance.',
    examples: ['Neighborhood compost hubs', 'Community repair cafes', 'Standardized returnable packaging']
  },
  {
    icon: Scale,
    title: 'Extended Producer Responsibility',
    focus: 'Policy & Governments',
    explanation: 'Laws that require corporations to finance and manage the end-of-life recycling and safe recovery of the packaging and electronics they introduce into the world.',
    examples: ['Mandatory minimum warranties', 'Take-back schemes', 'Bans on planned software obsolescence']
  },
  {
    icon: Heart,
    title: 'Economic Dignity & Affordability',
    focus: 'Society & Equity',
    explanation: 'Sustainable living cannot be a luxury status symbol. Durable, non-toxic, repairable goods must be affordable and accessible to people at every income level.',
    examples: ['Affordable public transit', 'Subsidized repair vouchers', 'Thriving local second-hand markets']
  }
];

export const SystemsSection: React.FC = () => {
  return (
    <section id="systems" className="scroll-mt-20 py-16 lg:py-24 bg-paper border-b border-ink/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="section-kicker text-forest mb-2">
            <span>COLLECTIVE CONVERSATION</span>
            <span aria-hidden="true">·</span>
            <span>INDIVIDUALS & SYSTEMS</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-ink font-normal leading-tight text-balance">
            Better choices need better systems, too.
          </h2>
          <p className="mt-3 text-lg text-ink/80 font-normal leading-relaxed">
            Personal habits matter, but individuals cannot carry the weight of broken supply chains alone. Real change happens when thoughtful citizenship meets bold systemic design.
          </p>
        </div>

        {/* 4 Systemic Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {SYSTEM_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="bg-surface rounded-2xl border border-ink/10 p-5 sm:p-7 shadow-xs hover:border-forest/40 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-sage text-forest flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-ink/75 bg-paper px-2.5 py-1 rounded-md border border-ink/8">
                      {pillar.focus}
                    </span>
                  </div>

                  <h3 className="font-editorial text-xl sm:text-2xl font-semibold text-ink mb-2">
                    {pillar.title}
                  </h3>

                  <p className="text-sm text-ink/75 leading-relaxed mb-5">
                    {pillar.explanation}
                  </p>
                </div>

                <div className="pt-4 border-t border-ink/8">
                  <span className="text-[11px] font-semibold text-ink/75 uppercase tracking-wider block mb-2">
                    What this looks like:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {pillar.examples.map((ex) => (
                      <span
                        key={ex}
                        className="text-xs font-medium px-2.5 py-1 rounded-md bg-paper text-ink/80 border border-ink/8"
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Compassionate takeaway box */}
        <div className="p-6 sm:p-8 rounded-2xl bg-sage/50 border border-sage-border max-w-4xl mx-auto text-center space-y-3">
          <h3 className="font-editorial text-2xl font-semibold text-ink">
            You are a citizen, not just a consumer.
          </h3>
          <p className="text-sm sm:text-base text-ink/80 leading-relaxed max-w-2xl mx-auto">
            When you support right-to-repair bills, patronize neighborhood shoe cobblers, request compost bins in your apartment complex, or borrow from a tool library, you help build the system that makes good choices easy for everyone.
          </p>
        </div>
      </div>
    </section>
  );
};
