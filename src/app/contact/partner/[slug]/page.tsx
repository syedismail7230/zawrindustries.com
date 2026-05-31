"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

type ModelType = 
  | 'Technology Partnerships' 
  | 'Strategic Alliances' 
  | 'Channel Partnerships' 
  | 'Startup Partnerships' 
  | 'Industry Partnerships' 
  | 'Content Creator & Influencer Partnerships' 
  | 'Research & Innovation Partnerships';

const slugMap: Record<string, ModelType> = {
  'technology-partner': 'Technology Partnerships',
  'strategic-alliance': 'Strategic Alliances',
  'channel-partner': 'Channel Partnerships',
  'startup-partner': 'Startup Partnerships',
  'industry-partner': 'Industry Partnerships',
  'research-partner': 'Research & Innovation Partnerships',
  'creator-partner': 'Content Creator & Influencer Partnerships'
};

export default function PartnershipFormPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const activeModel = slugMap[slug] || null;

  const [activeStep, setActiveStep] = useState<number>(1);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // If the slug is invalid, redirect back to parent partner page
  useEffect(() => {
    if (!activeModel) {
      router.replace('/contact/partner');
    }
  }, [activeModel, router]);

  // Common Fields State for Standard Forms (Models 1-6)
  const [commonFields, setCommonFields] = useState({
    fullName: '',
    companyName: '',
    designation: '',
    email: '',
    phone: '',
    website: '',
    country: 'United States',
    industry: 'Technology',
    companySize: '10-50 employees',
    partnershipGoals: '',
    expectedCollab: [] as string[],
    timeline: 'Immediate (1-3 months)',
    budgetRange: '$10,000 - $50,000',
    uploadedDocName: '',
    additionalNotes: '',
    consent: false
  });

  // 1. Technology Specific Fields
  const [techSpecifics, setTechSpecifics] = useState({
    productName: '',
    techCategory: 'Software / SaaS',
    existingCustomerBase: '',
    integrationRequirements: '',
    apisAvailable: 'Yes',
    technicalTeamSize: '',
    deploymentRegions: '',
    infrastructureModel: 'Cloud / SaaS',
    existingPartnerships: '',
    requestedCollabAreas: ''
  });

  // 2. Strategic Alliances Specific Fields
  const [strategicSpecifics, setStrategicSpecifics] = useState({
    organizationType: 'Enterprise',
    businessObjectives: '',
    geographicPresence: '',
    expansionGoals: '',
    durationPreference: 'Long-term (1+ years)',
    existingAlliances: '',
    targetMarkets: '',
    expectedOutcomes: ''
  });

  // 3. Channel / Reseller Specific Fields
  const [channelSpecifics, setChannelSpecifics] = useState({
    salesTeamSize: '',
    regionsCovered: '',
    existingDistributionNetwork: '',
    annualCustomerReach: '',
    currentProductsSold: '',
    resellerExperience: '',
    revenueExpectations: '',
    supportRequirements: ''
  });

  // 4. Startup Specific Fields
  const [startupSpecifics, setStartupSpecifics] = useState({
    startupStage: 'Seed Stage',
    fundingStage: 'Pre-seed',
    productStatus: 'MVP Available',
    teamSize: '',
    industryVertical: '',
    currentRevenueRange: '',
    mvpStatus: 'Yes',
    fundingRaised: '',
    lookingFor: [] as string[]
  });

  // 5. Industry Specific Fields
  const [industrySpecifics, setIndustrySpecifics] = useState({
    industrySegment: '',
    operationalGeography: '',
    industryChallenges: '',
    existingSystems: '',
    desiredOutcomes: '',
    useCases: '',
    industryCertifications: ''
  });

  // 6. Research & Innovation Specific Fields
  const [researchSpecifics, setResearchSpecifics] = useState({
    institutionType: 'Academic Labs',
    researchArea: '',
    innovationFocus: '',
    patentStatus: 'No Patents Yet',
    researchFundingStatus: '',
    publications: '',
    researchDuration: '',
    collaborationGoals: ''
  });

  // 7. Creator & Influencer Specific Fields (Completely Custom Layout)
  const [creatorForm, setCreatorForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    brandName: '', // Channel name
    website: '',   // Social profile
    country: 'United States',
    consent: false,
    creatorCategory: 'Technology Content Creators',
    primaryPlatform: 'YouTube',
    contentNiche: '',
    channelLink: '',
    agencyRepresentation: 'No',
    subscribersCount: '',
    averageReach: '',
    monthlyViews: '',
    audienceGeography: '',
    audienceAgeGroups: '',
    audienceInterests: '',
    preferredPartnership: 'Brand Ambassador Programs',
    contentFormats: '',
    previousBrands: '',
    portfolioUrl: '',
    expectedPricing: '',
    campaignDuration: 'Short-term Promotion',
    languagesSpoken: '',
    productionCapacity: '',
    socialHandles: '',
    analyticsScreenshotUrl: '',
    engagementRate: '',
    authenticityDeclaration: false
  });

  // Dynamic expected collaboration options based on selected model
  const collabOptions = {
    'Technology Partnerships': ['Platform Integration', 'Joint Solution Development', 'Product Ecosystems', 'Shared Innovation'],
    'Strategic Alliances': ['Market Expansion', 'Joint Ventures', 'Industry Solutions', 'Co-Marketing'],
    'Channel Partnerships': ['Reselling / Distribution', 'Referral Campaigns', 'Regional Alliances', 'OEM Bundling'],
    'Startup Partnerships': ['Product Incubation', 'MVP Development Support', 'Co-GTM Launches', 'Shared Infrastructure'],
    'Industry Partnerships': ['Co-developed Industry Solutions', 'Industrial IoT Integration', 'Digital Supply Chain', 'Custom Logistics Tools'],
    'Research & Innovation Partnerships': ['Academic Studies', 'Prototyping R&D', 'Joint Grant Applications', 'Patenting / Licensing']
  };

  const handleExpectedCollabToggle = (option: string) => {
    const current = [...commonFields.expectedCollab];
    if (current.includes(option)) {
      setCommonFields({ ...commonFields, expectedCollab: current.filter(o => o !== option) });
    } else {
      setCommonFields({ ...commonFields, expectedCollab: [...current, option] });
    }
  };

  const handleStartupLookingForToggle = (option: string) => {
    const current = [...startupSpecifics.lookingFor];
    if (current.includes(option)) {
      setStartupSpecifics({ ...startupSpecifics, lookingFor: current.filter(o => o !== option) });
    } else {
      setStartupSpecifics({ ...startupSpecifics, lookingFor: [...current, option] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    let payload: any = {};
    if (activeModel === 'Technology Partnerships') {
      payload = { common: commonFields, tech: techSpecifics };
    } else if (activeModel === 'Strategic Alliances') {
      payload = { common: commonFields, strategic: strategicSpecifics };
    } else if (activeModel === 'Channel Partnerships') {
      payload = { common: commonFields, channel: channelSpecifics };
    } else if (activeModel === 'Startup Partnerships') {
      payload = { common: commonFields, startup: startupSpecifics };
    } else if (activeModel === 'Industry Partnerships') {
      payload = { common: commonFields, industry: industrySpecifics };
    } else if (activeModel === 'Research & Innovation Partnerships') {
      payload = { common: commonFields, research: researchSpecifics };
    } else if (activeModel === 'Content Creator & Influencer Partnerships') {
      payload = { creator: creatorForm };
    }

    try {
      const response = await fetch('/api/request-partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnershipType: activeModel,
          payload
        }),
      });

      if (response.ok) {
        setStatus('success');
        setTimeout(() => {
          setStatus('idle');
          setActiveStep(1);
          resetAllForms();
          router.push('/contact/partner');
        }, 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const resetAllForms = () => {
    setCommonFields({
      fullName: '', companyName: '', designation: '', email: '', phone: '', website: '',
      country: 'United States', industry: 'Technology', companySize: '10-50 employees',
      partnershipGoals: '', expectedCollab: [], timeline: 'Immediate (1-3 months)',
      budgetRange: '$10,000 - $50,000', uploadedDocName: '', additionalNotes: '', consent: false
    });
    setTechSpecifics({ productName: '', techCategory: 'Software / SaaS', existingCustomerBase: '', integrationRequirements: '', apisAvailable: 'Yes', technicalTeamSize: '', deploymentRegions: '', infrastructureModel: 'Cloud / SaaS', existingPartnerships: '', requestedCollabAreas: '' });
    setStrategicSpecifics({ organizationType: 'Enterprise', businessObjectives: '', geographicPresence: '', expansionGoals: '', durationPreference: 'Long-term (1+ years)', existingAlliances: '', targetMarkets: '', expectedOutcomes: '' });
    setChannelSpecifics({ salesTeamSize: '', regionsCovered: '', existingDistributionNetwork: '', annualCustomerReach: '', currentProductsSold: '', resellerExperience: '', revenueExpectations: '', supportRequirements: '' });
    setStartupSpecifics({ startupStage: 'Seed Stage', fundingStage: 'Pre-seed', productStatus: 'MVP Available', teamSize: '', industryVertical: '', currentRevenueRange: '', mvpStatus: 'Yes', fundingRaised: '', lookingFor: [] });
    setIndustrySpecifics({ industrySegment: '', operationalGeography: '', industryChallenges: '', existingSystems: '', desiredOutcomes: '', useCases: '', industryCertifications: '' });
    setResearchSpecifics({ institutionType: 'Academic Labs', researchArea: '', innovationFocus: '', patentStatus: 'No Patents Yet', researchFundingStatus: '', publications: '', researchDuration: '', collaborationGoals: '' });
    setCreatorForm({ fullName: '', email: '', phone: '', brandName: '', website: '', country: 'United States', consent: false, creatorCategory: 'Technology Content Creators', primaryPlatform: 'YouTube', contentNiche: '', channelLink: '', agencyRepresentation: 'No', subscribersCount: '', averageReach: '', monthlyViews: '', audienceGeography: '', audienceAgeGroups: '', audienceInterests: '', preferredPartnership: 'Brand Ambassador Programs', contentFormats: '', previousBrands: '', portfolioUrl: '', expectedPricing: '', campaignDuration: 'Short-term Promotion', languagesSpoken: '', productionCapacity: '', socialHandles: '', analyticsScreenshotUrl: '', engagementRate: '', authenticityDeclaration: false });
  };

  const handleNextStep = () => {
    setActiveStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setActiveStep(prev => prev - 1);
  };

  if (!activeModel) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
        <p style={{ color: '#4b5563', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Redirecting to partnerships portal...</p>
      </div>
    );
  }

  const isCreator = activeModel === 'Content Creator & Influencer Partnerships';
  const totalSteps = isCreator ? 4 : 3;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#000000', paddingTop: '9rem', paddingBottom: '8rem', fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif' }}>
      
      {/* Dynamic Style Injection */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        
        .form-page-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: #4b5563;
          font-family: inherit;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          margin-bottom: 2rem;
          transition: color 0.2s ease;
          padding: 0;
        }

        .back-btn:hover {
          color: #000000;
        }

        .form-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 24px;
          padding: clamp(2rem, 5vw, 3.5rem);
          box-shadow: 0 15px 35px rgba(0,0,0,0.03);
        }

        .modal-form-title {
          font-size: clamp(1.8rem, 3vw, 2.4rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          margin: 0 0 0.5rem 0;
          color: #000000;
        }

        .modal-form-subtitle {
          color: #6b7280;
          font-size: 1rem;
          font-weight: 300;
          margin: 0 0 2.5rem 0;
          line-height: 1.6;
        }

        /* Progress Bar */
        .step-progress-bar {
          display: flex;
          justify-content: space-between;
          position: relative;
          margin-bottom: 3.5rem;
          max-width: 100%;
        }

        .step-progress-bar::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 2px;
          background: #f3f4f6;
          z-index: 1;
          transform: translateY(-50%);
        }

        .step-progress-active-line {
          position: absolute;
          top: 50%;
          left: 0;
          height: 2px;
          background: #000000;
          z-index: 2;
          transform: translateY(-50%);
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .step-node {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #e5e7eb;
          color: #9ca3af;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          font-weight: 600;
          position: relative;
          z-index: 3;
          transition: all 0.3s ease;
        }

        .step-node-active {
          border-color: #000000;
          color: #000000;
          box-shadow: 0 0 0 4px rgba(0,0,0,0.05);
        }

        .step-node-complete {
          background: #000000;
          border-color: #000000;
          color: #ffffff;
        }

        /* Form Fields styling */
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        @media (max-width: 640px) {
          .form-grid {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
          .form-field-full {
            grid-column: span 1 !important;
          }
        }

        .form-field-full {
          grid-column: span 2;
        }

        .form-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: #374151;
          display: block;
          margin-bottom: 0.5rem;
          padding-left: 0.1rem;
        }

        .form-input {
          width: 100%;
          padding: 0.95rem 1.15rem;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .form-input:focus {
          border-color: #000;
          background: #fff;
          box-shadow: 0 0 0 1px #000;
        }

        .form-select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%234b5563%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E");
          background-repeat: no-repeat;
          background-position: right 0.95rem center;
          background-size: 1.1rem;
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .form-multi-checkbox-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.8rem;
          padding: 0.9rem;
          background: #f9fafb;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
        }

        @media (max-width: 500px) {
          .form-multi-checkbox-grid {
            grid-template-columns: 1fr;
          }
        }

        .checkbox-label-wrap {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.88rem;
          cursor: pointer;
        }

        .form-checkbox-native {
          width: 16px;
          height: 16px;
          accent-color: #000000;
        }

        .file-upload-block {
          border: 2px dashed #e5e7eb;
          border-radius: 12px;
          padding: 1.75rem;
          text-align: center;
          background: #f9fafb;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .file-upload-block:hover {
          border-color: #000000;
          background: #ffffff;
        }

        /* Nav step controls */
        .step-ctrl-wrap {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          margin-top: 2.5rem;
        }

        .step-btn-prev {
          padding: 0.9rem 2.2rem;
          border-radius: 100px;
          border: 1px solid #e5e7eb;
          background: #ffffff;
          color: #374151;
          font-size: 0.92rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .step-btn-prev:hover {
          border-color: #000000;
          color: #000;
        }

        .step-btn-next {
          padding: 0.9rem 2.2rem;
          border-radius: 100px;
          border: none;
          background: #000000;
          color: #ffffff;
          font-size: 0.92rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .step-btn-next:hover {
          background: #111111;
          transform: translateY(-1px);
        }

        /* Success & Error frames */
        .status-frame {
          text-align: center;
          padding: 3rem 1.5rem;
        }

        .status-circle {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem auto;
        }
      `}} />

      <div className="form-page-container">
        
        <button className="back-btn" onClick={() => router.push('/contact/partner')}>
          &larr; Back to Partnerships
        </button>

        <div className="form-card">
          
          {status === 'success' ? (
            <div className="status-frame">
              <div className="status-circle" style={{ background: '#ecfdf5', color: '#10b981' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <h3 className="modal-form-title">Application Sent Successfully!</h3>
              <p className="modal-form-subtitle" style={{ maxWidth: '360px', margin: '0 auto' }}>
                Thank you. Our partnership board will assess your proposal and contact you within 2-3 business days. Redirecting...
              </p>
            </div>
          ) : status === 'error' ? (
            <div className="status-frame">
              <div className="status-circle" style={{ background: '#fef2f2', color: '#ef4444' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </div>
              <h3 className="modal-form-title">Something went wrong</h3>
              <p className="modal-form-subtitle" style={{ maxWidth: '360px', margin: '0 auto' }}>
                We could not process your application right now. Please check your connection and try again.
              </p>
              <button onClick={() => setStatus('idle')} className="step-btn-next" style={{ maxWidth: '160px', margin: '1.5rem auto 0 auto', display: 'block' }}>Retry</button>
            </div>
          ) : (
            <>
              <h3 className="modal-form-title">{activeModel}</h3>
              <p className="modal-form-subtitle">
                Complete this structured partnership application to begin our strategic discovery sequence.
              </p>

              {/* Step indicator */}
              <div className="step-progress-bar">
                <div 
                  className="step-progress-active-line" 
                  style={{ width: `${((activeStep - 1) / (totalSteps - 1)) * 100}%` }}
                />
                <div className={`step-node ${activeStep >= 1 ? 'step-node-active' : ''} ${activeStep > 1 ? 'step-node-complete' : ''}`}>1</div>
                <div className={`step-node ${activeStep >= 2 ? 'step-node-active' : ''} ${activeStep > 2 ? 'step-node-complete' : ''}`}>2</div>
                <div className={`step-node ${activeStep >= 3 ? 'step-node-active' : ''} ${activeStep > 3 ? 'step-node-complete' : ''}`}>3</div>
                {isCreator && (
                  <div className={`step-node ${activeStep >= 4 ? 'step-node-active' : ''} ${activeStep > 4 ? 'step-node-complete' : ''}`}>4</div>
                )}
              </div>

              <form onSubmit={handleSubmit}>
                
                {/* ────────────────── STANDARD FORMS ────────────────── */}
                {!isCreator && (
                  <>
                    {/* Step 1: Standard contact fields */}
                    {activeStep === 1 && (
                      <div className="form-grid">
                        <div>
                          <label className="form-label">Full Name *</label>
                          <input 
                            type="text" required placeholder="Jane Doe" className="form-input"
                            value={commonFields.fullName} onChange={(e) => setCommonFields({...commonFields, fullName: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="form-label">Company / Brand Name *</label>
                          <input 
                            type="text" required placeholder="Acme Corporation" className="form-input"
                            value={commonFields.companyName} onChange={(e) => setCommonFields({...commonFields, companyName: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="form-label">Designation / Role *</label>
                          <input 
                            type="text" required placeholder="VP of Alliances" className="form-input"
                            value={commonFields.designation} onChange={(e) => setCommonFields({...commonFields, designation: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="form-label">Partnership Type *</label>
                          <input 
                            type="text" readOnly className="form-input" style={{ background: '#f3f4f6', color: '#4b5563', cursor: 'not-allowed' }}
                            value={activeModel}
                          />
                        </div>
                        <div>
                          <label className="form-label">Work Email *</label>
                          <input 
                            type="email" required placeholder="partnerships@acme.com" className="form-input"
                            value={commonFields.email} onChange={(e) => setCommonFields({...commonFields, email: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="form-label">Phone Number *</label>
                          <input 
                            type="tel" required placeholder="+1 (555) 000-0000" className="form-input"
                            value={commonFields.phone} onChange={(e) => setCommonFields({...commonFields, phone: e.target.value})}
                          />
                        </div>
                        <div className="form-field-full">
                          <label className="form-label">Website / Social Profile URL</label>
                          <input 
                            type="url" placeholder="https://acme.com" className="form-input"
                            value={commonFields.website} onChange={(e) => setCommonFields({...commonFields, website: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="form-label">Country *</label>
                          <select 
                            className="form-input form-select"
                            value={commonFields.country} onChange={(e) => setCommonFields({...commonFields, country: e.target.value})}
                          >
                            <option value="United States">United States</option>
                            <option value="India">India</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Germany">Germany</option>
                            <option value="Singapore">Singapore</option>
                            <option value="United Arab Emirates">United Arab Emirates</option>
                            <option value="Australia">Australia</option>
                          </select>
                        </div>
                        <div>
                          <label className="form-label">Industry *</label>
                          <select 
                            className="form-input form-select"
                            value={commonFields.industry} onChange={(e) => setCommonFields({...commonFields, industry: e.target.value})}
                          >
                            <option value="Technology">Technology &amp; SaaS</option>
                            <option value="Automotive">Automotive &amp; Mobility</option>
                            <option value="Manufacturing">Manufacturing / OEM</option>
                            <option value="Healthcare">Healthcare &amp; Life Sciences</option>
                            <option value="Retail">Retail &amp; Commerce</option>
                            <option value="Logistics">Logistics &amp; Supply Chain</option>
                            <option value="Finance">Financial Services</option>
                          </select>
                        </div>
                        <div className="form-field-full">
                          <label className="form-label">Company Size</label>
                          <select 
                            className="form-input form-select"
                            value={commonFields.companySize} onChange={(e) => setCommonFields({...commonFields, companySize: e.target.value})}
                          >
                            <option value="<10 employees">&lt; 10 employees</option>
                            <option value="10-50 employees">10 - 50 employees</option>
                            <option value="50-250 employees">50 - 250 employees</option>
                            <option value="250-1000 employees">250 - 1000 employees</option>
                            <option value="1000+ employees">1000+ employees</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Specific fields */}
                    {activeStep === 2 && (
                      <div className="form-grid">
                        
                        {/* Technology */}
                        {activeModel === 'Technology Partnerships' && (
                          <>
                            <div>
                              <label className="form-label">Product / Platform Name *</label>
                              <input 
                                type="text" required placeholder="Velocity OS" className="form-input"
                                value={techSpecifics.productName} onChange={(e) => setTechSpecifics({...techSpecifics, productName: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="form-label">Technology Category *</label>
                              <select 
                                className="form-input form-select"
                                value={techSpecifics.techCategory} onChange={(e) => setTechSpecifics({...techSpecifics, techCategory: e.target.value})}
                              >
                                <option value="Software / SaaS">Software / SaaS</option>
                                <option value="Artificial Intelligence">Artificial Intelligence / ML</option>
                                <option value="Cloud / Infra">Cloud Infrastructure</option>
                                <option value="IoT / Hardware">IoT &amp; Hardware Systems</option>
                                <option value="Cybersecurity">Cybersecurity</option>
                              </select>
                            </div>
                            <div>
                              <label className="form-label">Existing Customer Base *</label>
                              <input 
                                type="text" required placeholder="e.g. 50+ Enterprises, 10k MAU" className="form-input"
                                value={techSpecifics.existingCustomerBase} onChange={(e) => setTechSpecifics({...techSpecifics, existingCustomerBase: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="form-label">Integration Requirements *</label>
                              <input 
                                type="text" required placeholder="e.g. REST API, Webhooks, OAuth SSO" className="form-input"
                                value={techSpecifics.integrationRequirements} onChange={(e) => setTechSpecifics({...techSpecifics, integrationRequirements: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="form-label">APIs Available? *</label>
                              <select 
                                className="form-input form-select"
                                value={techSpecifics.apisAvailable} onChange={(e) => setTechSpecifics({...techSpecifics, apisAvailable: e.target.value})}
                              >
                                <option value="Yes">Yes (Fully Documented)</option>
                                <option value="No">No</option>
                                <option value="Under Development">Under Development</option>
                              </select>
                            </div>
                            <div>
                              <label className="form-label">Technical Team Size *</label>
                              <input 
                                type="number" required placeholder="15" className="form-input"
                                value={techSpecifics.technicalTeamSize} onChange={(e) => setTechSpecifics({...techSpecifics, technicalTeamSize: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="form-label">Deployment Regions *</label>
                              <input 
                                type="text" required placeholder="North America, EU Central, APAC" className="form-input"
                                value={techSpecifics.deploymentRegions} onChange={(e) => setTechSpecifics({...techSpecifics, deploymentRegions: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="form-label">Infrastructure Model *</label>
                              <input 
                                type="text" required placeholder="AWS Multi-tenant, On-Premise" className="form-input"
                                value={techSpecifics.infrastructureModel} onChange={(e) => setTechSpecifics({...techSpecifics, infrastructureModel: e.target.value})}
                              />
                            </div>
                            <div className="form-field-full">
                              <label className="form-label">Existing Partnerships</label>
                              <textarea 
                                placeholder="List key current technology alliances or ecosystem integrations..."
                                rows={3} className="form-input form-textarea"
                                value={techSpecifics.existingPartnerships} onChange={(e) => setTechSpecifics({...techSpecifics, existingPartnerships: e.target.value})}
                              />
                            </div>
                            <div className="form-field-full">
                              <label className="form-label">Requested Collaboration Areas *</label>
                              <textarea 
                                required placeholder="Specify core APIs, joint product components, or technical workflows desired..."
                                rows={3} className="form-input form-textarea"
                                value={techSpecifics.requestedCollabAreas} onChange={(e) => setTechSpecifics({...techSpecifics, requestedCollabAreas: e.target.value})}
                              />
                            </div>
                          </>
                        )}

                        {/* Strategic */}
                        {activeModel === 'Strategic Alliances' && (
                          <>
                            <div>
                              <label className="form-label">Organization Type *</label>
                              <select 
                                className="form-input form-select"
                                value={strategicSpecifics.organizationType} onChange={(e) => setStrategicSpecifics({...strategicSpecifics, organizationType: e.target.value})}
                              >
                                <option value="Enterprise">Enterprise</option>
                                <option value="Government / PSU">Government / PSU</option>
                                <option value="Non-Profit">Non-Profit / NGO</option>
                                <option value="Private Equity">Private Equity / Investment Group</option>
                                <option value="Conglomerate">Industrial Conglomerate</option>
                              </select>
                            </div>
                            <div>
                              <label className="form-label">Partnership Duration Preference *</label>
                              <select 
                                className="form-input form-select"
                                value={strategicSpecifics.durationPreference} onChange={(e) => setStrategicSpecifics({...strategicSpecifics, durationPreference: e.target.value})}
                              >
                                <option value="Short-term (6-12 months)">Short-term (6 - 12 months)</option>
                                <option value="Long-term (1+ years)">Long-term (1+ years)</option>
                                <option value="Indefinite Alliance">Indefinite Strategic Alliance</option>
                              </select>
                            </div>
                            <div className="form-field-full">
                              <label className="form-label">Core Business Objectives *</label>
                              <textarea 
                                required placeholder="What are your main business aims through this alliance?..."
                                rows={3} className="form-input form-textarea"
                                value={strategicSpecifics.businessObjectives} onChange={(e) => setStrategicSpecifics({...strategicSpecifics, businessObjectives: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="form-label">Geographic Presence *</label>
                              <input 
                                type="text" required placeholder="e.g. 15 offices globally, headquartered in Munich" className="form-input"
                                value={strategicSpecifics.geographicPresence} onChange={(e) => setStrategicSpecifics({...strategicSpecifics, geographicPresence: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="form-label">Expansion Goals *</label>
                              <input 
                                type="text" required placeholder="Target markets, regions or client segments" className="form-input"
                                value={strategicSpecifics.expansionGoals} onChange={(e) => setStrategicSpecifics({...strategicSpecifics, expansionGoals: e.target.value})}
                              />
                            </div>
                            <div className="form-field-full">
                              <label className="form-label">Existing Alliances</label>
                              <textarea 
                                placeholder="Name key corporate alliances in related tech/industrial fields..."
                                rows={2} className="form-input form-textarea"
                                value={strategicSpecifics.existingAlliances} onChange={(e) => setStrategicSpecifics({...strategicSpecifics, existingAlliances: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="form-label">Target Markets *</label>
                              <input 
                                type="text" required placeholder="e.g. European Automotive, MEA Infrastructure" className="form-input"
                                value={strategicSpecifics.targetMarkets} onChange={(e) => setStrategicSpecifics({...strategicSpecifics, targetMarkets: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="form-label">Expected Outcomes *</label>
                              <input 
                                type="text" required placeholder="e.g. Co-developed platform, 20% growth" className="form-input"
                                value={strategicSpecifics.expectedOutcomes} onChange={(e) => setStrategicSpecifics({...strategicSpecifics, expectedOutcomes: e.target.value})}
                              />
                            </div>
                          </>
                        )}

                        {/* Channel */}
                        {activeModel === 'Channel Partnerships' && (
                          <>
                            <div>
                              <label className="form-label">Sales Team Size *</label>
                              <input 
                                type="number" required placeholder="25" className="form-input"
                                value={channelSpecifics.salesTeamSize} onChange={(e) => setChannelSpecifics({...channelSpecifics, salesTeamSize: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="form-label">Regions Covered *</label>
                              <input 
                                type="text" required placeholder="Western Europe, DACH Region" className="form-input"
                                value={channelSpecifics.regionsCovered} onChange={(e) => setChannelSpecifics({...channelSpecifics, regionsCovered: e.target.value})}
                              />
                            </div>
                            <div className="form-field-full">
                              <label className="form-label">Existing Distribution Network Description *</label>
                              <textarea 
                                required placeholder="Describe your distribution channels, retailers, or online frameworks..."
                                rows={2} className="form-input form-textarea"
                                value={channelSpecifics.existingDistributionNetwork} onChange={(e) => setChannelSpecifics({...channelSpecifics, existingDistributionNetwork: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="form-label">Annual Customer Reach *</label>
                              <input 
                                type="text" required placeholder="e.g. 500,000+ business professionals" className="form-input"
                                value={channelSpecifics.annualCustomerReach} onChange={(e) => setChannelSpecifics({...channelSpecifics, annualCustomerReach: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="form-label">Current Products Sold *</label>
                              <input 
                                type="text" required placeholder="ERP Tools, Supply chain software" className="form-input"
                                value={channelSpecifics.currentProductsSold} onChange={(e) => setChannelSpecifics({...channelSpecifics, currentProductsSold: e.target.value})}
                              />
                            </div>
                            <div className="form-field-full">
                              <label className="form-label">Reseller Experience *</label>
                              <textarea 
                                required placeholder="Detail years of experience, brands resold, and operational success..."
                                rows={2} className="form-input form-textarea"
                                value={channelSpecifics.resellerExperience} onChange={(e) => setChannelSpecifics({...channelSpecifics, resellerExperience: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="form-label">Revenue Expectations (Annual) *</label>
                              <input 
                                type="text" required placeholder="e.g. $250k - $500k ARR" className="form-input"
                                value={channelSpecifics.revenueExpectations} onChange={(e) => setChannelSpecifics({...channelSpecifics, revenueExpectations: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="form-label">Support Requirements *</label>
                              <input 
                                type="text" required placeholder="e.g. Marketing collateral, technical API training" className="form-input"
                                value={channelSpecifics.supportRequirements} onChange={(e) => setChannelSpecifics({...channelSpecifics, supportRequirements: e.target.value})}
                              />
                            </div>
                          </>
                        )}

                        {/* Startup */}
                        {activeModel === 'Startup Partnerships' && (
                          <>
                            <div>
                              <label className="form-label">Startup Stage *</label>
                              <select 
                                className="form-input form-select"
                                value={startupSpecifics.startupStage} onChange={(e) => setStartupSpecifics({...startupSpecifics, startupStage: e.target.value})}
                              >
                                <option value="Ideation">Ideation / Bootstrap</option>
                                <option value="Seed Stage">Seed Stage</option>
                                <option value="Early Growth">Early Growth (Series A)</option>
                                <option value="Scaling">Scaling (Series B+)</option>
                              </select>
                            </div>
                            <div>
                              <label className="form-label">Funding Stage *</label>
                              <select 
                                className="form-input form-select"
                                value={startupSpecifics.fundingStage} onChange={(e) => setStartupSpecifics({...startupSpecifics, fundingStage: e.target.value})}
                              >
                                <option value="Pre-seed">Pre-seed</option>
                                <option value="Seed Funded">Seed Funded</option>
                                <option value="Series A">Series A</option>
                                <option value="Series B+">Series B &amp; Beyond</option>
                                <option value="Self-funded">Self-funded / Bootstrapped</option>
                              </select>
                            </div>
                            <div>
                              <label className="form-label">Product Status *</label>
                              <select 
                                className="form-input form-select"
                                value={startupSpecifics.productStatus} onChange={(e) => setStartupSpecifics({...startupSpecifics, productStatus: e.target.value})}
                              >
                                <option value="Prototype Only">Prototype / Wireframe Only</option>
                                <option value="MVP Available">MVP Available</option>
                                <option value="Live Product">Live Product (Paying Clients)</option>
                                <option value="Scaling Product">Scaling Enterprise Solution</option>
                              </select>
                            </div>
                            <div>
                              <label className="form-label">Team Size *</label>
                              <input 
                                type="number" required placeholder="8" className="form-input"
                                value={startupSpecifics.teamSize} onChange={(e) => setStartupSpecifics({...startupSpecifics, teamSize: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="form-label">Industry Vertical *</label>
                              <input 
                                type="text" required placeholder="e.g. Logistics SaaS, Automotive AI" className="form-input"
                                value={startupSpecifics.industryVertical} onChange={(e) => setStartupSpecifics({...startupSpecifics, industryVertical: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="form-label">Current Revenue Range (ARR) *</label>
                              <input 
                                type="text" required placeholder="e.g. $50k bootstrapped ARR" className="form-input"
                                value={startupSpecifics.currentRevenueRange} onChange={(e) => setStartupSpecifics({...startupSpecifics, currentRevenueRange: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="form-label">MVP Status *</label>
                              <select 
                                className="form-input form-select"
                                value={startupSpecifics.mvpStatus} onChange={(e) => setStartupSpecifics({...startupSpecifics, mvpStatus: e.target.value})}
                              >
                                <option value="Yes">Yes (Fully Functional)</option>
                                <option value="In Progress">In Progress (Beta)</option>
                                <option value="No">No</option>
                              </select>
                            </div>
                            <div>
                              <label className="form-label">Funding Raised ($ USD) *</label>
                              <input 
                                type="text" required placeholder="e.g. $150k Seed" className="form-input"
                                value={startupSpecifics.fundingRaised} onChange={(e) => setStartupSpecifics({...startupSpecifics, fundingRaised: e.target.value})}
                              />
                            </div>
                            <div className="form-field-full">
                              <label className="form-label">Looking For (Select multiple) *</label>
                              <div className="form-multi-checkbox-grid">
                                {['Technology support', 'GTM Launch', 'Strategic Investment', 'Mentorship / Guidance'].map(option => (
                                  <label key={option} className="checkbox-label-wrap">
                                    <input 
                                      type="checkbox" className="form-checkbox-native"
                                      checked={startupSpecifics.lookingFor.includes(option)}
                                      onChange={() => handleStartupLookingForToggle(option)}
                                    />
                                    {option}
                                  </label>
                                ))}
                              </div>
                            </div>
                          </>
                        )}

                        {/* Industry */}
                        {activeModel === 'Industry Partnerships' && (
                          <>
                            <div>
                              <label className="form-label">Industry Segment *</label>
                              <input 
                                type="text" required placeholder="e.g. Tier-1 Automotive Parts, Healthtech logistics" className="form-input"
                                value={industrySpecifics.industrySegment} onChange={(e) => setIndustrySpecifics({...industrySpecifics, industrySegment: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="form-label">Operational Geography *</label>
                              <input 
                                type="text" required placeholder="Central Europe, India, APAC" className="form-input"
                                value={industrySpecifics.operationalGeography} onChange={(e) => setIndustrySpecifics({...industrySpecifics, operationalGeography: e.target.value})}
                              />
                            </div>
                            <div className="form-field-full">
                              <label className="form-label">Industry Challenges Faced *</label>
                              <textarea 
                                required placeholder="Detail operational pain points, supply blocks, or technological deficits..."
                                rows={3} className="form-input form-textarea"
                                value={industrySpecifics.industryChallenges} onChange={(e) => setIndustrySpecifics({...industrySpecifics, industryChallenges: e.target.value})}
                              />
                            </div>
                            <div className="form-field-full">
                              <label className="form-label">Existing Software / Legacy Systems</label>
                              <textarea 
                                placeholder="List software tools currently deployed (e.g. SAP ERP, Oracle databases)..."
                                rows={2} className="form-input form-textarea"
                                value={industrySpecifics.existingSystems} onChange={(e) => setIndustrySpecifics({...industrySpecifics, existingSystems: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="form-label">Desired Partnership Outcomes *</label>
                              <input 
                                type="text" required placeholder="e.g. Digital IoT tracking, automated ERP workflows" className="form-input"
                                value={industrySpecifics.desiredOutcomes} onChange={(e) => setIndustrySpecifics({...industrySpecifics, desiredOutcomes: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="form-label">Core Use Cases *</label>
                              <input 
                                type="text" required placeholder="e.g. Warehouse optimization, battery monitoring" className="form-input"
                                value={industrySpecifics.useCases} onChange={(e) => setIndustrySpecifics({...industrySpecifics, useCases: e.target.value})}
                              />
                            </div>
                            <div className="form-field-full">
                              <label className="form-label">Industry Certifications Required</label>
                              <input 
                                type="text" placeholder="e.g. ISO 26262, HIPAA Compliance, GDPR" className="form-input"
                                value={industrySpecifics.industryCertifications} onChange={(e) => setIndustrySpecifics({...industrySpecifics, industryCertifications: e.target.value})}
                              />
                            </div>
                          </>
                        )}

                        {/* Research */}
                        {activeModel === 'Research & Innovation Partnerships' && (
                          <>
                            <div>
                              <label className="form-label">Institution / Organization Type *</label>
                              <select 
                                className="form-input form-select"
                                value={researchSpecifics.institutionType} onChange={(e) => setResearchSpecifics({...researchSpecifics, institutionType: e.target.value})}
                              >
                                <option value="Academic Labs">Academic Research Labs / Universities</option>
                                <option value="Corporate R&D">Corporate R&D Divisions</option>
                                <option value="Independent Institute">Independent Research Institute</option>
                                <option value="Gov Research Center">Government Research Center</option>
                              </select>
                            </div>
                            <div>
                              <label className="form-label">Patent Ownership Status *</label>
                              <select 
                                className="form-input form-select"
                                value={researchSpecifics.patentStatus} onChange={(e) => setResearchSpecifics({...researchSpecifics, patentStatus: e.target.value})}
                              >
                                <option value="No Patents Yet">No Patents Filed Yet</option>
                                <option value="Patents Pending">Patents Pending</option>
                                <option value="Registered Patents">Registered Patents Deployed</option>
                              </select>
                            </div>
                            <div>
                              <label className="form-label">Research Area *</label>
                              <input 
                                type="text" required placeholder="e.g. Neuromorphic Computing, Fleet routing AI" className="form-input"
                                value={researchSpecifics.researchArea} onChange={(e) => setResearchSpecifics({...researchSpecifics, researchArea: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="form-label">Innovation Focus Area *</label>
                              <input 
                                type="text" required placeholder="e.g. Solid state batteries, dynamic load mapping" className="form-input"
                                value={researchSpecifics.innovationFocus} onChange={(e) => setResearchSpecifics({...researchSpecifics, innovationFocus: e.target.value})}
                              />
                            </div>
                            <div className="form-field-full">
                              <label className="form-label">Research Funding Status *</label>
                              <input 
                                type="text" required placeholder="e.g. Backed by Gov grant, seeking corporate seed" className="form-input"
                                value={researchSpecifics.researchFundingStatus} onChange={(e) => setResearchSpecifics({...researchSpecifics, researchFundingStatus: e.target.value})}
                              />
                            </div>
                            <div className="form-field-full">
                              <label className="form-label">Existing Publications / References</label>
                              <textarea 
                                placeholder="List key academic or industry publications related to this study..."
                                rows={2} className="form-input form-textarea"
                                value={researchSpecifics.publications} onChange={(e) => setResearchSpecifics({...researchSpecifics, publications: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="form-label">Research Duration Estimate *</label>
                              <input 
                                type="text" required placeholder="e.g. 18 months, Phase 1 complete" className="form-input"
                                value={researchSpecifics.researchDuration} onChange={(e) => setResearchSpecifics({...researchSpecifics, researchDuration: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="form-label">Collaboration Goals *</label>
                              <input 
                                type="text" required placeholder="e.g. Joint prototype deployment, licensing" className="form-input"
                                value={researchSpecifics.collaborationGoals} onChange={(e) => setResearchSpecifics({...researchSpecifics, collaborationGoals: e.target.value})}
                              />
                            </div>
                          </>
                        )}

                      </div>
                    )}

                    {/* Step 3: Collaboration scope */}
                    {activeStep === 3 && (
                      <div className="form-grid">
                        <div className="form-field-full">
                          <label className="form-label">Partnership Goals (Intent) *</label>
                          <textarea 
                            required placeholder="Detail the core value you expect to build or deliver through this partnership..."
                            rows={3} className="form-input form-textarea"
                            value={commonFields.partnershipGoals} onChange={(e) => setCommonFields({...commonFields, partnershipGoals: e.target.value})}
                          />
                        </div>
                        <div className="form-field-full">
                          <label className="form-label">Expected Collaboration Type (Select all that apply) *</label>
                          <div className="form-multi-checkbox-grid">
                            {collabOptions[activeModel as keyof typeof collabOptions]?.map(option => (
                              <label key={option} className="checkbox-label-wrap">
                                <input 
                                  type="checkbox" className="form-checkbox-native"
                                  checked={commonFields.expectedCollab.includes(option)}
                                  onChange={() => handleExpectedCollabToggle(option)}
                                />
                                {option}
                              </label>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="form-label">Target Timeline</label>
                          <select 
                            className="form-input form-select"
                            value={commonFields.timeline} onChange={(e) => setCommonFields({...commonFields, timeline: e.target.value})}
                          >
                            <option value="Immediate (1-3 months)">Immediate (1-3 months)</option>
                            <option value="Medium (3-6 months)">Medium (3-6 months)</option>
                            <option value="Long (6+ months)">Long (6+ months)</option>
                          </select>
                        </div>
                        <div>
                          <label className="form-label">Budget / Investment Range</label>
                          <select 
                            className="form-input form-select"
                            value={commonFields.budgetRange} onChange={(e) => setCommonFields({...commonFields, budgetRange: e.target.value})}
                          >
                            <option value="Under $10,000">Under $10,000</option>
                            <option value="$10,000 - $50,000">$10,000 - $50,000</option>
                            <option value="$50,000 - $250,000">$50,000 - $250,000</option>
                            <option value="$250,000+">$250,000+</option>
                            <option value="Undetermined">Undetermined</option>
                          </select>
                        </div>
                        <div className="form-field-full">
                          <label className="form-label">Upload Documents (Optional)</label>
                          <div className="file-upload-block" onClick={() => alert('File upload system simulated! Documents can be cataloged.')}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#9ca3af', marginBottom: '0.5rem' }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                            <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: 0 }}>Click to browse pitch decks, blueprints or contracts (.pdf, .zip)</p>
                            {commonFields.uploadedDocName && <span style={{ color: '#10b981', fontSize: '0.8rem' }}>{commonFields.uploadedDocName}</span>}
                          </div>
                        </div>
                        <div className="form-field-full">
                          <label className="form-label">Additional Notes</label>
                          <textarea 
                            placeholder="Any additional information, references or regional notes..."
                            rows={2} className="form-input form-textarea"
                            value={commonFields.additionalNotes} onChange={(e) => setCommonFields({...commonFields, additionalNotes: e.target.value})}
                          />
                        </div>
                        <div className="form-field-full" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.5rem' }}>
                          <input 
                            type="checkbox" required className="form-checkbox-native" id="consent-modal"
                            checked={commonFields.consent} onChange={(e) => setCommonFields({...commonFields, consent: e.target.checked})}
                          />
                          <label htmlFor="consent-modal" style={{ fontSize: '0.85rem', color: '#4b5563', cursor: 'pointer' }}>
                            I agree to the partnership evaluation terms and declare the information is authentic. *
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Step controls */}
                    <div className="step-ctrl-wrap">
                      {activeStep > 1 && (
                        <button type="button" className="step-btn-prev" onClick={handlePrevStep}>Back</button>
                      )}
                      <div style={{ flexGrow: 1 }} />
                      {activeStep < 3 ? (
                        <button type="button" className="step-btn-next" onClick={handleNextStep}>Continue</button>
                      ) : (
                        <button type="submit" disabled={status === 'loading' || !commonFields.consent} className="step-btn-next" style={{ background: '#10b981' }}>
                          {status === 'loading' ? 'Submitting...' : 'Submit Application'}
                        </button>
                      )}
                    </div>
                  </>
                )}

                {/* ────────────────── CONTENT CREATOR FORM ────────────────── */}
                {isCreator && (
                  <>
                    {/* Step 1: Creator specs */}
                    {activeStep === 1 && (
                      <div className="form-grid">
                        <div>
                          <label className="form-label">Creator / Talent Name *</label>
                          <input 
                            type="text" required placeholder="Jane Doe" className="form-input"
                            value={creatorForm.fullName} onChange={(e) => setCreatorForm({...creatorForm, fullName: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="form-label">Work Email *</label>
                          <input 
                            type="email" required placeholder="creators@brand.com" className="form-input"
                            value={creatorForm.email} onChange={(e) => setCreatorForm({...creatorForm, email: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="form-label">Phone Number *</label>
                          <input 
                            type="tel" required placeholder="+1 (555) 000-0000" className="form-input"
                            value={creatorForm.phone} onChange={(e) => setCreatorForm({...creatorForm, phone: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="form-label">Creator Category *</label>
                          <select 
                            className="form-input form-select"
                            value={creatorForm.creatorCategory} onChange={(e) => setCreatorForm({...creatorForm, creatorCategory: e.target.value})}
                          >
                            <option value="Technology Content Creators">Technology Content Creator</option>
                            <option value="Business & Startups">Business &amp; Startup Influencer</option>
                            <option value="Industry Experts">Industry Expert / Leader</option>
                            <option value="Educational / Science">Educational / Science Creator</option>
                            <option value="Automotive & Mobility">Automotive &amp; Mobility Reviewer</option>
                          </select>
                        </div>
                        <div>
                          <label className="form-label">Primary Platform *</label>
                          <select 
                            className="form-input form-select"
                            value={creatorForm.primaryPlatform} onChange={(e) => setCreatorForm({...creatorForm, primaryPlatform: e.target.value})}
                          >
                            <option value="YouTube">YouTube</option>
                            <option value="Instagram">Instagram</option>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="Podcast">Podcast Host</option>
                            <option value="Blog / Website">Website / Blog</option>
                          </select>
                        </div>
                        <div>
                          <label className="form-label">Content Niche *</label>
                          <input 
                            type="text" required placeholder="e.g. Electric Cars, AI Software, SaaS Startups" className="form-input"
                            value={creatorForm.contentNiche} onChange={(e) => setCreatorForm({...creatorForm, contentNiche: e.target.value})}
                          />
                        </div>
                        <div className="form-field-full">
                          <label className="form-label">Username / Channel Link *</label>
                          <input 
                            type="url" required placeholder="https://youtube.com/c/mychannel" className="form-input"
                            value={creatorForm.channelLink} onChange={(e) => setCreatorForm({...creatorForm, channelLink: e.target.value})}
                          />
                        </div>
                        <div className="form-field-full">
                          <label className="form-label">Agency Representation? *</label>
                          <select 
                            className="form-input form-select"
                            value={creatorForm.agencyRepresentation} onChange={(e) => setCreatorForm({...creatorForm, agencyRepresentation: e.target.value})}
                          >
                            <option value="No">No (Independent Creator)</option>
                            <option value="Yes">Yes (Represented by Talent Agency)</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Audience metrics */}
                    {activeStep === 2 && (
                      <div className="form-grid">
                        <div>
                          <label className="form-label">Followers / Subscribers Count *</label>
                          <input 
                            type="text" required placeholder="e.g. 150,000" className="form-input"
                            value={creatorForm.subscribersCount} onChange={(e) => setCreatorForm({...creatorForm, subscribersCount: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="form-label">Average Campaign Reach *</label>
                          <input 
                            type="text" required placeholder="e.g. 25,000 views per post" className="form-input"
                            value={creatorForm.averageReach} onChange={(e) => setCreatorForm({...creatorForm, averageReach: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="form-label">Monthly Views *</label>
                          <input 
                            type="text" required placeholder="e.g. 1.2 Million total views" className="form-input"
                            value={creatorForm.monthlyViews} onChange={(e) => setCreatorForm({...creatorForm, monthlyViews: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="form-label">Audience Primary Geography *</label>
                          <input 
                            type="text" required placeholder="e.g. 45% US, 20% UK, 15% Germany" className="form-input"
                            value={creatorForm.audienceGeography} onChange={(e) => setCreatorForm({...creatorForm, audienceGeography: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="form-label">Audience Age Groups *</label>
                          <input 
                            type="text" required placeholder="e.g. 70% (25-34), 20% (18-24)" className="form-input"
                            value={creatorForm.audienceAgeGroups} onChange={(e) => setCreatorForm({...creatorForm, audienceAgeGroups: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="form-label">Audience Key Interests *</label>
                          <input 
                            type="text" required placeholder="e.g. Coding, EV tech, Stock Trading" className="form-input"
                            value={creatorForm.audienceInterests} onChange={(e) => setCreatorForm({...creatorForm, audienceInterests: e.target.value})}
                          />
                        </div>
                      </div>
                    )}

                    {/* Step 3: Creator collaboration terms */}
                    {activeStep === 3 && (
                      <div className="form-grid">
                        <div>
                          <label className="form-label">Preferred Partnership Type *</label>
                          <select 
                            className="form-input form-select"
                            value={creatorForm.preferredPartnership} onChange={(e) => setCreatorForm({...creatorForm, preferredPartnership: e.target.value})}
                          >
                            <option value="Affiliate Partnerships">Affiliate Partnerships</option>
                            <option value="Brand Ambassador Programs">Brand Ambassador Programs</option>
                            <option value="Campaign Partnerships">Campaign Partnerships</option>
                            <option value="Educational Partnerships">Educational Partnerships</option>
                            <option value="Co-creation Programs">Co-creation Programs</option>
                          </select>
                        </div>
                        <div>
                          <label className="form-label">Preferred Campaign Duration *</label>
                          <select 
                            className="form-input form-select"
                            value={creatorForm.campaignDuration} onChange={(e) => setCreatorForm({...creatorForm, campaignDuration: e.target.value})}
                          >
                            <option value="One-off Integration">One-off Integration</option>
                            <option value="Short-term Promotion">Short-term Promotion (1-3 months)</option>
                            <option value="Long-term Alliance">Long-term Alliance (6+ months)</option>
                          </select>
                        </div>
                        <div className="form-field-full">
                          <label className="form-label">Desired Content Formats *</label>
                          <input 
                            type="text" required placeholder="e.g. Dedicated video review, 60s Reel, Newsletter slot" className="form-input"
                            value={creatorForm.contentFormats} onChange={(e) => setCreatorForm({...creatorForm, contentFormats: e.target.value})}
                          />
                        </div>
                        <div className="form-field-full">
                          <label className="form-label">Previous Brand Collaborations</label>
                          <textarea 
                            placeholder="List key technology or related corporate brands you have previously endorsed..."
                            rows={2} className="form-input form-textarea"
                            value={creatorForm.previousBrands} onChange={(e) => setCreatorForm({...creatorForm, previousBrands: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="form-label">Expected Pricing Range ($ USD) *</label>
                          <input 
                            type="text" required placeholder="e.g. $1,200 flat fee per video" className="form-input"
                            value={creatorForm.expectedPricing} onChange={(e) => setCreatorForm({...creatorForm, expectedPricing: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="form-label">Languages Spoken *</label>
                          <input 
                            type="text" required placeholder="English, Spanish" className="form-input"
                            value={creatorForm.languagesSpoken} onChange={(e) => setCreatorForm({...creatorForm, languagesSpoken: e.target.value})}
                          />
                        </div>
                        <div className="form-field-full">
                          <label className="form-label">Content Production Capacity *</label>
                          <input 
                            type="text" required placeholder="e.g. 2 dedicated videos and 5 reels per month" className="form-input"
                            value={creatorForm.productionCapacity} onChange={(e) => setCreatorForm({...creatorForm, productionCapacity: e.target.value})}
                          />
                        </div>
                        <div className="form-field-full">
                          <label className="form-label">Portfolio / Media Kit Link</label>
                          <input 
                            type="url" placeholder="https://linktr.ee/my-media-kit" className="form-input"
                            value={creatorForm.portfolioUrl} onChange={(e) => setCreatorForm({...creatorForm, portfolioUrl: e.target.value})}
                          />
                        </div>
                      </div>
                    )}

                    {/* Step 4: Verification */}
                    {activeStep === 4 && (
                      <div className="form-grid">
                        <div className="form-field-full">
                          <label className="form-label">Social Handles *</label>
                          <input 
                            type="text" required placeholder="Twitter: @janespeaks, Instagram: @janeblog" className="form-input"
                            value={creatorForm.socialHandles} onChange={(e) => setCreatorForm({...creatorForm, socialHandles: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="form-label">Verified Engagement Rate (%) *</label>
                          <input 
                            type="text" required placeholder="e.g. 4.2%" className="form-input"
                            value={creatorForm.engagementRate} onChange={(e) => setCreatorForm({...creatorForm, engagementRate: e.target.value})}
                          />
                        </div>
                        <div className="form-field-full">
                          <label className="form-label">Upload Analytics Screenshot *</label>
                          <div className="file-upload-block" onClick={() => alert('Screenshot registered for upload verification!')}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#9ca3af', marginBottom: '0.5rem' }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                            <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: 0 }}>Click to upload YouTube Creator Studio or IG analytics snapshot (.png, .jpg)</p>
                          </div>
                        </div>
                        
                        <div className="form-field-full" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <input 
                              type="checkbox" required className="form-checkbox-native" id="creator-auth"
                              checked={creatorForm.authenticityDeclaration} onChange={(e) => setCreatorForm({...creatorForm, authenticityDeclaration: e.target.checked})}
                            />
                            <label htmlFor="creator-auth" style={{ fontSize: '0.85rem', color: '#4b5563', cursor: 'pointer', fontWeight: 600 }}>
                              I declare that all follower engagement and authenticity metrics are 100% authentic. *
                            </label>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <input 
                              type="checkbox" required className="form-checkbox-native" id="creator-consent"
                              checked={creatorForm.consent} onChange={(e) => setCreatorForm({...creatorForm, consent: e.target.checked})}
                            />
                            <label htmlFor="creator-consent" style={{ fontSize: '0.85rem', color: '#4b5563', cursor: 'pointer' }}>
                              I agree to Zawr Industries creator evaluation terms and strategic parameters. *
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step controls */}
                    <div className="step-ctrl-wrap">
                      {activeStep > 1 && (
                        <button type="button" className="step-btn-prev" onClick={handlePrevStep}>Back</button>
                      )}
                      <div style={{ flexGrow: 1 }} />
                      {activeStep < 4 ? (
                        <button type="button" className="step-btn-next" onClick={handleNextStep}>Continue</button>
                      ) : (
                        <button type="submit" disabled={status === 'loading' || !creatorForm.authenticityDeclaration || !creatorForm.consent} className="step-btn-next" style={{ background: '#10b981' }}>
                          {status === 'loading' ? 'Submitting...' : 'Apply as Creator'}
                        </button>
                      )}
                    </div>
                  </>
                )}

              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
