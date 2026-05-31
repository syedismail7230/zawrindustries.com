"use client";

import React, { useState } from 'react';
import { IndustriesSection } from '@/components/IndustriesSection';

type ModelType = 
  | 'Technology Partnerships' 
  | 'Strategic Alliances' 
  | 'Channel Partnerships' 
  | 'Startup Partnerships' 
  | 'Industry Partnerships' 
  | 'Content Creator & Influencer Partnerships' 
  | 'Research & Innovation Partnerships';

export default function PartnerPage() {
  const [activeModel, setActiveModel] = useState<ModelType | null>(null);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

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
    // Common contact defaults mapped directly
    fullName: '',
    email: '',
    phone: '',
    brandName: '', // Channel name
    website: '',   // Social profile
    country: 'United States',
    consent: false,
    
    // Creator Details
    creatorCategory: 'Technology Content Creators',
    primaryPlatform: 'YouTube',
    contentNiche: '',
    channelLink: '',
    agencyRepresentation: 'No',

    // Audience Info
    subscribersCount: '',
    averageReach: '',
    monthlyViews: '',
    audienceGeography: '',
    audienceAgeGroups: '',
    audienceInterests: '',

    // Collaboration Specs
    preferredPartnership: 'Brand Ambassador Programs',
    contentFormats: '',
    previousBrands: '',
    portfolioUrl: '',
    expectedPricing: '',
    campaignDuration: 'Short-term Promotion',
    languagesSpoken: '',
    productionCapacity: '',

    // Verification
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

  // Submit dynamic forms
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
          setActiveModel(null);
          setActiveStep(1);
          resetAllForms();
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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#000000', paddingBottom: '8rem', fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif' }}>
      
      {/* Styles Injection */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        
        .part-hero-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 9rem 2rem 5rem 2rem;
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: clamp(2rem, 5vw, 5rem);
          align-items: center;
        }

        .part-hero-left {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .part-hero-heading {
          font-size: clamp(2.8rem, 5.5vw, 5rem);
          font-weight: 300;
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: #000000;
          margin: 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .part-hero-script {
          font-family: 'Pinyon Script', cursive;
          font-size: clamp(3.5rem, 8vw, 6.8rem);
          color: #000000;
          display: block;
          margin-top: 0.1rem;
          line-height: 0.8;
          font-weight: 400;
          text-transform: none;
        }

        .part-hero-desc {
          color: #4b5563;
          font-size: clamp(0.95rem, 1.15vw, 1.1rem);
          line-height: 1.8;
          font-weight: 300;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          max-width: 580px;
        }

        .part-hero-right {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .part-hero-img-wrap {
          width: 100%;
          max-width: 460px;
          aspect-ratio: 4/5;
          border-radius: clamp(16px, 2.5vw, 24px);
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.06);
          border: 1px solid rgba(0,0,0,0.04);
        }

        .part-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .part-hero-img-wrap:hover .part-hero-img {
          transform: scale(1.03);
        }

        /* General Section Layout */
        .part-section {
          padding: 6rem 2rem;
          border-top: 1px solid #f3f4f6;
        }

        .part-section-title {
          font-size: clamp(2rem, 3.5vw, 2.8rem);
          font-weight: 300;
          letter-spacing: -0.02em;
          text-align: center;
          margin-bottom: 0.5rem;
        }

        .part-section-subtitle {
          font-size: 1rem;
          color: #6b7280;
          text-align: center;
          margin-bottom: 4rem;
          font-weight: 400;
        }

        /* Why Partner Grid */
        .why-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .why-card {
          border: 1px solid #f3f4f6;
          border-radius: 16px;
          padding: 2.2rem;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          background-color: #ffffff;
        }

        .why-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.05);
          border-color: #e5e7eb;
        }

        .why-card-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          color: #000000;
        }

        .why-card h3 {
          font-size: 1.2rem;
          font-weight: 600;
          margin: 0 0 0.8rem 0;
          letter-spacing: -0.01em;
        }

        .why-card p {
          color: #4b5563;
          font-size: 0.95rem;
          line-height: 1.6;
          margin: 0;
          font-weight: 300;
        }

        /* Models rows layout */
        .models-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
        }

        .model-row-interactive {
          display: grid;
          grid-template-columns: 1.35fr 1fr 1fr auto;
          gap: 2.5rem;
          padding: 3rem 0.5rem;
          border-bottom: 1px solid #f0f0f0;
          align-items: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .model-row-interactive:hover {
          padding-left: 1.5rem;
          padding-right: 1rem;
          background-color: #fafafa;
        }

        .model-row-interactive:last-child {
          border-bottom: none;
        }

        .model-left-int h3 {
          font-size: 1.55rem;
          font-weight: 500;
          letter-spacing: -0.02em;
          margin: 0 0 0.8rem 0;
        }

        .model-left-int p {
          color: #6b7280;
          font-size: 0.95rem;
          line-height: 1.6;
          font-weight: 300;
          margin: 0;
        }

        .model-meta-box-int h4 {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #9ca3af;
          margin: 0 0 0.8rem 0;
        }

        .model-meta-list-int {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .model-meta-list-int li {
          font-size: 0.92rem;
          color: #374151;
          font-weight: 300;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .model-meta-list-int li::before {
          content: '•';
          color: #3b82f6;
          font-weight: bold;
          flex-shrink: 0;
        }

        .arrow-circle-btn {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 1px solid #111111;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          color: #111111;
        }

        .model-row-interactive:hover .arrow-circle-btn {
          background: #111111;
          color: #ffffff;
          transform: scale(1.05);
        }

        .arrow-circle-btn svg {
          width: 22px;
          height: 22px;
          transition: transform 0.4s ease;
        }

        .model-row-interactive:hover .arrow-circle-btn svg {
          transform: translate(1px, -1px);
        }

        /* Modal styling */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(12px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          animation: modalFadeIn 0.3s ease;
        }

        .modal-content-wrap {
          background: #ffffff;
          width: 100%;
          max-width: 44rem;
          max-height: 90vh;
          overflow-y: auto;
          border-radius: 28px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.15);
          position: relative;
          animation: modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .modal-close-btn {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background: #f3f4f6;
          color: #4b5563;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 10;
        }

        .modal-close-btn:hover {
          background: #e5e7eb;
          color: #000;
        }

        .modal-body {
          padding: 3.5rem 3rem;
        }

        .modal-form-title {
          font-size: 1.8rem;
          font-weight: 500;
          letter-spacing: -0.02em;
          margin: 0 0 0.4rem 0;
        }

        .modal-form-subtitle {
          color: #6b7280;
          font-size: 0.92rem;
          font-weight: 300;
          line-height: 1.5;
          margin-bottom: 2rem;
        }

        /* Step Progress indicators */
        .step-progress-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
          position: relative;
        }

        .step-progress-bar::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
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
          transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .step-node {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          font-weight: 600;
          color: #9ca3af;
          position: relative;
          z-index: 3;
          transition: all 0.3s ease;
        }

        .step-node-active {
          border-color: #000000;
          background: #000000;
          color: #ffffff;
        }

        .step-node-complete {
          border-color: #10b981;
          background: #10b981;
          color: #ffffff;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
          margin-bottom: 2rem;
        }

        .form-field-full {
          grid-column: span 2;
        }

        .form-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: #374151;
          display: block;
          margin-bottom: 0.4rem;
          padding-left: 0.1rem;
        }

        .form-input {
          width: 100%;
          padding: 0.9rem 1.1rem;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          font-size: 0.92rem;
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
          background-position: right 0.9rem center;
          background-size: 1.1rem;
        }

        .form-textarea {
          resize: vertical;
          min-height: 90px;
        }

        .form-multi-checkbox-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.8rem;
          padding: 0.8rem;
          background: #f9fafb;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
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
          padding: 1.5rem;
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
          margin-top: 2rem;
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

        /* Content Creator Section */
        .creator-section {
          background: linear-gradient(135deg, #090909 0%, #121212 100%);
          color: #ffffff;
          border-radius: 24px;
          padding: clamp(3rem, 6vw, 5rem);
          max-width: 1200px;
          margin: 0 auto;
          border: 1px solid rgba(255,255,255,0.06);
          position: relative;
          overflow: hidden;
        }

        .creator-header-grid {
          display: grid;
          grid-template-columns: 1.25fr 0.75fr;
          gap: clamp(2rem, 4vw, 5rem);
          align-items: center;
          margin-bottom: 4rem;
        }

        .creator-title-area {
          text-align: left;
        }

        .creator-title {
          font-size: clamp(2rem, 3.8vw, 2.8rem);
          font-weight: 300;
          letter-spacing: -0.02em;
          margin-bottom: 1.2rem;
          line-height: 1.15;
        }

        .creator-desc {
          color: #9ca3af;
          font-size: clamp(0.95rem, 1.1vw, 1.05rem);
          line-height: 1.75;
          font-weight: 300;
          margin: 0;
        }

        .creator-header-visual {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .creator-visual-wrap {
          width: 100%;
          max-width: 380px;
          aspect-ratio: 16/10;
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 15px 35px rgba(0,0,0,0.5);
          background: #0d0d0d;
        }

        .creator-visual-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .creator-visual-wrap:hover .creator-visual-img {
          transform: scale(1.04);
        }

        .creator-visual-glow {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.55) 100%);
          pointer-events: none;
        }

        .creator-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
        }

        .creator-block-title {
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          margin-bottom: 1.5rem;
          border-left: 2.5px solid #ec4899;
          padding-left: 0.75rem;
        }

        .creator-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
          margin-bottom: 3rem;
        }

        .creator-badge {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 0.5rem 1.1rem;
          border-radius: 100px;
          font-size: 0.88rem;
          font-weight: 400;
          color: rgba(255,255,255,0.8);
          transition: all 0.3s ease;
        }

        .creator-sub-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .creator-model-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          padding: 1.25rem;
          border-radius: 12px;
        }

        .creator-model-card h5 {
          font-size: 0.95rem;
          font-weight: 600;
          margin: 0 0 0.4rem 0;
          color: #ffffff;
        }

        .creator-model-card p {
          font-size: 0.85rem;
          color: #9ca3af;
          margin: 0;
          line-height: 1.5;
          font-weight: 300;
        }

        .creator-action-box {
          margin-top: 3rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 2.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }

        .creator-action-text h4 {
          font-size: 1.3rem;
          font-weight: 400;
          margin: 0 0 0.4rem 0;
        }

        .creator-action-text p {
          color: #9ca3af;
          font-size: 0.92rem;
          margin: 0;
          font-weight: 300;
        }

        .creator-neon-btn {
          background: transparent;
          color: #ffffff;
          border: 2px solid transparent;
          background-image: linear-gradient(#050505, #050505), linear-gradient(135deg, #3b82f6, #ec4899);
          background-origin: border-box;
          background-clip: padding-box, border-box;
          border-radius: 100px;
          padding: 0.8rem 2.2rem;
          font-size: 0.92rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
          white-space: nowrap;
        }

        .creator-neon-btn:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.5), 0 0 25px rgba(236, 72, 153, 0.4);
          background-image: linear-gradient(#111111, #111111), linear-gradient(135deg, #ec4899, #3b82f6);
        }

        /* Process Steps */
        .process-flow {
          max-width: 1000px;
          margin: 4rem auto 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          position: relative;
        }

        .process-step {
          background: #ffffff;
          border: 1px solid #f3f4f6;
          border-radius: 16px;
          padding: 2rem;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 2rem;
          align-items: center;
          transition: border-color 0.3s ease;
        }

        .process-step:hover {
          border-color: #000000;
        }

        .process-num {
          font-size: clamp(2rem, 3.5vw, 3.2rem);
          font-weight: 700;
          color: #f3f4f6;
          font-family: system-ui, sans-serif;
          line-height: 1;
          transition: color 0.3s ease;
        }

        .process-step:hover .process-num {
          color: #e5e7eb;
        }

        .process-step-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0 0 0.5rem 0;
        }

        .process-step-content p {
          color: #4b5563;
          font-size: 0.96rem;
          line-height: 1.6;
          margin: 0;
          font-weight: 300;
        }

        /* Benefits & Industries section components */
        .p-items-wrap {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1rem;
        }

        .p-item-pill {
          background: #ffffff;
          border: 1px solid #f3f4f6;
          padding: 0.9rem 1.8rem;
          border-radius: 100px;
          font-size: 1rem;
          font-weight: 500;
          color: #111827;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }

        .p-item-pill:hover {
          border-color: #000000;
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(0,0,0,0.06);
        }

        .p-item-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #ec4899);
        }

        @media (max-width: 968px) {
          .part-hero-container {
            grid-template-columns: 1fr;
            text-align: center;
            padding-top: 7rem;
            gap: 3.5rem;
          }

          .part-hero-desc {
            margin: 0 auto;
          }

          .part-hero-img-wrap {
            max-width: 400px;
          }

          .model-row-interactive {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            padding: 2.5rem 1rem;
          }

          .model-row-interactive:hover {
            padding-left: 1rem;
            padding-right: 1rem;
          }

          .arrow-circle-btn {
            margin-top: 1rem;
            justify-self: center;
          }

          .creator-header-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
            text-align: center;
            margin-bottom: 3rem;
          }

          .creator-title-area {
            text-align: center;
          }

          .creator-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .creator-action-box {
            flex-direction: column;
            text-align: center;
            padding: 2rem;
          }

          .modal-body {
            padding: 3rem 1.8rem;
          }
        }

        @media (max-width: 580px) {
          .creator-sub-grid {
            grid-template-columns: 1fr;
          }

          .process-step {
            grid-template-columns: 1fr;
            gap: 1rem;
            text-align: center;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-field-full {
            grid-column: span 1;
          }
        }
      `}} />

      {/* ── 1. IMMERSIVE SPLIT HERO SECTION ── */}
      <section className="part-hero-container">
        <div className="part-hero-left">
          <h1 className="part-hero-heading">
            We are here<br />
            for some<br />
            serious<br />
            <span className="part-hero-script">partnerships</span>
          </h1>
          
          <div className="part-hero-desc">
            <p>
              Technology transformation requires strong ecosystems, strategic alliances, and collaborative innovation. We partner with organizations, technology providers, startups, enterprises, system integrators, research institutions, and industry leaders to create solutions that accelerate growth, improve operational efficiency, and unlock new opportunities.
            </p>
            <p>
              Our partnership ecosystem is designed to create long-term value through shared expertise, joint innovation, and market expansion.
            </p>
          </div>
        </div>

        <div className="part-hero-right">
          <div className="part-hero-img-wrap">
            <img 
              src="/assets/partnership-hero.png" 
              alt="Zawr Partnership Duo" 
              className="part-hero-img" 
            />
          </div>
        </div>
      </section>

      {/* ── 2. WHY PARTNER WITH US SECTION ── */}
      <section className="part-section">
        <h2 className="part-section-title">Why Partner With Us?</h2>
        <p className="part-section-subtitle">Innovation-Driven Collaboration</p>

        <div className="why-grid">
          <div className="why-card">
            <div className="why-card-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <h3>Innovation-Driven</h3>
            <p>We work closely with partners to develop scalable solutions that solve complex business challenges across industries.</p>
          </div>

          <div className="why-card">
            <div className="why-card-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            </div>
            <h3>Market Expansion</h3>
            <p>Access new markets, industries, customer segments, and business opportunities through collaborative growth models.</p>
          </div>

          <div className="why-card">
            <div className="why-card-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            </div>
            <h3>Technology Expertise</h3>
            <p>Leverage deep expertise across software engineering, cloud, AI, cybersecurity, automation, enterprise systems, and emerging technologies.</p>
          </div>

          <div className="why-card">
            <div className="why-card-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            </div>
            <h3>Scalable Delivery</h3>
            <p>Flexible partnership frameworks supporting startups, enterprises, OEMs, technology providers, and system integrators.</p>
          </div>

          <div className="why-card">
            <div className="why-card-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <h3>Long-Term Value</h3>
            <p>Our focus is on sustainable partnerships that create measurable outcomes for all stakeholders.</p>
          </div>

          <div className="why-card">
            <div className="why-card-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1"/><path d="M18 8h4a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-4"/><circle cx="8" cy="12" r="2"/><circle cx="15" cy="12" r="2"/></svg>
            </div>
            <h3>Co-Innovation Focus</h3>
            <p>Collaboratively build custom IP, prototype cutting-edge solutions, and accelerate time-to-market using shared tech resources.</p>
          </div>
        </div>
      </section>

      {/* ── 3. INTERACTIVE PARTNERSHIP MODELS (SCREENSHOT COMPLIANT ↗ Circle Buttons) ── */}
      <section className="part-section">
        <h2 className="part-section-title">Partnership Models</h2>
        <p className="part-section-subtitle">Click any model below to open its specific partnership application form</p>

        <div className="models-container">
          
          {/* Row 1: Technology Partnerships */}
          <div className="model-row-interactive" onClick={() => { setActiveModel('Technology Partnerships'); setActiveStep(1); }}>
            <div className="model-left-int">
              <h3>Technology Partnerships</h3>
              <p>Collaborate on products, platforms, integrations, and technology ecosystems.</p>
            </div>
            <div className="model-meta-box-int">
              <h4>Ideal For</h4>
              <ul className="model-meta-list-int">
                <li>Technology companies</li>
                <li>Platform providers</li>
                <li>Software vendors</li>
                <li>Infrastructure providers</li>
              </ul>
            </div>
            <div className="model-meta-box-int">
              <h4>Areas of Collaboration</h4>
              <ul className="model-meta-list-int">
                <li>Platform integrations</li>
                <li>Joint solution development</li>
                <li>Product ecosystems</li>
                <li>Shared innovation</li>
              </ul>
            </div>
            <div className="arrow-circle-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </div>
          </div>

          {/* Row 2: Strategic Alliances */}
          <div className="model-row-interactive" onClick={() => { setActiveModel('Strategic Alliances'); setActiveStep(1); }}>
            <div className="model-left-int">
              <h3>Strategic Alliances</h3>
              <p>Build long-term business relationships for growth and expansion.</p>
            </div>
            <div className="model-meta-box-int" style={{ gridColumn: 'span 2' }}>
              <h4>Areas of Collaboration</h4>
              <ul className="model-meta-list-int" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                <li>Market expansion</li>
                <li>Joint ventures</li>
                <li>Industry-specific solutions</li>
                <li>Shared business opportunities</li>
              </ul>
            </div>
            <div className="arrow-circle-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </div>
          </div>

          {/* Row 3: Channel Partnerships */}
          <div className="model-row-interactive" onClick={() => { setActiveModel('Channel Partnerships'); setActiveStep(1); }}>
            <div className="model-left-int">
              <h3>Channel Partnerships</h3>
              <p>Expand market reach through collaborative sales and delivery models.</p>
            </div>
            <div className="model-meta-box-int" style={{ gridColumn: 'span 2' }}>
              <h4>Collaboration Areas</h4>
              <ul className="model-meta-list-int" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                <li>Reseller relationships</li>
                <li>Distribution partnerships</li>
                <li>Referral programs</li>
                <li>Regional partnerships</li>
              </ul>
            </div>
            <div className="arrow-circle-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </div>
          </div>

          {/* Row 4: Startup Partnerships */}
          <div className="model-row-interactive" onClick={() => { setActiveModel('Startup Partnerships'); setActiveStep(1); }}>
            <div className="model-left-int">
              <h3>Startup Partnerships</h3>
              <p>Collaborate with startups to accelerate innovation.</p>
            </div>
            <div className="model-meta-box-int" style={{ gridColumn: 'span 2' }}>
              <h4>Support Areas</h4>
              <ul className="model-meta-list-int" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                <li>Product development</li>
                <li>MVP support</li>
                <li>Technology guidance</li>
                <li>Scaling support</li>
              </ul>
            </div>
            <div className="arrow-circle-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </div>
          </div>

          {/* Row 5: Industry Partnerships */}
          <div className="model-row-interactive" onClick={() => { setActiveModel('Industry Partnerships'); setActiveStep(1); }}>
            <div className="model-left-int">
              <h3>Industry Partnerships</h3>
              <p>Develop industry-focused solutions together.</p>
            </div>
            <div className="model-meta-box-int" style={{ gridColumn: 'span 2' }}>
              <h4>Focus Areas</h4>
              <ul className="model-meta-list-int" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
                <li>Automotive</li>
                <li>Manufacturing</li>
                <li>Healthcare</li>
                <li>Retail</li>
                <li>Logistics</li>
                <li>Financial Services</li>
              </ul>
            </div>
            <div className="arrow-circle-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </div>
          </div>

          {/* Row 6: Research & Innovation Partnerships */}
          <div className="model-row-interactive" onClick={() => { setActiveModel('Research & Innovation Partnerships'); setActiveStep(1); }}>
            <div className="model-left-int">
              <h3>Research &amp; Innovation Partnerships</h3>
              <p>Collaborate on emerging technologies and innovation programs.</p>
            </div>
            <div className="model-meta-box-int" style={{ gridColumn: 'span 2' }}>
              <h4>Areas of Interest</h4>
              <ul className="model-meta-list-int" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                <li>Artificial Intelligence</li>
                <li>Industrial Systems</li>
                <li>Smart Infrastructure</li>
                <li>Connected Technologies</li>
                <li>Automation</li>
              </ul>
            </div>
            <div className="arrow-circle-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </div>
          </div>

        </div>
      </section>

      {/* ── 4. CONTENT CREATOR & INFLUENCER HUB SECTION ── */}
      <section className="part-section">
        <div className="creator-section">
          
          <div className="creator-header-grid">
            <div className="creator-title-area">
              <h2 className="creator-title">Content Creator &amp; Influencer Partnerships</h2>
            </div>
            
            <div className="creator-header-visual">
              <div className="creator-visual-wrap">
                <img 
                  src="/assets/creator-hub-hero.png" 
                  alt="Zawr Creator Hub Hero" 
                  className="creator-visual-img" 
                />
                <div className="creator-visual-glow" />
              </div>
            </div>
          </div>

          <div className="creator-grid">
            
            {/* Left Block */}
            <div>
              <h4 className="creator-block-title">Ideal Partners</h4>
              <div className="creator-badges">
                <span className="creator-badge">Technology Content Creators</span>
                <span className="creator-badge">Business Influencers</span>
                <span className="creator-badge">Industry Experts</span>
                <span className="creator-badge">Educational Creators</span>
                <span className="creator-badge">Startup Influencers</span>
                <span className="creator-badge">Automotive Creators</span>
                <span className="creator-badge">Tech Reviewers</span>
                <span className="creator-badge">Community Builders</span>
                <span className="creator-badge">YouTubers</span>
                <span className="creator-badge">Bloggers</span>
                <span className="creator-badge">Podcast Hosts</span>
                <span className="creator-badge">Social Media Creators</span>
              </div>

              <h4 className="creator-block-title">Partnership Opportunities</h4>
              <ul className="model-meta-list" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.6rem', color: '#9ca3af' }}>
                <li style={{ color: 'rgba(255,255,255,0.7)' }}>Brand Collaborations</li>
                <li style={{ color: 'rgba(255,255,255,0.7)' }}>Sponsored Content Campaigns</li>
                <li style={{ color: 'rgba(255,255,255,0.7)' }}>Product Reviews &amp; Demonstrations</li>
                <li style={{ color: 'rgba(255,255,255,0.7)' }}>Educational Content Creation</li>
                <li style={{ color: 'rgba(255,255,255,0.7)' }}>Event Collaborations</li>
                <li style={{ color: 'rgba(255,255,255,0.7)' }}>Webinar Partnerships</li>
                <li style={{ color: 'rgba(255,255,255,0.7)' }}>Industry Discussions</li>
              </ul>
            </div>

            {/* Right Block */}
            <div>
              <h4 className="creator-block-title">Collaboration Models</h4>
              <div className="creator-sub-grid">
                <div className="creator-model-card">
                  <h5>Affiliate Partnerships</h5>
                  <p>Performance-based growth collaborations.</p>
                </div>
                <div className="creator-model-card">
                  <h5>Brand Ambassador</h5>
                  <p>Long-term creator relationships.</p>
                </div>
                <div className="creator-model-card">
                  <h5>Campaign Partnerships</h5>
                  <p>Short-term promotional initiatives.</p>
                </div>
                <div className="creator-model-card">
                  <h5>Educational Partnerships</h5>
                  <p>Knowledge-sharing collaborations.</p>
                </div>
              </div>

              <h4 className="creator-block-title" style={{ marginTop: '2.5rem' }}>Benefits for Creators</h4>
              <ul className="model-meta-list" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', color: '#9ca3af' }}>
                <li style={{ color: 'rgba(255,255,255,0.7)' }}>Access to tech ecosystems</li>
                <li style={{ color: 'rgba(255,255,255,0.7)' }}>Early product access</li>
                <li style={{ color: 'rgba(255,255,255,0.7)' }}>Co-branding options</li>
                <li style={{ color: 'rgba(255,255,255,0.7)' }}>Revenue-sharing models</li>
                <li style={{ color: 'rgba(255,255,255,0.7)' }}>Audience growth pathways</li>
                <li style={{ color: 'rgba(255,255,255,0.7)' }}>Exclusive network access</li>
              </ul>
            </div>

          </div>

          <div className="creator-action-box">
            <div className="creator-action-text">
              <h4>Ready to join our creator ecosystem?</h4>
              <p>Apply now as a Creator Partner and help co-create the digital future.</p>
            </div>
            <button 
              className="creator-neon-btn"
              onClick={() => { setActiveModel('Content Creator & Influencer Partnerships'); setActiveStep(1); }}
            >
              Apply as Creator &rarr;
            </button>
          </div>

        </div>
      </section>

      {/* ── 5. PARTNERSHIP PROCESS TIMELINE SECTION ── */}
      <section className="part-section" style={{ backgroundColor: '#fafafa' }}>
        <h2 className="part-section-title">Partnership Process</h2>
        <p className="part-section-subtitle">Structured paths for engineering collaborative success</p>

        <div className="process-flow">
          <div className="process-step">
            <span className="process-num">01</span>
            <div className="process-step-content">
              <h3>Partnership Discovery</h3>
              <p>Understand objectives, capabilities, and strategic alignment.</p>
            </div>
          </div>

          <div className="process-step">
            <span className="process-num">02</span>
            <div className="process-step-content">
              <h3>Opportunity Assessment</h3>
              <p>Identify collaboration opportunities and value creation areas.</p>
            </div>
          </div>

          <div className="process-step">
            <span className="process-num">03</span>
            <div className="process-step-content">
              <h3>Partnership Framework Design</h3>
              <p>Define responsibilities, engagement structures, and operating models.</p>
            </div>
          </div>

          <div className="process-step">
            <span className="process-num">04</span>
            <div className="process-step-content">
              <h3>Collaboration &amp; Execution</h3>
              <p>Execute initiatives through structured delivery frameworks.</p>
            </div>
          </div>

          <div className="process-step">
            <span className="process-num">05</span>
            <div className="process-step-content">
              <h3>Continuous Growth</h3>
              <p>Expand partnerships through long-term collaboration and innovation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. INDUSTRIES WE COLLABORATE ACROSS SECTION (HIGH-FIDELITY INTERACTIVE ACCORDION WITH 6 INDUSTRIES) ── */}
      <IndustriesSection 
        theme="light" 
        title="Industries We Partner With"
        projectLabel="Collaborative Venture"
        industries={[
          {
            name: "Technology & SaaS",
            image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
            projectName: "Co-Engineered SaaS Frameworks",
            projectDescription: "Building deep software alliances, secure API bridges, and co-branded SaaS orchestration ecosystems for global markets."
          },
          {
            name: "Automotive & Mobility",
            image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=800&auto=format&fit=crop",
            projectName: "Joint EV Autonomy Ventures",
            projectDescription: "Co-engineering autonomous routing algorithms, high-efficiency battery managers, and next-generation mobility hubs."
          },
          {
            name: "Healthcare & Pharma",
            image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop",
            projectName: "Oncology Lab Consortia",
            projectDescription: "Collaborating with elite clinical research labs to train predictive AI models that accelerate precision diagnostic scans."
          },
          {
            name: "Logistics & Supply Chain",
            image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop",
            projectName: "Global Distribution Networks",
            projectDescription: "Partnering with shipping networks to pilot decentralized tracking ledger architectures and automated freight hubs."
          },
          {
            name: "Retail & E-Commerce",
            image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop",
            projectName: "Joint Omnichannel Commerce",
            projectDescription: "Co-developing scalable shopper recommendation frameworks to power seamless offline-to-online customer journeys."
          },
          {
            name: "Financial Services",
            image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop",
            projectName: "Interbank Ledger Coalitions",
            projectDescription: "Designing high-throughput interbank ledger systems for frictionless, instant settlement corridors worldwide."
          }
        ]} 
      />

      {/* ── 7. BENEFITS OF PARTNERING WITH US SECTION ── */}
      <section className="part-section" style={{ backgroundColor: '#fafafa' }}>
        <h2 className="part-section-title">Benefits of Partnering With Us</h2>
        <p className="part-section-subtitle">Measurable structural returns built into every alliance framework</p>

        <div className="p-items-wrap">
          <span className="p-item-pill"><span className="p-item-dot" />Faster market expansion</span>
          <span className="p-item-pill"><span className="p-item-dot" />Shared innovation capabilities</span>
          <span className="p-item-pill"><span className="p-item-dot" />Reduced delivery risks</span>
          <span className="p-item-pill"><span className="p-item-dot" />Access to technical expertise</span>
          <span className="p-item-pill"><span className="p-item-dot" />Stronger go-to-market strategies</span>
          <span className="p-item-pill"><span className="p-item-dot" />Increased business opportunities</span>
          <span className="p-item-pill"><span className="p-item-dot" />Scalable collaboration models</span>
        </div>
      </section>




      {/* ── 9. DYNAMIC PORTAL / MULTI-STEP MODAL SYSTEM FOR PARTNERSHIP MODELS ── */}
      {activeModel && (
        <div className="modal-overlay" onClick={() => { setActiveModel(null); setStatus('idle'); }}>
          <div className="modal-content-wrap" onClick={(e) => e.stopPropagation()}>
            
            <button className="modal-close-btn" onClick={() => { setActiveModel(null); setStatus('idle'); }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div className="modal-body">
              
              {/* Status Header Frame */}
              {status === 'success' ? (
                <div className="status-frame">
                  <div className="status-circle" style={{ background: '#ecfdf5', color: '#10b981' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <h3 className="modal-form-title">Application Sent Successfully!</h3>
                  <p className="modal-form-subtitle" style={{ maxWidth: '320px', margin: '0 auto' }}>
                    Thank you. Our partnership board will assess your proposal and contact you within 2-3 business days.
                  </p>
                </div>
              ) : status === 'error' ? (
                <div className="status-frame">
                  <div className="status-circle" style={{ background: '#fef2f2', color: '#ef4444' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </div>
                  <h3 className="modal-form-title">Something went wrong</h3>
                  <p className="modal-form-subtitle" style={{ maxWidth: '320px', margin: '0 auto' }}>
                    We could not process your application right now. Please check your connection and try again.
                  </p>
                  <button onClick={() => setStatus('idle')} className="modal-submit-btn" style={{ maxWidth: '160px', marginTop: '1.5rem' }}>Retry</button>
                </div>
              ) : (
                <>
                  <h3 className="modal-form-title">{activeModel}</h3>
                  <p className="modal-form-subtitle">
                    Complete this structured partnership application to begin our strategic discovery sequence.
                  </p>

                  {/* ────────────────── STEP BAR INDICATOR ────────────────── */}
                  <div className="step-progress-bar">
                    <div 
                      className="step-progress-active-line" 
                      style={{ 
                        width: (activeModel === 'Content Creator & Influencer Partnerships' 
                          ? ((activeStep - 1) / 3) * 100 
                          : ((activeStep - 1) / 2) * 100) + '%'
                      }}
                    />
                    <div className={`step-node ${activeStep >= 1 ? 'step-node-active' : ''} ${activeStep > 1 ? 'step-node-complete' : ''}`}>1</div>
                    <div className={`step-node ${activeStep >= 2 ? 'step-node-active' : ''} ${activeStep > 2 ? 'step-node-complete' : ''}`}>2</div>
                    <div className={`step-node ${activeStep >= 3 ? 'step-node-active' : ''} ${activeStep > 3 ? 'step-node-complete' : ''}`}>3</div>
                    {activeModel === 'Content Creator & Influencer Partnerships' && (
                      <div className={`step-node ${activeStep >= 4 ? 'step-node-active' : ''} ${activeStep > 4 ? 'step-node-complete' : ''}`}>4</div>
                    )}
                  </div>

                  {/* ────────────────── SUBMISSION WIZARD ────────────────── */}
                  <form onSubmit={handleSubmit}>

                    {/* =======================================================
                        PART 1: STANDARD MULTI-STEP FORMS (MODELS 1 to 6)
                        ======================================================= */}
                    {activeModel !== 'Content Creator & Influencer Partnerships' && (
                      <>
                        {/* ─ STEP 1: REPRESENTATIVE & ORGANIZATION DETAILS ─ */}
                        {activeStep === 1 && (
                          <div className="form-grid">
                            <div>
                              <label className="form-label">Full Name *</label>
                              <input 
                                type="text" required placeholder="Jane Doe" className="form-input"
                                value={commonFields.fullName} onChange={(e) => setCommonFields({...commonFields, fullName: e.target.value})}
                                suppressHydrationWarning
                              />
                            </div>
                            <div>
                              <label className="form-label">Company / Brand Name *</label>
                              <input 
                                type="text" required placeholder="Acme Corporation" className="form-input"
                                value={commonFields.companyName} onChange={(e) => setCommonFields({...commonFields, companyName: e.target.value})}
                                suppressHydrationWarning
                              />
                            </div>
                            <div>
                              <label className="form-label">Designation / Role *</label>
                              <input 
                                type="text" required placeholder="VP of Alliances" className="form-input"
                                value={commonFields.designation} onChange={(e) => setCommonFields({...commonFields, designation: e.target.value})}
                                suppressHydrationWarning
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
                                suppressHydrationWarning
                              />
                            </div>
                            <div>
                              <label className="form-label">Phone Number *</label>
                              <input 
                                type="tel" required placeholder="+1 (555) 000-0000" className="form-input"
                                value={commonFields.phone} onChange={(e) => setCommonFields({...commonFields, phone: e.target.value})}
                                suppressHydrationWarning
                              />
                            </div>
                            <div className="form-field-full">
                              <label className="form-label">Website / Social Profile URL</label>
                              <input 
                                type="url" placeholder="https://acme.com" className="form-input"
                                value={commonFields.website} onChange={(e) => setCommonFields({...commonFields, website: e.target.value})}
                                suppressHydrationWarning
                              />
                            </div>
                            <div>
                              <label className="form-label">Country *</label>
                              <select 
                                className="form-input form-select"
                                value={commonFields.country} onChange={(e) => setCommonFields({...commonFields, country: e.target.value})}
                                suppressHydrationWarning
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
                                suppressHydrationWarning
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
                                suppressHydrationWarning
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

                        {/* ─ STEP 2: MODEL-SPECIFIC ADDITIONAL FIELDS ─ */}
                        {activeStep === 2 && (
                          <div className="form-grid">
                            
                            {/* Technology Form Fields */}
                            {activeModel === 'Technology Partnerships' && (
                              <>
                                <div>
                                  <label className="form-label">Product / Platform Name *</label>
                                  <input 
                                    type="text" required placeholder="Velocity OS" className="form-input"
                                    value={techSpecifics.productName} onChange={(e) => setTechSpecifics({...techSpecifics, productName: e.target.value})}
                                    suppressHydrationWarning
                                  />
                                </div>
                                <div>
                                  <label className="form-label">Technology Category *</label>
                                  <select 
                                    className="form-input form-select"
                                    value={techSpecifics.techCategory} onChange={(e) => setTechSpecifics({...techSpecifics, techCategory: e.target.value})}
                                    suppressHydrationWarning
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
                                    suppressHydrationWarning
                                  />
                                </div>
                                <div>
                                  <label className="form-label">Integration Requirements *</label>
                                  <input 
                                    type="text" required placeholder="e.g. REST API, Webhooks, OAuth SSO" className="form-input"
                                    value={techSpecifics.integrationRequirements} onChange={(e) => setTechSpecifics({...techSpecifics, integrationRequirements: e.target.value})}
                                    suppressHydrationWarning
                                  />
                                </div>
                                <div>
                                  <label className="form-label">APIs Available? *</label>
                                  <select 
                                    className="form-input form-select"
                                    value={techSpecifics.apisAvailable} onChange={(e) => setTechSpecifics({...techSpecifics, apisAvailable: e.target.value})}
                                    suppressHydrationWarning
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
                                    suppressHydrationWarning
                                  />
                                </div>
                                <div>
                                  <label className="form-label">Deployment Regions *</label>
                                  <input 
                                    type="text" required placeholder="North America, EU Central, APAC" className="form-input"
                                    value={techSpecifics.deploymentRegions} onChange={(e) => setTechSpecifics({...techSpecifics, deploymentRegions: e.target.value})}
                                    suppressHydrationWarning
                                  />
                                </div>
                                <div>
                                  <label className="form-label">Infrastructure Model *</label>
                                  <input 
                                    type="text" required placeholder="AWS Multi-tenant, On-Premise" className="form-input"
                                    value={techSpecifics.infrastructureModel} onChange={(e) => setTechSpecifics({...techSpecifics, infrastructureModel: e.target.value})}
                                    suppressHydrationWarning
                                  />
                                </div>
                                <div className="form-field-full">
                                  <label className="form-label">Existing Partnerships</label>
                                  <textarea 
                                    placeholder="List key current technology alliances or ecosystem integrations..."
                                    rows={3} className="form-input form-textarea"
                                    value={techSpecifics.existingPartnerships} onChange={(e) => setTechSpecifics({...techSpecifics, existingPartnerships: e.target.value})}
                                    suppressHydrationWarning
                                  />
                                </div>
                                <div className="form-field-full">
                                  <label className="form-label">Requested Collaboration Areas *</label>
                                  <textarea 
                                    required placeholder="Specify core APIs, joint product components, or technical workflows desired..."
                                    rows={3} className="form-input form-textarea"
                                    value={techSpecifics.requestedCollabAreas} onChange={(e) => setTechSpecifics({...techSpecifics, requestedCollabAreas: e.target.value})}
                                    suppressHydrationWarning
                                  />
                                </div>
                              </>
                            )}

                            {/* Strategic Alliances Form Fields */}
                            {activeModel === 'Strategic Alliances' && (
                              <>
                                <div>
                                  <label className="form-label">Organization Type *</label>
                                  <select 
                                    className="form-input form-select"
                                    value={strategicSpecifics.organizationType} onChange={(e) => setStrategicSpecifics({...strategicSpecifics, organizationType: e.target.value})}
                                    suppressHydrationWarning
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
                                    suppressHydrationWarning
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
                                    suppressHydrationWarning
                                  />
                                </div>
                                <div>
                                  <label className="form-label">Geographic Presence *</label>
                                  <input 
                                    type="text" required placeholder="e.g. 15 offices globally, headquartered in Munich" className="form-input"
                                    value={strategicSpecifics.geographicPresence} onChange={(e) => setStrategicSpecifics({...strategicSpecifics, geographicPresence: e.target.value})}
                                    suppressHydrationWarning
                                  />
                                </div>
                                <div>
                                  <label className="form-label">Expansion Goals *</label>
                                  <input 
                                    type="text" required placeholder="Target markets, regions or client segments" className="form-input"
                                    value={strategicSpecifics.expansionGoals} onChange={(e) => setStrategicSpecifics({...strategicSpecifics, expansionGoals: e.target.value})}
                                    suppressHydrationWarning
                                  />
                                </div>
                                <div className="form-field-full">
                                  <label className="form-label">Existing Alliances</label>
                                  <textarea 
                                    placeholder="Name key corporate alliances in related tech/industrial fields..."
                                    rows={2} className="form-input form-textarea"
                                    value={strategicSpecifics.existingAlliances} onChange={(e) => setStrategicSpecifics({...strategicSpecifics, existingAlliances: e.target.value})}
                                    suppressHydrationWarning
                                  />
                                </div>
                                <div>
                                  <label className="form-label">Target Markets *</label>
                                  <input 
                                    type="text" required placeholder="e.g. European Automotive, MEA Infrastructure" className="form-input"
                                    value={strategicSpecifics.targetMarkets} onChange={(e) => setStrategicSpecifics({...strategicSpecifics, targetMarkets: e.target.value})}
                                    suppressHydrationWarning
                                  />
                                </div>
                                <div>
                                  <label className="form-label">Expected Outcomes *</label>
                                  <input 
                                    type="text" required placeholder="e.g. Co-developed platform, 20% growth" className="form-input"
                                    value={strategicSpecifics.expectedOutcomes} onChange={(e) => setStrategicSpecifics({...strategicSpecifics, expectedOutcomes: e.target.value})}
                                    suppressHydrationWarning
                                  />
                                </div>
                              </>
                            )}

                            {/* Channel / Reseller Form Fields */}
                            {activeModel === 'Channel Partnerships' && (
                              <>
                                <div>
                                  <label className="form-label">Sales Team Size *</label>
                                  <input 
                                    type="number" required placeholder="25" className="form-input"
                                    value={channelSpecifics.salesTeamSize} onChange={(e) => setChannelSpecifics({...channelSpecifics, salesTeamSize: e.target.value})}
                                    suppressHydrationWarning
                                  />
                                </div>
                                <div>
                                  <label className="form-label">Regions Covered *</label>
                                  <input 
                                    type="text" required placeholder="Western Europe, DACH Region" className="form-input"
                                    value={channelSpecifics.regionsCovered} onChange={(e) => setChannelSpecifics({...channelSpecifics, regionsCovered: e.target.value})}
                                    suppressHydrationWarning
                                  />
                                </div>
                                <div className="form-field-full">
                                  <label className="form-label">Existing Distribution Network Description *</label>
                                  <textarea 
                                    required placeholder="Describe your distribution channels, retailers, or online frameworks..."
                                    rows={2} className="form-input form-textarea"
                                    value={channelSpecifics.existingDistributionNetwork} onChange={(e) => setChannelSpecifics({...channelSpecifics, existingDistributionNetwork: e.target.value})}
                                    suppressHydrationWarning
                                  />
                                </div>
                                <div>
                                  <label className="form-label">Annual Customer Reach *</label>
                                  <input 
                                    type="text" required placeholder="e.g. 500,000+ business professionals" className="form-input"
                                    value={channelSpecifics.annualCustomerReach} onChange={(e) => setChannelSpecifics({...channelSpecifics, annualCustomerReach: e.target.value})}
                                    suppressHydrationWarning
                                  />
                                </div>
                                <div>
                                  <label className="form-label">Current Products Sold *</label>
                                  <input 
                                    type="text" required placeholder="ERP Tools, Supply chain software" className="form-input"
                                    value={channelSpecifics.currentProductsSold} onChange={(e) => setChannelSpecifics({...channelSpecifics, currentProductsSold: e.target.value})}
                                    suppressHydrationWarning
                                  />
                                </div>
                                <div className="form-field-full">
                                  <label className="form-label">Reseller Experience *</label>
                                  <textarea 
                                    required placeholder="Detail years of experience, brands resold, and operational success..."
                                    rows={2} className="form-input form-textarea"
                                    value={channelSpecifics.resellerExperience} onChange={(e) => setChannelSpecifics({...channelSpecifics, resellerExperience: e.target.value})}
                                    suppressHydrationWarning
                                  />
                                </div>
                                <div>
                                  <label className="form-label">Revenue Expectations (Annual) *</label>
                                  <input 
                                    type="text" required placeholder="e.g. $250k - $500k ARR" className="form-input"
                                    value={channelSpecifics.revenueExpectations} onChange={(e) => setChannelSpecifics({...channelSpecifics, revenueExpectations: e.target.value})}
                                    suppressHydrationWarning
                                  />
                                </div>
                                <div>
                                  <label className="form-label">Support Requirements *</label>
                                  <input 
                                    type="text" required placeholder="e.g. Marketing collateral, technical API training" className="form-input"
                                    value={channelSpecifics.supportRequirements} onChange={(e) => setChannelSpecifics({...channelSpecifics, supportRequirements: e.target.value})}
                                    suppressHydrationWarning
                                  />
                                </div>
                              </>
                            )}

                            {/* Startup Form Fields */}
                            {activeModel === 'Startup Partnerships' && (
                              <>
                                <div>
                                  <label className="form-label">Startup Stage *</label>
                                  <select 
                                    className="form-input form-select"
                                    value={startupSpecifics.startupStage} onChange={(e) => setStartupSpecifics({...startupSpecifics, startupStage: e.target.value})}
                                    suppressHydrationWarning
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
                                    suppressHydrationWarning
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
                                    suppressHydrationWarning
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
                                    suppressHydrationWarning
                                  />
                                </div>
                                <div>
                                  <label className="form-label">Industry Vertical *</label>
                                  <input 
                                    type="text" required placeholder="e.g. Logistics SaaS, Automotive AI" className="form-input"
                                    value={startupSpecifics.industryVertical} onChange={(e) => setStartupSpecifics({...startupSpecifics, industryVertical: e.target.value})}
                                    suppressHydrationWarning
                                  />
                                </div>
                                <div>
                                  <label className="form-label">Current Revenue Range (ARR) *</label>
                                  <input 
                                    type="text" required placeholder="e.g. $50k bootstrapped ARR" className="form-input"
                                    value={startupSpecifics.currentRevenueRange} onChange={(e) => setStartupSpecifics({...startupSpecifics, currentRevenueRange: e.target.value})}
                                    suppressHydrationWarning
                                  />
                                </div>
                                <div>
                                  <label className="form-label">MVP Status *</label>
                                  <select 
                                    className="form-input form-select"
                                    value={startupSpecifics.mvpStatus} onChange={(e) => setStartupSpecifics({...startupSpecifics, mvpStatus: e.target.value})}
                                    suppressHydrationWarning
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
                                    suppressHydrationWarning
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

                            {/* Industry Form Fields */}
                            {activeModel === 'Industry Partnerships' && (
                              <>
                                <div>
                                  <label className="form-label">Industry Segment *</label>
                                  <input 
                                    type="text" required placeholder="e.g. Tier-1 Automotive Parts, Healthtech logistics" className="form-input"
                                    value={industrySpecifics.industrySegment} onChange={(e) => setIndustrySpecifics({...industrySpecifics, industrySegment: e.target.value})}
                                    suppressHydrationWarning
                                  />
                                </div>
                                <div>
                                  <label className="form-label">Operational Geography *</label>
                                  <input 
                                    type="text" required placeholder="Central Europe, India, APAC" className="form-input"
                                    value={industrySpecifics.operationalGeography} onChange={(e) => setIndustrySpecifics({...industrySpecifics, operationalGeography: e.target.value})}
                                    suppressHydrationWarning
                                  />
                                </div>
                                <div className="form-field-full">
                                  <label className="form-label">Industry Challenges Faced *</label>
                                  <textarea 
                                    required placeholder="Detail operational pain points, supply blocks, or technological deficits..."
                                    rows={3} className="form-input form-textarea"
                                    value={industrySpecifics.industryChallenges} onChange={(e) => setIndustrySpecifics({...industrySpecifics, industryChallenges: e.target.value})}
                                    suppressHydrationWarning
                                  />
                                </div>
                                <div className="form-field-full">
                                  <label className="form-label">Existing Software / Legacy Systems</label>
                                  <textarea 
                                    placeholder="List software tools currently deployed (e.g. SAP ERP, Oracle databases)..."
                                    rows={2} className="form-input form-textarea"
                                    value={industrySpecifics.existingSystems} onChange={(e) => setIndustrySpecifics({...industrySpecifics, existingSystems: e.target.value})}
                                    suppressHydrationWarning
                                  />
                                </div>
                                <div>
                                  <label className="form-label">Desired Partnership Outcomes *</label>
                                  <input 
                                    type="text" required placeholder="e.g. Digital IoT tracking, automated ERP workflows" className="form-input"
                                    value={industrySpecifics.desiredOutcomes} onChange={(e) => setIndustrySpecifics({...industrySpecifics, desiredOutcomes: e.target.value})}
                                    suppressHydrationWarning
                                  />
                                </div>
                                <div>
                                  <label className="form-label">Core Use Cases *</label>
                                  <input 
                                    type="text" required placeholder="e.g. Warehouse optimization, battery monitoring" className="form-input"
                                    value={industrySpecifics.useCases} onChange={(e) => setIndustrySpecifics({...industrySpecifics, useCases: e.target.value})}
                                    suppressHydrationWarning
                                  />
                                </div>
                                <div className="form-field-full">
                                  <label className="form-label">Industry Certifications Required</label>
                                  <input 
                                    type="text" placeholder="e.g. ISO 26262, HIPAA Compliance, GDPR" className="form-input"
                                    value={industrySpecifics.industryCertifications} onChange={(e) => setIndustrySpecifics({...industrySpecifics, industryCertifications: e.target.value})}
                                    suppressHydrationWarning
                                  />
                                </div>
                              </>
                            )}

                            {/* Research & Innovation Form Fields */}
                            {activeModel === 'Research & Innovation Partnerships' && (
                              <>
                                <div>
                                  <label className="form-label">Institution / Organization Type *</label>
                                  <select 
                                    className="form-input form-select"
                                    value={researchSpecifics.institutionType} onChange={(e) => setResearchSpecifics({...researchSpecifics, institutionType: e.target.value})}
                                    suppressHydrationWarning
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
                                    suppressHydrationWarning
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
                                    suppressHydrationWarning
                                  />
                                </div>
                                <div>
                                  <label className="form-label">Innovation Focus Area *</label>
                                  <input 
                                    type="text" required placeholder="e.g. Solid state batteries, dynamic load mapping" className="form-input"
                                    value={researchSpecifics.innovationFocus} onChange={(e) => setResearchSpecifics({...researchSpecifics, innovationFocus: e.target.value})}
                                    suppressHydrationWarning
                                  />
                                </div>
                                <div className="form-field-full">
                                  <label className="form-label">Research Funding Status *</label>
                                  <input 
                                    type="text" required placeholder="e.g. Backed by Gov grant, seeking corporate seed" className="form-input"
                                    value={researchSpecifics.researchFundingStatus} onChange={(e) => setResearchSpecifics({...researchSpecifics, researchFundingStatus: e.target.value})}
                                    suppressHydrationWarning
                                  />
                                </div>
                                <div className="form-field-full">
                                  <label className="form-label">Existing Publications / References</label>
                                  <textarea 
                                    placeholder="List key academic or industry publications related to this study..."
                                    rows={2} className="form-input form-textarea"
                                    value={researchSpecifics.publications} onChange={(e) => setResearchSpecifics({...researchSpecifics, publications: e.target.value})}
                                    suppressHydrationWarning
                                  />
                                </div>
                                <div>
                                  <label className="form-label">Research Duration Estimate *</label>
                                  <input 
                                    type="text" required placeholder="e.g. 18 months, Phase 1 complete" className="form-input"
                                    value={researchSpecifics.researchDuration} onChange={(e) => setResearchSpecifics({...researchSpecifics, researchDuration: e.target.value})}
                                    suppressHydrationWarning
                                  />
                                </div>
                                <div>
                                  <label className="form-label">Collaboration Goals *</label>
                                  <input 
                                    type="text" required placeholder="e.g. Joint prototype deployment, licensing" className="form-input"
                                    value={researchSpecifics.collaborationGoals} onChange={(e) => setResearchSpecifics({...researchSpecifics, collaborationGoals: e.target.value})}
                                    suppressHydrationWarning
                                  />
                                </div>
                              </>
                            )}

                          </div>
                        )}

                        {/* ─ STEP 3: COLLABORATION SCOPE & CONSENT ─ */}
                        {activeStep === 3 && (
                          <div className="form-grid">
                            <div className="form-field-full">
                              <label className="form-label">Partnership Goals (Intent) *</label>
                              <textarea 
                                required placeholder="Detail the core value you expect to build or deliver through this partnership..."
                                rows={3} className="form-input form-textarea"
                                value={commonFields.partnershipGoals} onChange={(e) => setCommonFields({...commonFields, partnershipGoals: e.target.value})}
                                suppressHydrationWarning
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
                                suppressHydrationWarning
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
                                suppressHydrationWarning
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
                                suppressHydrationWarning
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

                        {/* Navigation Step controls */}
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

                    {/* =======================================================
                        PART 2: HIGHLY CUSTOM CONTENT CREATOR & INFLUENCER FORM
                        ======================================================= */}
                    {activeModel === 'Content Creator & Influencer Partnerships' && (
                      <>
                        {/* ─ STEP 1: CREATOR DETAILS ─ */}
                        {activeStep === 1 && (
                          <div className="form-grid">
                            <div>
                              <label className="form-label">Creator / Talent Name *</label>
                              <input 
                                type="text" required placeholder="Jane Doe" className="form-input"
                                value={creatorForm.fullName} onChange={(e) => setCreatorForm({...creatorForm, fullName: e.target.value})}
                                suppressHydrationWarning
                              />
                            </div>
                            <div>
                              <label className="form-label">Work Email *</label>
                              <input 
                                type="email" required placeholder="creators@brand.com" className="form-input"
                                value={creatorForm.email} onChange={(e) => setCreatorForm({...creatorForm, email: e.target.value})}
                                suppressHydrationWarning
                              />
                            </div>
                            <div>
                              <label className="form-label">Phone Number *</label>
                              <input 
                                type="tel" required placeholder="+1 (555) 000-0000" className="form-input"
                                value={creatorForm.phone} onChange={(e) => setCreatorForm({...creatorForm, phone: e.target.value})}
                                suppressHydrationWarning
                              />
                            </div>
                            <div>
                              <label className="form-label">Creator Category *</label>
                              <select 
                                className="form-input form-select"
                                value={creatorForm.creatorCategory} onChange={(e) => setCreatorForm({...creatorForm, creatorCategory: e.target.value})}
                                suppressHydrationWarning
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
                                suppressHydrationWarning
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
                                suppressHydrationWarning
                              />
                            </div>
                            <div className="form-field-full">
                              <label className="form-label">Username / Channel Link *</label>
                              <input 
                                type="url" required placeholder="https://youtube.com/c/mychannel" className="form-input"
                                value={creatorForm.channelLink} onChange={(e) => setCreatorForm({...creatorForm, channelLink: e.target.value})}
                                suppressHydrationWarning
                              />
                            </div>
                            <div className="form-field-full">
                              <label className="form-label">Agency Representation? *</label>
                              <select 
                                className="form-input form-select"
                                value={creatorForm.agencyRepresentation} onChange={(e) => setCreatorForm({...creatorForm, agencyRepresentation: e.target.value})}
                                suppressHydrationWarning
                              >
                                <option value="No">No (Independent Creator)</option>
                                <option value="Yes">Yes (Represented by Talent Agency)</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {/* ─ STEP 2: AUDIENCE INFORMATION ─ */}
                        {activeStep === 2 && (
                          <div className="form-grid">
                            <div>
                              <label className="form-label">Followers / Subscribers Count *</label>
                              <input 
                                type="text" required placeholder="e.g. 150,000" className="form-input"
                                value={creatorForm.subscribersCount} onChange={(e) => setCreatorForm({...creatorForm, subscribersCount: e.target.value})}
                                suppressHydrationWarning
                              />
                            </div>
                            <div>
                              <label className="form-label">Average Campaign Reach *</label>
                              <input 
                                type="text" required placeholder="e.g. 25,000 views per post" className="form-input"
                                value={creatorForm.averageReach} onChange={(e) => setCreatorForm({...creatorForm, averageReach: e.target.value})}
                                suppressHydrationWarning
                              />
                            </div>
                            <div>
                              <label className="form-label">Monthly Views *</label>
                              <input 
                                type="text" required placeholder="e.g. 1.2 Million total views" className="form-input"
                                value={creatorForm.monthlyViews} onChange={(e) => setCreatorForm({...creatorForm, monthlyViews: e.target.value})}
                                suppressHydrationWarning
                              />
                            </div>
                            <div>
                              <label className="form-label">Audience Primary Geography *</label>
                              <input 
                                type="text" required placeholder="e.g. 45% US, 20% UK, 15% Germany" className="form-input"
                                value={creatorForm.audienceGeography} onChange={(e) => setCreatorForm({...creatorForm, audienceGeography: e.target.value})}
                                suppressHydrationWarning
                              />
                            </div>
                            <div>
                              <label className="form-label">Audience Age Groups *</label>
                              <input 
                                type="text" required placeholder="e.g. 70% (25-34), 20% (18-24)" className="form-input"
                                value={creatorForm.audienceAgeGroups} onChange={(e) => setCreatorForm({...creatorForm, audienceAgeGroups: e.target.value})}
                                suppressHydrationWarning
                              />
                            </div>
                            <div>
                              <label className="form-label">Audience Key Interests *</label>
                              <input 
                                type="text" required placeholder="e.g. Coding, EV tech, Stock Trading" className="form-input"
                                value={creatorForm.audienceInterests} onChange={(e) => setCreatorForm({...creatorForm, audienceInterests: e.target.value})}
                                suppressHydrationWarning
                              />
                            </div>
                          </div>
                        )}

                        {/* ─ STEP 3: COLLABORATION DETAILS ─ */}
                        {activeStep === 3 && (
                          <div className="form-grid">
                            <div>
                              <label className="form-label">Preferred Partnership Type *</label>
                              <select 
                                className="form-input form-select"
                                value={creatorForm.preferredPartnership} onChange={(e) => setCreatorForm({...creatorForm, preferredPartnership: e.target.value})}
                                suppressHydrationWarning
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
                                suppressHydrationWarning
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
                                suppressHydrationWarning
                              />
                            </div>
                            <div className="form-field-full">
                              <label className="form-label">Previous Brand Collaborations</label>
                              <textarea 
                                placeholder="List key technology or related corporate brands you have previously endorsed..."
                                rows={2} className="form-input form-textarea"
                                value={creatorForm.previousBrands} onChange={(e) => setCreatorForm({...creatorForm, previousBrands: e.target.value})}
                                suppressHydrationWarning
                              />
                            </div>
                            <div>
                              <label className="form-label">Expected Pricing Range ($ USD) *</label>
                              <input 
                                type="text" required placeholder="e.g. $1,200 flat fee per video" className="form-input"
                                value={creatorForm.expectedPricing} onChange={(e) => setCreatorForm({...creatorForm, expectedPricing: e.target.value})}
                                suppressHydrationWarning
                              />
                            </div>
                            <div>
                              <label className="form-label">Languages Spoken *</label>
                              <input 
                                type="text" required placeholder="English, Spanish" className="form-input"
                                value={creatorForm.languagesSpoken} onChange={(e) => setCreatorForm({...creatorForm, languagesSpoken: e.target.value})}
                                suppressHydrationWarning
                              />
                            </div>
                            <div className="form-field-full">
                              <label className="form-label">Content Production Capacity *</label>
                              <input 
                                type="text" required placeholder="e.g. 2 dedicated videos and 5 reels per month" className="form-input"
                                value={creatorForm.productionCapacity} onChange={(e) => setCreatorForm({...creatorForm, productionCapacity: e.target.value})}
                                suppressHydrationWarning
                              />
                            </div>
                            <div className="form-field-full">
                              <label className="form-label">Portfolio / Media Kit Link</label>
                              <input 
                                type="url" placeholder="https://linktr.ee/my-media-kit" className="form-input"
                                value={creatorForm.portfolioUrl} onChange={(e) => setCreatorForm({...creatorForm, portfolioUrl: e.target.value})}
                                suppressHydrationWarning
                              />
                            </div>
                          </div>
                        )}

                        {/* ─ STEP 4: VERIFICATION & DECLARATION ─ */}
                        {activeStep === 4 && (
                          <div className="form-grid">
                            <div className="form-field-full">
                              <label className="form-label">Social Handles *</label>
                              <input 
                                type="text" required placeholder="Twitter: @janespeaks, Instagram: @janeblog" className="form-input"
                                value={creatorForm.socialHandles} onChange={(e) => setCreatorForm({...creatorForm, socialHandles: e.target.value})}
                                suppressHydrationWarning
                              />
                            </div>
                            <div>
                              <label className="form-label">Verified Engagement Rate (%) *</label>
                              <input 
                                type="text" required placeholder="e.g. 4.2%" className="form-input"
                                value={creatorForm.engagementRate} onChange={(e) => setCreatorForm({...creatorForm, engagementRate: e.target.value})}
                                suppressHydrationWarning
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

                        {/* Navigation Step controls */}
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
      )}

    </div>
  );
}
