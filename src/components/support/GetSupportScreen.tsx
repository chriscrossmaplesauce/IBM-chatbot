import React, { useState } from 'react';
import { ShieldAlert, HandHeart, MessageSquare, Phone, ExternalLink, AlertTriangle, CheckCircle2, Lock, Clock, Info } from 'lucide-react';

interface SupportResource {
  id: string;
  name: string;
  category: 'EAP' | 'Ministry' | 'Counselling' | 'Peer';
  description: string;
  eligibility: string;
  availability: string;
  contact: string;
  actionType: 'tel' | 'link';
}

const VERIFIED_RESOURCES: SupportResource[] = [
  {
    id: 'res-1',
    name: 'Ministry of Education Teacher Counselling Services',
    category: 'Ministry',
    description: 'Dedicated psychological and counseling support provided by certified educational psychologists for public school teachers.',
    eligibility: 'All active public school teachers, headteachers, and administrative educators.',
    availability: 'Mon - Fri: 8:00 AM - 5:00 PM',
    contact: '+603-8884 6000',
    actionType: 'tel',
  },
  {
    id: 'res-2',
    name: 'Employee Assistance Programme (EAP) Educator Helpline',
    category: 'EAP',
    description: 'Confidential, independent psychological support offering up to 6 free counseling sessions per academic year.',
    eligibility: 'Government and contracted school staff.',
    availability: '24/7 Telephone Intake',
    contact: '1-800-88-2233',
    actionType: 'tel',
  },
  {
    id: 'res-3',
    name: 'National Educator Psychological & Well-being Registry',
    category: 'Counselling',
    description: 'Accredited registry of trauma-informed counselors and clinical psychologists specializing in educator burnout and vocational stress.',
    eligibility: 'Self-referral; confidential external consultation.',
    availability: 'By appointment',
    contact: 'https://www.mentalhealth.org',
    actionType: 'link',
  },
  {
    id: 'res-4',
    name: 'Teacher Union Peer Welfare & Legal Support Desk',
    category: 'Peer',
    description: 'Peer support from seasoned senior teachers for workplace dispute mediation, unfair workload allocation, and member wellbeing.',
    eligibility: 'All teaching union members.',
    availability: 'Mon - Fri: 9:00 AM - 4:00 PM',
    contact: '+603-4042 1234',
    actionType: 'tel',
  },
];

export const GetSupportScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [messageComposerOpen, setMessageComposerOpen] = useState(false);
  const [inquiryTopic, setInquiryTopic] = useState('Workload Exhaustion');
  const [inquiryText, setInquiryText] = useState('');
  const [demoSubmitted, setDemoSubmitted] = useState(false);

  const filteredResources = selectedCategory === 'all'
    ? VERIFIED_RESOURCES
    : VERIFIED_RESOURCES.filter((r) => r.category === selectedCategory);

  const handleSubmitDemoMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoSubmitted(true);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E9EEE5] shadow-xs">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#293A30]">
          You Don't Have to Handle Everything Alone
        </h1>
        <p className="text-sm text-[#687168] mt-1 leading-relaxed">
          Explore support options that fit your situation. Whether you need a listening ear, professional counseling, or immediate safety resources.
        </p>
      </div>

      {/* SECTION C: URGENT AND CRISIS SUPPORT (Placed prominently at top for safety) */}
      <section
        className="bg-red-50/70 border-2 border-red-200 rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden"
        aria-labelledby="crisis-support-heading"
      >
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-red-100 text-red-700 shrink-0">
            <ShieldAlert size={24} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 id="crisis-support-heading" className="text-base sm:text-lg font-bold text-red-950">
                Urgent & Immediate Crisis Support (24/7)
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-red-200/80 text-red-900 px-2 py-0.5 rounded-full">
                Always Free & Confidential
              </span>
            </div>
            <p className="text-xs text-red-900/90 mt-1 leading-relaxed">
              <strong>Please Note:</strong> Cara.ai is an automated AI support guide, not an emergency crisis service. If you are experiencing overwhelming despair, panic, thoughts of self-harm, or are in immediate danger, please reach out to dedicated human crisis responders right now.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4">
              <a
                href="tel:0376272929"
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-red-200 shadow-2xs hover:bg-red-50 text-red-900 transition-colors"
              >
                <div>
                  <div className="text-xs font-bold">Befrienders 24/7 Helpline</div>
                  <div className="text-[11px] text-red-700 font-mono">03-7627 2929</div>
                </div>
                <Phone size={16} className="text-red-600" />
              </a>

              <a
                href="tel:15999"
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-red-200 shadow-2xs hover:bg-red-50 text-red-900 transition-colors"
              >
                <div>
                  <div className="text-xs font-bold">Talian Kasih Helpline</div>
                  <div className="text-[11px] text-red-700 font-mono">15999 (Toll Free)</div>
                </div>
                <Phone size={16} className="text-red-600" />
              </a>

              <a
                href="tel:988"
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-red-200 shadow-2xs hover:bg-red-50 text-red-900 transition-colors"
              >
                <div>
                  <div className="text-xs font-bold">Suicide & Crisis Lifeline</div>
                  <div className="text-[11px] text-red-700 font-mono">Dial 988 or 999</div>
                </div>
                <Phone size={16} className="text-red-600" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION A: MESSAGE A PROFESSIONAL */}
      <section
        className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E9EEE5] shadow-xs"
        aria-labelledby="message-professional-heading"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#E9EEE5] text-[#58715B] shrink-0">
              <MessageSquare size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="message-professional-heading" className="text-lg font-bold text-[#293A30]">
                  Message a Professional
                </h2>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-[#F7F5EF] text-[#687168] border border-[#E9EEE5]">
                  Demo Integration
                </span>
              </div>
              <p className="text-xs text-[#687168] mt-1 leading-relaxed">
                A confidential, asynchronous messaging service connecting teachers with certified educational counselors.
              </p>
            </div>
          </div>
        </div>

        {/* Transparency details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 p-3.5 rounded-xl bg-[#F7F5EF] border border-[#E9EEE5] text-xs text-[#4F5B50]">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-[#58715B] shrink-0" />
            <span>Response time: Within 24-48 school hours</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-[#58715B] shrink-0" />
            <span>Confidentiality: Anonymous code, strict professional ethics</span>
          </div>
          <div className="flex items-center gap-2">
            <Info size={16} className="text-[#58715B] shrink-0" />
            <span>Reviewed by: Licensed Educational Psychologists</span>
          </div>
        </div>

        {!messageComposerOpen ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
            <p className="text-xs text-[#687168]">
              Need guidance on boundary negotiation, student behavior disputes, or severe exhaustion?
            </p>
            <button
              type="button"
              onClick={() => setMessageComposerOpen(true)}
              className="px-4 py-2 bg-[#58715B] hover:bg-[#485e4b] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0"
            >
              Start Confidential Inquiry (Demo)
            </button>
          </div>
        ) : (
          <div className="mt-4 p-4 rounded-xl bg-[#FDFCF9] border border-[#DCE4D6]">
            {!demoSubmitted ? (
              <form onSubmit={handleSubmitDemoMessage} className="space-y-3">
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                  <AlertTriangle size={15} className="shrink-0 mt-0.5 text-amber-700" />
                  <span>
                    <strong>Prototype Notice:</strong> This is a design demonstration. In production, this securely dispatches to licensed counselors. In this prototype, no messages are sent to real people.
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#293A30] block mb-1">
                    Inquiry Topic
                  </label>
                  <select
                    value={inquiryTopic}
                    onChange={(e) => setInquiryTopic(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-white border border-[#DCE4D6] focus:border-[#58715B] focus:outline-none"
                  >
                    <option value="Workload Exhaustion">Workload Exhaustion & Overtime</option>
                    <option value="Classroom Behavior">Challenging Classroom Behavior & Dysregulation</option>
                    <option value="Parent Interaction">Demanding Parent Dispute or Accusation</option>
                    <option value="Imposter Syndrome">Perfectionism, Guilt & Imposter Syndrome</option>
                    <option value="Other">Other Vocational Well-being Topic</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#293A30] block mb-1">
                    Describe your situation (Anonymous)
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={inquiryText}
                    onChange={(e) => setInquiryText(e.target.value)}
                    placeholder="Share what is happening. You don't need to include school names or identifying student details..."
                    className="w-full text-xs p-3 rounded-xl bg-white border border-[#DCE4D6] focus:border-[#58715B] focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setMessageComposerOpen(false)}
                    className="px-3 py-1.5 text-xs text-[#687168] hover:text-[#293A30] font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#58715B] hover:bg-[#485e4b] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                  >
                    Send Demo Message
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-4 text-center">
                <CheckCircle2 size={32} className="mx-auto text-[#58715B] mb-2" />
                <h4 className="text-sm font-bold text-[#293A30]">
                  Demo Inquiry Received
                </h4>
                <p className="text-xs text-[#687168] max-w-sm mx-auto mt-1 leading-relaxed">
                  In a production deployment, this would be queued securely with reference token #{Math.floor(100000 + Math.random() * 900000)}. No personal data was transmitted during this demo.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setDemoSubmitted(false);
                    setMessageComposerOpen(false);
                    setInquiryText('');
                  }}
                  className="mt-3 px-3 py-1.5 text-xs font-semibold bg-[#E9EEE5] text-[#58715B] rounded-lg"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* SECTION B: FIND PROFESSIONAL SUPPORT */}
      <section
        className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E9EEE5] shadow-xs"
        aria-labelledby="find-support-heading"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#E9EEE5] text-[#58715B] shrink-0">
              <HandHeart size={22} />
            </div>
            <div>
              <h2 id="find-support-heading" className="text-lg font-bold text-[#293A30]">
                Find Professional Support
              </h2>
              <p className="text-xs text-[#687168]">
                Verified school wellbeing programs, counseling directories, and educator alliances.
              </p>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-1.5 self-start sm:self-auto">
            {['all', 'EAP', 'Ministry', 'Counselling', 'Peer'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#58715B] text-white'
                    : 'bg-[#F7F5EF] text-[#687168] hover:text-[#293A30]'
                }`}
              >
                {cat === 'all' ? 'All Services' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Directory Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="p-4 rounded-2xl bg-[#FDFCF9] border border-[#E9EEE5] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#58715B] px-2 py-0.5 rounded bg-[#E9EEE5]">
                    {res.category}
                  </span>
                  <span className="text-[11px] text-[#687168]">
                    {res.availability}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#293A30] leading-snug">
                  {res.name}
                </h3>
                <p className="text-xs text-[#4F5B50] mt-1 leading-relaxed">
                  {res.description}
                </p>

                <div className="mt-2.5 pt-2 border-t border-[#E9EEE5] text-[11px] text-[#687168]">
                  <strong className="text-[#293A30]">Eligibility: </strong>
                  {res.eligibility}
                </div>
              </div>

              <div className="mt-3.5 pt-2 border-t border-[#E9EEE5] flex items-center justify-between">
                <span className="text-xs font-mono font-medium text-[#293A30]">
                  {res.contact}
                </span>

                {res.actionType === 'tel' ? (
                  <a
                    href={`tel:${res.contact.replace(/[^0-9+]/g, '')}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#58715B] hover:underline"
                  >
                    <Phone size={13} />
                    <span>Call Now</span>
                  </a>
                ) : (
                  <a
                    href={res.contact}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#58715B] hover:underline"
                  >
                    <ExternalLink size={13} />
                    <span>Open Website</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
