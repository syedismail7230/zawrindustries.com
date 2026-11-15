'use client';

import React, { useState, useEffect } from 'react';

interface AIBlogStudioProps {
  theme: {
    bg: string;
    fg: string;
    border: string;
    muted: string;
    inputBg: string;
  };
  onBlogPublished: () => void;
}

export default function AIBlogStudio({ theme, onBlogPublished }: AIBlogStudioProps) {
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('');
  const [forceApprove, setForceApprove] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState('');
  const [pendingDrafts, setPendingDrafts] = useState<any[]>([]);
  const [loadingDrafts, setLoadingDrafts] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<{ [blogId: string]: File | null }>({});
  const [uploadingImage, setUploadingImage] = useState<{ [blogId: string]: boolean }>({});
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [indexingInProgress, setIndexingInProgress] = useState(false);
  const [indexingStatus, setIndexingStatus] = useState<string | null>(null);

  const industries = [
    'Artificial Intelligence',
    'Supply Chain & Logistics',
    'Advanced Manufacturing',
    'Enterprise Technology',
    'Real Estate & Infrastructure',
    'Sustainability & Clean Energy',
  ];

  const fetchDrafts = async () => {
    setLoadingDrafts(true);
    try {
      const res = await fetch('/api/webmaster/ai-blog');
      if (res.ok) {
        const data = await res.json();
        setPendingDrafts(data.drafts || []);
      }
    } catch (e) {
      console.error('Error fetching AI blog drafts:', e);
    } finally {
      setLoadingDrafts(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setStatusMessage(null);
    setGenerationStage('Conducting topic research...');

    try {
      setTimeout(() => setGenerationStage('Generating factual analysis & editorial drafting...'), 2000);
      setTimeout(() => setGenerationStage('Auditing assertions via 2-layer fact-check...'), 4500);

      const res = await fetch('/api/webmaster/ai-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          topic,
          category,
          forceApprove,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.actionTaken === 'auto_published') {
          setStatusMessage({
            text: `Article "${data.blog.title}" verified and published. Weekly newsletter dispatched to subscribers.`,
            type: 'success',
          });
        } else {
          setStatusMessage({
            text: `Draft created for "${data.blog.title}". Held for review: ${data.blog.sensitivityReason || 'Editorial verification required'}. Approval email dispatched to webmaster.`,
            type: 'success',
          });
        }
        setTopic('');
        fetchDrafts();
        onBlogPublished();
      } else {
        setStatusMessage({ text: data.error || 'Failed to generate AI blog article.', type: 'error' });
      }
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Error executing AI generation.', type: 'error' });
    } finally {
      setGenerating(false);
      setGenerationStage('');
    }
  };

  const handleUploadImageAndPublish = async (blogId: string) => {
    const file = selectedImageFile[blogId];
    if (!file) {
      alert('Please select an image file first.');
      return;
    }

    setUploadingImage((prev) => ({ ...prev, [blogId]: true }));
    setStatusMessage(null);

    const formData = new FormData();
    formData.append('action', 'upload_image_and_publish');
    formData.append('blogId', blogId);
    formData.append('image', file);

    try {
      const res = await fetch('/api/webmaster/ai-blog', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({
          text: 'Custom banner uploaded to Cloudinary, article published, and newsletter broadcasted.',
          type: 'success',
        });
        fetchDrafts();
        onBlogPublished();
      } else {
        alert(data.error || 'Failed to upload image and publish.');
      }
    } catch (e: any) {
      alert('Upload error: ' + e.message);
    } finally {
      setUploadingImage((prev) => ({ ...prev, [blogId]: false }));
    }
  };

  const handleApproveWithDefault = async (blogId: string, approvalToken?: string) => {
    setStatusMessage(null);
    try {
      const url = `/api/webmaster/ai-blog?action=approve_default&id=${blogId}&token=${approvalToken || 'token'}`;
      const res = await fetch(url);
      if (res.ok) {
        setStatusMessage({
          text: 'Article published with default industry banner and newsletter broadcasted.',
          type: 'success',
        });
        fetchDrafts();
        onBlogPublished();
      } else {
        alert('Failed to approve article.');
      }
    } catch (e: any) {
      alert('Approval error: ' + e.message);
    }
  };

  const handleHoldArticle = async (blogId: string, approvalToken?: string) => {
    setStatusMessage(null);
    try {
      const url = `/api/webmaster/ai-blog?action=hold&id=${blogId}&token=${approvalToken || 'token'}`;
      const res = await fetch(url);
      if (res.ok) {
        setStatusMessage({ text: 'Article placed on hold.', type: 'success' });
        fetchDrafts();
      }
    } catch (e: any) {
      alert('Hold error: ' + e.message);
    }
  };

  const handleSendTestNewsletter = async (blogId: string) => {
    const email = prompt('Enter email address to send test newsletter to:');
    if (!email) return;

    try {
      const res = await fetch('/api/webmaster/ai-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test_newsletter',
          blogId,
          testEmail: email,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert(`Test newsletter dispatched to ${email}! Check your inbox.`);
      } else {
        alert(data.error || 'Failed to send test newsletter.');
      }
    } catch (e: any) {
      alert('Test newsletter error: ' + e.message);
    }
  };

  const handleReindexAll = async () => {
    setIndexingInProgress(true);
    setIndexingStatus('Pinging IndexNow network, Google, and Bing for all published dispatches...');
    try {
      const res = await fetch('/api/webmaster/indexing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIndexingStatus(`Submission acknowledged: ${data.publishedCount || 0} articles submitted to IndexNow (Bing, Yandex, Seznam) & Sitemap pings sent.`);
      } else {
        setIndexingStatus(`Error: ${data.error || 'Failed to ping search engines'}`);
      }
    } catch (err: any) {
      setIndexingStatus(`Failed: ${err.message}`);
    } finally {
      setIndexingInProgress(false);
    }
  };

  return (
    <div style={{ padding: '2rem', border: `1px solid ${theme.border}`, borderRadius: '8px', backgroundColor: theme.inputBg, marginBottom: '3rem' }}>
      
      {/* Header matching standard Webmaster form titles */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 0.5rem 0', color: theme.fg }}>
            Autonomous AI Blog Engine
          </h3>
          <p style={{ margin: 0, fontSize: '0.875rem', color: theme.muted }}>
            Generates research-driven B2B articles with zero fake commitments, 2-layer fact validation, and newsletter distribution.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchDrafts}
          disabled={loadingDrafts}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'transparent',
            border: `1px solid ${theme.border}`,
            color: theme.fg,
            borderRadius: '4px',
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          {loadingDrafts ? 'Refreshing...' : 'Refresh Queue'}
        </button>
      </div>

      {statusMessage && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: '4px',
          marginBottom: '1.5rem',
          backgroundColor: theme.bg,
          border: `1px solid ${statusMessage.type === 'success' ? '#10b981' : '#ef4444'}`,
          color: statusMessage.type === 'success' ? '#10b981' : '#ef4444',
          fontSize: '0.875rem',
          lineHeight: 1.5
        }}>
          {statusMessage.text}
        </div>
      )}

      {/* Generation Form using Platform Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="wm-grid-2col" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>
              Custom Topic / Focus Area (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Next-Gen Grid Modernization & Edge Computing"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={generating}
              style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '4px', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: theme.muted }}>
              Industry Vertical
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={generating}
              style={{ width: '100%', padding: '0.75rem', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, borderRadius: '4px', outline: 'none' }}
            >
              <option value="">Auto-Discover Trending Industry</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generating}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: theme.fg,
                color: theme.bg,
                border: 'none',
                borderRadius: '4px',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: generating ? 'not-allowed' : 'pointer',
                opacity: generating ? 0.6 : 1
              }}
            >
              {generating ? 'Generating...' : 'Generate AI Article'}
            </button>

            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: theme.muted, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={forceApprove}
                onChange={(e) => setForceApprove(e.target.checked)}
                disabled={generating}
              />
              Bypass sensitivity review (auto-publish immediately)
            </label>
          </div>

          {generating && (
            <div style={{ fontSize: '0.85rem', color: theme.muted }}>
              {generationStage}
            </div>
          )}
        </div>
      </div>

      {/* Pending Approval / Review Queue */}
      {pendingDrafts.length > 0 && (
        <div style={{ marginTop: '2.5rem', borderTop: `1px solid ${theme.border}`, paddingTop: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 1rem 0', color: theme.fg }}>
            Pending Review &amp; Approval Queue ({pendingDrafts.length})
          </h4>

          <div className="wm-table-wrapper">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                  <th style={{ padding: '0.75rem 1rem', color: theme.muted, fontWeight: 500, fontSize: '0.85rem' }}>Title</th>
                  <th style={{ padding: '0.75rem 1rem', color: theme.muted, fontWeight: 500, fontSize: '0.85rem' }}>Category</th>
                  <th style={{ padding: '0.75rem 1rem', color: theme.muted, fontWeight: 500, fontSize: '0.85rem' }}>Review Reason</th>
                  <th style={{ padding: '0.75rem 1rem', color: theme.muted, fontWeight: 500, fontSize: '0.85rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingDrafts.map((draft) => (
                  <tr key={draft.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                    <td style={{ padding: '1rem', fontWeight: 500, color: theme.fg }}>
                      <div>{draft.title}</div>
                      <div style={{ fontSize: '0.75rem', color: theme.muted, marginTop: '0.25rem' }}>{draft.readTime}</div>
                    </td>
                    <td style={{ padding: '1rem', color: theme.muted, fontSize: '0.875rem' }}>
                      {draft.category}
                    </td>
                    <td style={{ padding: '1rem', color: theme.muted, fontSize: '0.8rem', maxWidth: '300px' }}>
                      {draft.sensitivityReason || 'Editorial review required'}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        <label style={{
                          padding: '0.4rem 0.75rem',
                          backgroundColor: 'transparent',
                          color: theme.fg,
                          border: `1px solid ${theme.border}`,
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          display: 'inline-block'
                        }}>
                          {selectedImageFile[draft.id] ? selectedImageFile[draft.id]?.name.slice(0, 15) + '...' : 'Select Banner'}
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              setSelectedImageFile((prev) => ({ ...prev, [draft.id]: file }));
                            }}
                          />
                        </label>

                        {selectedImageFile[draft.id] && (
                          <button
                            type="button"
                            onClick={() => handleUploadImageAndPublish(draft.id)}
                            disabled={uploadingImage[draft.id]}
                            style={{ padding: '0.4rem 0.75rem', backgroundColor: theme.fg, color: theme.bg, border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                          >
                            {uploadingImage[draft.id] ? 'Uploading...' : 'Publish with Image'}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleApproveWithDefault(draft.id, draft.approvalToken)}
                          style={{ padding: '0.4rem 0.75rem', backgroundColor: 'transparent', color: theme.fg, border: `1px solid ${theme.border}`, borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                          Approve (Default Image)
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSendTestNewsletter(draft.id)}
                          style={{ padding: '0.4rem 0.75rem', backgroundColor: 'transparent', color: theme.muted, border: `1px solid ${theme.border}`, borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                          Test Email
                        </button>

                        <button
                          type="button"
                          onClick={() => handleHoldArticle(draft.id, draft.approvalToken)}
                          style={{ padding: '0.4rem 0.75rem', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                          Hold
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Search Engine Auto-Indexing & SEO Growth Hub */}
      <div style={{
        marginTop: '2rem',
        padding: '1.25rem 1.5rem',
        borderRadius: '6px',
        border: `1px solid ${theme.border}`,
        backgroundColor: 'rgba(255,255,255,0.02)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: theme.fg }}>
                Search Engine Auto-Indexing & Expert SEO Architecture
              </h4>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: theme.muted }}>
              Every published blog is automatically pushed to Bing, Yandex, Seznam via IndexNow API, pinged to Google Sitemaps, and equipped with Schema.org TechArticle, Breadcrumbs &amp; FAQPage rich snippets.
            </p>
          </div>

          <button
            type="button"
            onClick={handleReindexAll}
            disabled={indexingInProgress}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              border: `1px solid ${theme.border}`,
              color: theme.fg,
              borderRadius: '4px',
              fontSize: '0.8rem',
              fontWeight: 500,
              cursor: indexingInProgress ? 'wait' : 'pointer'
            }}
          >
            {indexingInProgress ? 'Submitting to Engines...' : 'Submit All Blogs to IndexNow'}
          </button>
        </div>

        {indexingStatus && (
          <div style={{
            fontSize: '0.8rem',
            padding: '0.5rem 0.75rem',
            borderRadius: '4px',
            backgroundColor: indexingStatus.startsWith('Error') ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
            color: indexingStatus.startsWith('Error') ? '#ef4444' : '#10b981',
            border: `1px solid ${indexingStatus.startsWith('Error') ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}`
          }}>
            {indexingStatus}
          </div>
        )}
      </div>

    </div>
  );
}
