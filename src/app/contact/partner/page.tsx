"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { IndustriesSection } from '@/components/IndustriesSection';

export default function PartnerPage() {
  const router = useRouter();

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
              src="https://res.cloudinary.com/murfclni/image/upload/v1783710540/zawr/https://res.cloudinary.com/murfclni/image/upload/v1783710540/zawr/assets/partnership-hero.png" 
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
          <div className="model-row-interactive" onClick={() => router.push('/contact/partner/technology-partner')}>
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
          <div className="model-row-interactive" onClick={() => router.push('/contact/partner/strategic-alliance')}>
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
          <div className="model-row-interactive" onClick={() => router.push('/contact/partner/channel-partner')}>
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
          <div className="model-row-interactive" onClick={() => router.push('/contact/partner/startup-partner')}>
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
          <div className="model-row-interactive" onClick={() => router.push('/contact/partner/industry-partner')}>
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
          <div className="model-row-interactive" onClick={() => router.push('/contact/partner/research-partner')}>
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

          {/* Row 7: Content Creator & Influencer Partnerships */}
          <div className="model-row-interactive" onClick={() => router.push('/contact/partner/creator-partner')}>
            <div className="model-left-int">
              <h3>Content Creator &amp; Influencer Partnerships</h3>
              <p>Partner with us as a creator to review products, run campaigns, and share tech insights.</p>
            </div>
            <div className="model-meta-box-int" style={{ gridColumn: 'span 2' }}>
              <h4>Areas of Collaboration</h4>
              <ul className="model-meta-list-int" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                <li>Brand Ambassador Programs</li>
                <li>Affiliate Partnerships</li>
                <li>Campaign Partnerships</li>
                <li>Educational Partnerships</li>
                <li>Co-creation Programs</li>
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

    </div>
  );
}
