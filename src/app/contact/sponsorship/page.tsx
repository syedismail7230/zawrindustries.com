"use client";

import React, { useState } from 'react';

export default function SponsorshipPage() {
  const [formData, setFormData] = useState({
    // 1. Company Information
    companyName: '',
    parentCompany: '',
    industry: '',
    website: '',
    registrationNumber: '',
    companySize: '',
    headquarters: '',
    socialLinks: '',
    
    // 2. Contact Person Details
    fullName: '',
    designation: '',
    email: '',
    mobile: '',
    linkedin: '',
    alternateContact: '',
    
    // 3. Sponsorship Interest
    sponsorshipType: 'Title Sponsor',
    eventInterestedIn: '',
    objective: 'Brand Awareness',
    
    // 4. Budget & Commercials
    budgetRange: '',
    currency: 'USD',
    expectedROI: '',
    paymentTerms: '',
    invoiceDetails: '',
    taxRequirements: '',
    
    // 5. Branding Requirements
    preferredColors: '',
    mandatoryMessaging: '',
    tagline: '',
    creativeRestrictions: '',
    
    // 6. Deliverables Required
    deliverables: [] as string[],
    
    // 7. Audience & Campaign Fit
    targetAudience: '',
    geography: '',
    industryFocus: '',
    expectedReach: '',
    kpis: '',
    
    // 8. Legal & Compliance
    termsAcceptance: false,
    dataProcessingConsent: false,
    trademarkUsageApproval: false,
    contentApprovalAgreement: false,
    antiBriberyDeclaration: false,
    cancellationPolicyAcceptance: false
  });

  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    companyProfile: null,
    logoPackage: null,
    brandKit: null,
    sponsorshipProposal: null,
    nda: null,
    purchaseOrder: null,
    brandGuidelines: null
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setFormData({ ...formData, [target.name]: value });
  };

  const handleDeliverableToggle = (deliverable: string) => {
    setFormData(prev => {
      const current = prev.deliverables;
      if (current.includes(deliverable)) {
        return { ...prev, deliverables: current.filter(d => d !== deliverable) };
      } else {
        return { ...prev, deliverables: [...current, deliverable] };
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files[0]) {
      setFiles({ ...files, [fieldName]: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verify mandatory compliance
    if (!formData.termsAcceptance || !formData.dataProcessingConsent) {
      alert("Please accept the mandatory Legal & Compliance terms.");
      return;
    }

    setStatus('loading');

    try {
      const data = new FormData();
      
      // Append all text data
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'deliverables') {
          data.append(key, JSON.stringify(value));
        } else {
          data.append(key, String(value));
        }
      });

      // Append all files
      Object.entries(files).forEach(([key, file]) => {
        if (file) {
          data.append(key, file);
        }
      });

      const response = await fetch('/api/sponsorship', {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error submitting sponsorship form:', error);
      setStatus('error');
    }
  };

  const inputStyle = { width: '100%', padding: '1rem', backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.75rem', color: '#ffffff', outline: 'none' };
  const labelStyle = { fontSize: '0.875rem', fontWeight: 600, color: '#d1d5db', marginBottom: '0.5rem', display: 'block' };
  const sectionTitleStyle = { fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: '1px solid #374151', paddingBottom: '0.75rem', color: '#f3f4f6' };
  const sectionStyle = { marginBottom: '3rem', backgroundColor: '#0f0f0f', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #1f2937' };

  if (status === 'success') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 600, marginBottom: '1rem', color: '#10b981' }}>Application Received</h1>
          <p style={{ fontSize: '1.125rem', color: '#9ca3af', maxWidth: '40rem', margin: '0 auto' }}>
            Thank you for your interest in sponsoring Zawr Industries. Our Marketing team will review your application and contact you shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#ffffff', paddingBottom: '6rem', fontFamily: 'sans-serif' }}>
      
      {/* Hero Section */}
      <div style={{ position: 'relative', width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', overflow: 'hidden', marginBottom: '6rem' }}>
        
        {/* Full-screen Background Image */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img 
            src="https://res.cloudinary.com/murfclni/image/upload/f_avif,q_auto:eco,w_1600,c_limit,dpr_auto/v1783710552/zawr/assets/sponsorship-hero.png" 
            alt="Sponsorship Opportunities" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2070' }} 
           loading="lazy" decoding="async" />
          {/* Gradient overlay to ensure text is readable and blends into the black background below */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #000000 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%)' }}></div>
        </div>

        {/* Overlay Content */}
        <div style={{ position: 'relative', zIndex: 10, padding: '0 1.5rem', maxWidth: '64rem' }}>
          <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 600, marginBottom: '1.5rem', letterSpacing: '-0.02em', textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>Partner with Zawr</h1>
          <p style={{ fontSize: '1.25rem', color: '#f3f4f6', maxWidth: '48rem', margin: '0 auto', lineHeight: 1.6, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            Accelerate your brand's growth by partnering with the fastest-growing technology ecosystem. Explore extensive sponsorship opportunities.
          </p>
        </div>
      </div>

      {/* Main Form */}
      <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '0 1.5rem' }}>
        <form onSubmit={handleSubmit}>

          {/* 1. Company Information */}
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>1. Company Information</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Company / Brand Name *</label>
                <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Parent Company (if applicable)</label>
                <input type="text" name="parentCompany" value={formData.parentCompany} onChange={handleInputChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Industry / Category</label>
                <input type="text" name="industry" value={formData.industry} onChange={handleInputChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Company Website</label>
                <input type="url" name="website" value={formData.website} onChange={handleInputChange} placeholder="https://" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Registration Number / GSTIN</label>
                <input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleInputChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Company Size</label>
                <select name="companySize" value={formData.companySize} onChange={handleInputChange} style={inputStyle}>
                  <option value="">Select Size</option>
                  <option value="Startup">Startup</option>
                  <option value="SME">SME</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Headquarters Location</label>
                <input type="text" name="headquarters" value={formData.headquarters} onChange={handleInputChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Social Media Links</label>
                <input type="text" name="socialLinks" value={formData.socialLinks} onChange={handleInputChange} placeholder="LinkedIn, Twitter, etc." style={inputStyle} />
              </div>
            </div>
          </div>

          {/* 2. Contact Person Details */}
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>2. Contact Person Details</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Designation</label>
                <input type="text" name="designation" value={formData.designation} onChange={handleInputChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email Address *</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Mobile Number</label>
                <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>LinkedIn Profile</label>
                <input type="url" name="linkedin" value={formData.linkedin} onChange={handleInputChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Alternate Contact</label>
                <input type="text" name="alternateContact" value={formData.alternateContact} onChange={handleInputChange} style={inputStyle} />
              </div>
            </div>
          </div>

          {/* 3. Sponsorship Interest */}
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>3. Sponsorship Interest</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Sponsorship Type</label>
                <select name="sponsorshipType" value={formData.sponsorshipType} onChange={handleInputChange} style={inputStyle}>
                  <option value="Title Sponsor">Title Sponsor</option>
                  <option value="Co-Sponsor">Co-Sponsor</option>
                  <option value="Associate Sponsor">Associate Sponsor</option>
                  <option value="Powered By">Powered By</option>
                  <option value="Digital Sponsor">Digital Sponsor</option>
                  <option value="Technology Partner">Technology Partner</option>
                  <option value="Media Partner">Media Partner</option>
                  <option value="Community Partner">Community Partner</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Event / Campaign Interested In</label>
                <input type="text" name="eventInterestedIn" value={formData.eventInterestedIn} onChange={handleInputChange} style={inputStyle} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Objective of Sponsorship</label>
                <select name="objective" value={formData.objective} onChange={handleInputChange} style={inputStyle}>
                  <option value="Brand Awareness">Brand Awareness</option>
                  <option value="Lead Generation">Lead Generation</option>
                  <option value="Product Launch">Product Launch</option>
                  <option value="Recruitment">Recruitment</option>
                  <option value="Networking">Networking</option>
                  <option value="CSR">CSR</option>
                </select>
              </div>
            </div>
          </div>

          {/* 4. Budget & Commercials */}
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>4. Budget & Commercials</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Sponsorship Budget Range</label>
                <input type="text" name="budgetRange" value={formData.budgetRange} onChange={handleInputChange} placeholder="e.g., $10k - $50k" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Preferred Currency</label>
                <select name="currency" value={formData.currency} onChange={handleInputChange} style={inputStyle}>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="AED">AED (د.إ)</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Expected ROI</label>
                <input type="text" name="expectedROI" value={formData.expectedROI} onChange={handleInputChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Payment Terms Preference</label>
                <input type="text" name="paymentTerms" value={formData.paymentTerms} onChange={handleInputChange} style={inputStyle} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Invoice Details & Tax Requirements</label>
                <textarea name="invoiceDetails" value={formData.invoiceDetails} onChange={handleInputChange} rows={3} style={{...inputStyle, resize: 'vertical'}} />
              </div>
            </div>
          </div>

          {/* 5. Branding Requirements */}
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>5. Branding Requirements</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Preferred Brand Colors</label>
                <input type="text" name="preferredColors" value={formData.preferredColors} onChange={handleInputChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Tagline</label>
                <input type="text" name="tagline" value={formData.tagline} onChange={handleInputChange} style={inputStyle} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Mandatory Messaging</label>
                <textarea name="mandatoryMessaging" value={formData.mandatoryMessaging} onChange={handleInputChange} rows={2} style={inputStyle} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Creative Restrictions</label>
                <textarea name="creativeRestrictions" value={formData.creativeRestrictions} onChange={handleInputChange} rows={2} style={inputStyle} />
              </div>
            </div>
          </div>

          {/* 6. Deliverables Required */}
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>6. Deliverables Required</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                "Logo on website", "Stage branding", "LED screen display",
                "Social media mentions", "Booth/stall", "Speaking slot",
                "Product showcase", "Email marketing inclusion", "VIP access", "Lead sharing"
              ].map(item => (
                <label key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', color: '#d1d5db' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.deliverables.includes(item)}
                    onChange={() => handleDeliverableToggle(item)}
                    style={{ width: '1.25rem', height: '1.25rem', accentColor: '#10b981' }}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          {/* 7. Audience & Campaign Fit */}
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>7. Audience & Campaign Fit</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Target Audience</label>
                <input type="text" name="targetAudience" value={formData.targetAudience} onChange={handleInputChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Geography</label>
                <input type="text" name="geography" value={formData.geography} onChange={handleInputChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Industry Focus</label>
                <input type="text" name="industryFocus" value={formData.industryFocus} onChange={handleInputChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Expected Reach / KPIs</label>
                <input type="text" name="kpis" value={formData.kpis} onChange={handleInputChange} style={inputStyle} />
              </div>
            </div>
          </div>

          {/* 8. Legal & Compliance */}
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>8. Legal & Compliance</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { name: 'termsAcceptance', label: 'Terms Acceptance *' },
                { name: 'dataProcessingConsent', label: 'Data Processing Consent *' },
                { name: 'trademarkUsageApproval', label: 'Trademark Usage Approval' },
                { name: 'contentApprovalAgreement', label: 'Content Approval Agreement' },
                { name: 'antiBriberyDeclaration', label: 'Anti-Bribery Declaration' },
                { name: 'cancellationPolicyAcceptance', label: 'Cancellation Policy Acceptance' }
              ].map(item => (
                <label key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', color: '#d1d5db' }}>
                  <input 
                    type="checkbox" 
                    name={item.name}
                    checked={(formData as any)[item.name]}
                    onChange={handleInputChange}
                    required={item.name === 'termsAcceptance' || item.name === 'dataProcessingConsent'}
                    style={{ width: '1.25rem', height: '1.25rem', accentColor: '#10b981' }}
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </div>

          {/* 9. Documents Upload */}
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>9. Documents Upload</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Company Profile</label>
                <input type="file" onChange={(e) => handleFileChange(e, 'companyProfile')} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Logo Package / Upload</label>
                <input type="file" onChange={(e) => handleFileChange(e, 'logoPackage')} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Brand Kit / Guidelines PDF</label>
                <input type="file" onChange={(e) => handleFileChange(e, 'brandGuidelines')} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Sponsorship Proposal</label>
                <input type="file" onChange={(e) => handleFileChange(e, 'sponsorshipProposal')} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>NDA (Optional)</label>
                <input type="file" onChange={(e) => handleFileChange(e, 'nda')} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Purchase Order</label>
                <input type="file" onChange={(e) => handleFileChange(e, 'purchaseOrder')} style={inputStyle} />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={status === 'loading'}
            style={{ 
              width: '100%', 
              backgroundColor: status === 'loading' ? '#374151' : '#ffffff', 
              color: status === 'loading' ? '#9ca3af' : '#000000', 
              padding: '1.25rem', 
              borderRadius: '0.75rem', 
              fontSize: '1.125rem', 
              fontWeight: 700, 
              border: 'none', 
              cursor: status === 'loading' ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {status === 'loading' ? 'Submitting Application...' : 'Submit Sponsorship Request'}
          </button>
          
          {status === 'error' && (
            <p style={{ color: '#ef4444', textAlign: 'center', marginTop: '1rem' }}>An error occurred while submitting. Please try again.</p>
          )}

        </form>
      </div>
    </div>
  );
}
