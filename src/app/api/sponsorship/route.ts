import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // Extracted Fields Map
    const fields: { [key: string]: string } = {};
    const attachments: any[] = [];
    
    // Iterate over FormData
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        if (value.size > 0 && value.name !== 'undefined') {
          const arrayBuffer = await value.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          attachments.push({
            filename: value.name,
            content: buffer,
            contentType: value.type,
          });
        }
      } else {
        fields[key] = value.toString();
      }
    }

    // Required check
    if (!fields.companyName || !fields.fullName || !fields.email) {
      return NextResponse.json({ error: 'Missing core mandatory fields' }, { status: 400 });
    }

    // Setup Nodemailer transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Formatting Deliverables (JSON parsed)
    let deliverablesText = 'None selected';
    if (fields.deliverables) {
      try {
        const delArr = JSON.parse(fields.deliverables);
        if (Array.isArray(delArr) && delArr.length > 0) {
          deliverablesText = delArr.join(', ');
        }
      } catch (e) {
        deliverablesText = fields.deliverables;
      }
    }

    const marketingMailOptions = {
      from: process.env.GMAIL_FROM || `"Zawr Sponsorship" <${process.env.GMAIL_USER}>`,
      replyTo: fields.email || 'marketing@zawrindustries.com',
      to: 'marketing@zawrindustries.com', 
      subject: `New Sponsorship Request from ${fields.companyName} - ${fields.sponsorshipType}`,
      text: `
A new Sponsorship Request has been submitted!

--- 1. Company Information ---
Company Name: ${fields.companyName}
Parent Company: ${fields.parentCompany || 'N/A'}
Industry: ${fields.industry || 'N/A'}
Website: ${fields.website || 'N/A'}
Registration / GSTIN: ${fields.registrationNumber || 'N/A'}
Company Size: ${fields.companySize || 'N/A'}
Headquarters: ${fields.headquarters || 'N/A'}
Social Links: ${fields.socialLinks || 'N/A'}

--- 2. Contact Person Details ---
Full Name: ${fields.fullName}
Designation: ${fields.designation || 'N/A'}
Email: ${fields.email}
Mobile: ${fields.mobile || 'N/A'}
LinkedIn: ${fields.linkedin || 'N/A'}
Alternate Contact: ${fields.alternateContact || 'N/A'}

--- 3. Sponsorship Interest ---
Sponsorship Type: ${fields.sponsorshipType}
Event/Campaign: ${fields.eventInterestedIn || 'N/A'}
Objective: ${fields.objective}

--- 4. Budget & Commercials ---
Budget Range: ${fields.budgetRange || 'N/A'}
Currency: ${fields.currency}
Expected ROI: ${fields.expectedROI || 'N/A'}
Payment Terms: ${fields.paymentTerms || 'N/A'}
Invoice Details: ${fields.invoiceDetails || 'N/A'}

--- 5. Branding Requirements ---
Preferred Colors: ${fields.preferredColors || 'N/A'}
Tagline: ${fields.tagline || 'N/A'}
Mandatory Messaging: ${fields.mandatoryMessaging || 'N/A'}
Creative Restrictions: ${fields.creativeRestrictions || 'N/A'}

--- 6. Deliverables Required ---
${deliverablesText}

--- 7. Audience & Campaign Fit ---
Target Audience: ${fields.targetAudience || 'N/A'}
Geography: ${fields.geography || 'N/A'}
Industry Focus: ${fields.industryFocus || 'N/A'}
Expected Reach/KPIs: ${fields.kpis || 'N/A'}

--- 8. Legal & Compliance ---
Terms Acceptance: ${fields.termsAcceptance === 'true' ? 'Yes' : 'No'}
Data Processing Consent: ${fields.dataProcessingConsent === 'true' ? 'Yes' : 'No'}
Trademark Usage Approval: ${fields.trademarkUsageApproval === 'true' ? 'Yes' : 'No'}
Content Approval Agreement: ${fields.contentApprovalAgreement === 'true' ? 'Yes' : 'No'}
Anti-Bribery Declaration: ${fields.antiBriberyDeclaration === 'true' ? 'Yes' : 'No'}
Cancellation Policy Acceptance: ${fields.cancellationPolicyAcceptance === 'true' ? 'Yes' : 'No'}

---------------------------------------
Total Uploaded Documents: ${attachments.length} attached to this email.
      `,
      attachments: attachments
    };

    // Send the email
    await transporter.sendMail(marketingMailOptions);

    return NextResponse.json({ message: 'Sponsorship request submitted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error submitting sponsorship request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
