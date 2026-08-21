import nodemailer from 'nodemailer';

const isMailConfigured =
  process.env.EMAIL_HOST &&
  process.env.EMAIL_HOST !== 'placeholder' &&
  process.env.EMAIL_USER &&
  process.env.EMAIL_USER !== 'placeholder';

const transporter = isMailConfigured
  ? nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: parseInt(process.env.EMAIL_PORT) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      connectionTimeout: 5000, // 5 seconds connection timeout
      greetingTimeout: 5000,   // 5 seconds greeting timeout
      socketTimeout: 5000,     // 5 seconds socket inactivity timeout
      tls: {
        rejectUnauthorized: false, // Prevents TLS verification hangs on serverless/cloud environments
      },
    })
  : null;

export async function sendEnquiryEmail(enquiry, settings) {
  const recipient = settings?.emailSettings?.businessEnquiryEmail || process.env.ENQUIRY_EMAIL;
  if (!recipient) {
    console.warn('No recipient email configured. Skipping email dispatch.');
    return;
  }

  const subject = settings?.emailSettings?.emailSubject || 'New Website Enquiry - Elisa Decor';
  const sender = `"${settings?.emailSettings?.senderName || 'Elisa Decor Website'}" <${process.env.EMAIL_FROM || 'noreply@elisadecor.com'}>`;
  const replyTo = settings?.emailSettings?.replyTo || enquiry.email;
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e9e1d5; border-radius: 8px; background-color: #f5f1ea;">
      <h2 style="color: #17211f; border-bottom: 2px solid #c77b3c; padding-bottom: 10px; font-family: serif;">ELISA DECOR</h2>
      <p style="color: #242424; font-size: 16px; font-weight: bold;">New Website Enquiry Received</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <tr style="background-color: #e9e1d5;">
          <td style="padding: 8px; font-weight: bold; width: 35%; color: #17211f;">Customer Name</td>
          <td style="padding: 8px; color: #242424;">${enquiry.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; color: #17211f;">Phone Number</td>
          <td style="padding: 8px; color: #242424;">${enquiry.phone}</td>
        </tr>
        <tr style="background-color: #e9e1d5;">
          <td style="padding: 8px; font-weight: bold; color: #17211f;">Email Address</td>
          <td style="padding: 8px; color: #242424;">${enquiry.email}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; color: #17211f;">Location</td>
          <td style="padding: 8px; color: #242424;">${enquiry.city ? `${enquiry.city}, ${enquiry.state || ''}` : '—'}</td>
        </tr>
        <tr style="background-color: #e9e1d5;">
          <td style="padding: 8px; font-weight: bold; color: #17211f;">Organization</td>
          <td style="padding: 8px; color: #242424;">${enquiry.company || '—'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; color: #17211f;">Product Target</td>
          <td style="padding: 8px; font-weight: bold; color: #c77b3c;">${enquiry.productNameSnapshot || 'General Enquiry'}</td>
        </tr>
        <tr style="background-color: #e9e1d5;">
          <td style="padding: 8px; font-weight: bold; color: #17211f;">Source Page</td>
          <td style="padding: 8px; font-size: 11px; font-family: monospace; color: #242424; word-break: break-all;">${enquiry.sourcePage || '—'}</td>
        </tr>
      </table>

      <div style="margin-top: 20px; padding: 15px; background-color: #ffffff; border-left: 4px solid #c77b3c; border-radius: 4px;">
        <p style="margin: 0; font-weight: bold; font-size: 12px; color: #17211f; text-transform: uppercase;">Customer Message / Requirement</p>
        <p style="margin: 8px 0 0 0; color: #242424; font-size: 14px; line-height: 1.5; white-space: pre-wrap;">${enquiry.message || 'No message provided.'}</p>
      </div>

      <div style="margin-top: 25px; text-align: center; border-top: 1px solid #e9e1d5; padding-top: 15px;">
        <a href="${clientUrl}/admin/enquiries" style="display: inline-block; padding: 10px 20px; background-color: #213a35; color: #f5f1ea; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 14px;">Open in Admin CMS</a>
      </div>
    </div>
  `;

  if (!transporter) {
    console.log('--- MOCK ENQUIRY EMAIL DISPATCH (SMTP NOT CONFIGURED) ---');
    console.log(`From: ${sender}`);
    console.log(`To: ${recipient}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n${htmlContent.replace(/<[^>]*>/g, '')}`);
    console.log('---------------------------------------------------------');
    return;
  }

  await transporter.sendMail({
    from: sender,
    to: recipient,
    replyTo: replyTo,
    subject: subject,
    html: htmlContent,
  });
}

export async function sendCustomerConfirmation(enquiry, settings) {
  if (!settings?.emailSettings?.customerConfirmationOn) return;

  const sender = `"${settings.brandName || 'Elisa Decor'}" <${process.env.EMAIL_FROM || 'noreply@elisadecor.com'}>`;
  const subject = `Enquiry Received - ${settings.brandName || 'Elisa Decor'}`;

  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e9e1d5; border-radius: 8px; background-color: #f5f1ea; color: #242424;">
      <h2 style="color: #17211f; border-bottom: 2px solid #c77b3c; padding-bottom: 10px; font-family: serif;">${settings.brandName || 'Elisa Decor'}</h2>
      
      <p style="font-size: 15px; line-height: 1.5;">Dear ${enquiry.name},</p>
      <p style="font-size: 15px; line-height: 1.5;">Thank you for contacting ${settings.brandName || 'Elisa Decor'}. We have received your product enquiry for <strong>${enquiry.productNameSnapshot || 'our architectural range'}</strong>.</p>
      <p style="font-size: 15px; line-height: 1.5;">Our technical support team is reviewing your requirement and will get back to you with custom catalog sheets and coordinates shortly.</p>
      
      <div style="margin: 20px 0; padding: 15px; background-color: #ffffff; border-radius: 4px; border: 1px solid #e9e1d5; font-size: 14px;">
        <p style="margin: 0 0 5px 0; font-weight: bold; color: #17211f;">Copy of your message:</p>
        <p style="margin: 0; color: #555555; white-space: pre-wrap;">${enquiry.message || '—'}</p>
      </div>

      <p style="font-size: 14px; color: #777777; border-top: 1px solid #e9e1d5; padding-top: 15px;">
        Best Regards,<br />
        <strong>Corporate Sales Team</strong><br />
        ${settings.brandName || 'Elisa Decor'}<br />
        ${settings.address || ''}<br />
        Phone: ${settings.phone || ''}
      </p>
    </div>
  `;

  if (!transporter) {
    console.log('--- MOCK CUSTOMER CONFIRMATION EMAIL (SMTP NOT CONFIGURED) ---');
    console.log(`From: ${sender}`);
    console.log(`To: ${enquiry.email}`);
    console.log(`Subject: ${subject}`);
    console.log('--------------------------------------------------------------');
    return;
  }

  await transporter.sendMail({
    from: sender,
    to: enquiry.email,
    subject: subject,
    html: htmlContent,
  });
}

export async function sendOTPEmail(email, otp, type) {
  let title = 'Verification Request';
  let messageText = 'You have requested a security change in the admin control panel.';
  let typeLabel = 'Change Verification';

  if (type === 'PASSWORD_CHANGE') {
    title = 'Verify Password Change';
    messageText = 'Use the OTP below to confirm changing your account password. If you did not initiate this request, please change your login credentials immediately.';
    typeLabel = 'Password Change';
  } else if (type === 'EMAIL_CHANGE_OLD') {
    title = 'Confirm Email Update (Current Email)';
    messageText = 'Use the OTP below to authorize changing the primary email address for your administrative account. This code is sent to your current email.';
    typeLabel = 'Current Email Verification';
  } else if (type === 'EMAIL_CHANGE_NEW') {
    title = 'Verify Ownership (New Email)';
    messageText = 'Use the OTP below to confirm ownership and verify this address as the new primary email for your administrative account.';
    typeLabel = 'New Email Ownership Verification';
  }

  const sender = `"Elisa Decor Security" <${process.env.EMAIL_FROM || 'noreply@elisadecor.com'}>`;
  const subject = `[Security Alert] OTP for ${typeLabel} - Elisa Decor`;

  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e9e1d5; border-radius: 8px; background-color: #f5f1ea; color: #242424;">
      <h2 style="color: #213a35; border-bottom: 2px solid #c77b3c; padding-bottom: 10px; font-family: serif; margin-top: 0;">ELISA DECOR SECURITY</h2>
      
      <p style="font-size: 16px; font-weight: bold; color: #17211f; margin-top: 15px;">${title}</p>
      <p style="font-size: 14px; line-height: 1.5; color: #555555;">${messageText}</p>
      
      <div style="margin: 25px 0; padding: 20px; background-color: #ffffff; border-radius: 6px; border: 1px solid #e9e1d5; text-align: center;">
        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #777777; display: block; margin-bottom: 8px;">One-Time Verification Code</span>
        <span style="font-family: monospace; font-size: 36px; font-weight: bold; letter-spacing: 6px; color: #c77b3c;">${otp}</span>
        <span style="font-size: 10px; color: #999999; display: block; margin-top: 8px;">This code is valid for 15 minutes. Do not share this OTP with anyone.</span>
      </div>
      
      <p style="font-size: 12px; color: #777777; border-top: 1px solid #e9e1d5; padding-top: 15px; margin-bottom: 0;">
        This email was auto-generated by the Elisa Decor administrative system. If you did not make this request, please contact technical support.
      </p>
    </div>
  `;

  if (!transporter) {
    console.log('---------------------------------------------------------');
    console.log('--- MOCK SECURITY OTP EMAIL (SMTP NOT CONFIGURED) ---');
    console.log(`From: ${sender}`);
    console.log(`To: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`OTP Code: [ ${otp} ] for type: [ ${type} ]`);
    console.log('---------------------------------------------------------');
    return;
  }

  await transporter.sendMail({
    from: sender,
    to: email,
    subject: subject,
    html: htmlContent,
  });
}

export { isMailConfigured };
