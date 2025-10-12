export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      // Parse the multipart form data
      const formData = await request.formData();
      
      // Extract form fields
      const firstName = formData.get('firstName');
      const lastName = formData.get('lastName');
      const phone = formData.get('phone');
      const email = formData.get('email');
      const materialType = formData.get('materialType');
      const printingAccuracy = formData.get('printingAccuracy');
      const materialColor = formData.get('materialColor');
      const comment = formData.get('comment');
      const attachment = formData.get('attachment');

      // Validate required fields
      if (!firstName || !lastName || !phone || !email || !materialType || !printingAccuracy || !materialColor) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields. Please fill in all required fields marked with *' }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return new Response(
          JSON.stringify({ error: 'Please provide a valid email address' }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }

      // Generate timestamp
      const timestamp = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      // Prepare email payload for Resend
      const emailPayload = {
        from: env.FROM_EMAIL,
        to: [env.TO_EMAIL],
        subject: `🎯 New 3D Printing Quote Request from ${firstName} ${lastName}`,
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>3D Era Lab - Quote Request</title>
              <!--[if mso]>
              <noscript>
                  <xml>
                      <o:OfficeDocumentSettings>
                          <o:PixelsPerInch>96</o:PixelsPerInch>
                      </o:OfficeDocumentSettings>
                  </xml>
              </noscript>
              <![endif]-->
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background: linear-gradient(135deg, #0a0f1b 0%, #1a1f2e 100%); min-height: 100vh;">
              
              <!-- Email Wrapper -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #0a0f1b 0%, #1a1f2e 100%); min-height: 100vh; padding: 20px 0;">
                  <tr>
                      <td align="center" style="padding: 20px;">
                          
                          <!-- Main Container -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; width: 100%; background: #1a1f2e; border-radius: 12px; border: 1px solid rgba(0, 212, 255, 0.2); box-shadow: 0 0 30px rgba(0, 212, 255, 0.1), 0 20px 40px rgba(0, 0, 0, 0.3);">
                              
                              <!-- Header Section -->
                              <tr>
                                  <td style="padding: 0;">
                                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                          <tr>
                                              <td style="background: linear-gradient(135deg, #0a0f1b 0%, #2a2f3e 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0; border-bottom: 2px solid #00d4ff; position: relative;">
                                                  
                                                  <!-- Header Content -->
                                                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                      <tr>
                                                          <td align="center">
                                                              <!-- Logo/Icon -->
                                                              <div style="background: rgba(0, 212, 255, 0.15); width: 80px; height: 80px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px; border: 2px solid rgba(0, 212, 255, 0.3); box-shadow: 0 0 25px rgba(0, 212, 255, 0.2);">
                                                                  <span style="font-size: 36px; color: #00d4ff;">🎯</span>
                                                              </div>
                                                              
                                                              <!-- Company Title -->
                                                              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.8px; margin-bottom: 8px; text-shadow: 0 0 10px rgba(0, 212, 255, 0.3);">3D ERA LAB</h1>
                                                              <p style="margin: 0; color: #a8b2c3; font-size: 16px; font-weight: 500; letter-spacing: 0.5px;">Advanced 3D Printing Solutions</p>
                                                          </td>
                                                      </tr>
                                                  </table>
                                              </td>
                                          </tr>
                                      </table>
                                  </td>
                              </tr>

                              <!-- Title Bar -->
                              <tr>
                                  <td style="padding: 0;">
                                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                          <tr>
                                              <td style="background: #2a2f3e; padding: 25px 30px; border-bottom: 1px solid rgba(0, 212, 255, 0.2);">
                                                  <h2 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 600; text-align: center; letter-spacing: -0.5px;">New Quote Request</h2>
                                                  <div style="width: 60px; height: 3px; background: linear-gradient(90deg, #00d4ff, rgba(0, 212, 255, 0.3)); margin: 12px auto 0; border-radius: 2px; box-shadow: 0 0 8px rgba(0, 212, 255, 0.4);"></div>
                                              </td>
                                          </tr>
                                      </table>
                                  </td>
                              </tr>

                              <!-- Main Content -->
                              <tr>
                                  <td style="padding: 35px 30px;">
                                      
                                      <!-- Customer Information -->
                                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 35px;">
                                          <tr>
                                              <td style="background: #0a0f1b; border-radius: 10px; padding: 28px; border: 1px solid rgba(0, 212, 255, 0.2); box-shadow: 0 0 20px rgba(0, 212, 255, 0.08);">
                                                  
                                                  <!-- Section Header -->
                                                  <h3 style="margin: 0 0 20px 0; color: #00d4ff; font-size: 20px; font-weight: 600; display: flex; align-items: center; padding-bottom: 15px; border-bottom: 1px solid rgba(0, 212, 255, 0.3);">
                                                      <span style="margin-right: 12px; font-size: 22px;">👤</span>Customer Information
                                                  </h3>
                                                  
                                                  <!-- Customer Data Rows -->
                                                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                      <tr>
                                                          <td style="padding: 14px 0; border-bottom: 1px solid #2a2f3e;">
                                                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                                  <tr>
                                                                      <td style="color: #6b7280; font-size: 14px; font-weight: 600; width: 35%; text-transform: uppercase; letter-spacing: 0.5px;">Full Name</td>
                                                                      <td style="color: #ffffff; font-size: 16px; font-weight: 600; text-align: right;">${firstName} ${lastName}</td>
                                                                  </tr>
                                                              </table>
                                                          </td>
                                                      </tr>
                                                      <tr>
                                                          <td style="padding: 14px 0; border-bottom: 1px solid #2a2f3e;">
                                                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                                  <tr>
                                                                      <td style="color: #6b7280; font-size: 14px; font-weight: 600; width: 35%; text-transform: uppercase; letter-spacing: 0.5px;">Email</td>
                                                                      <td style="text-align: right;">
                                                                          <a href="mailto:${email}" style="color: #00d4ff; font-size: 16px; font-weight: 600; text-decoration: none; text-shadow: 0 0 5px rgba(0, 212, 255, 0.3);">${email}</a>
                                                                      </td>
                                                                  </tr>
                                                              </table>
                                                          </td>
                                                      </tr>
                                                      <tr>
                                                          <td style="padding: 14px 0;">
                                                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                                  <tr>
                                                                      <td style="color: #6b7280; font-size: 14px; font-weight: 600; width: 35%; text-transform: uppercase; letter-spacing: 0.5px;">Phone</td>
                                                                      <td style="color: #ffffff; font-size: 16px; font-weight: 600; text-align: right;">${phone}</td>
                                                                  </tr>
                                                              </table>
                                                          </td>
                                                      </tr>
                                                  </table>
                                              </td>
                                          </tr>
                                      </table>

                                      <!-- Printing Specifications -->
                                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 35px;">
                                          <tr>
                                              <td style="background: #0a0f1b; border-radius: 10px; padding: 28px; border: 1px solid rgba(0, 212, 255, 0.2); box-shadow: 0 0 20px rgba(0, 212, 255, 0.08);">
                                                  
                                                  <!-- Section Header -->
                                                  <h3 style="margin: 0 0 20px 0; color: #00d4ff; font-size: 20px; font-weight: 600; display: flex; align-items: center; padding-bottom: 15px; border-bottom: 1px solid rgba(0, 212, 255, 0.3);">
                                                      <span style="margin-right: 12px; font-size: 22px;">⚙️</span>Printing Specifications
                                                  </h3>
                                                  
                                                  <!-- Specs Grid -->
                                                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                      <tr>
                                                          <!-- Material Card -->
                                                          <td width="33%" style="padding-right: 12px;">
                                                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #1a1f2e; border-radius: 8px; padding: 22px 16px; text-align: center; border: 1px solid rgba(0, 212, 255, 0.2); position: relative;">
                                                                  <tr>
                                                                      <td>
                                                                          <!-- Top accent bar -->
                                                                          <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #00d4ff, rgba(0, 212, 255, 0.3)); border-radius: 8px 8px 0 0;"></div>
                                                                          <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Material</p>
                                                                          <p style="margin: 0; color: #ffffff; font-size: 17px; font-weight: 700;">${materialType}</p>
                                                                      </td>
                                                                  </tr>
                                                              </table>
                                                          </td>
                                                          
                                                          <!-- Accuracy Card -->
                                                          <td width="33%" style="padding: 0 6px;">
                                                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #1a1f2e; border-radius: 8px; padding: 22px 16px; text-align: center; border: 1px solid rgba(0, 212, 255, 0.2); position: relative;">
                                                                  <tr>
                                                                      <td>
                                                                          <!-- Top accent bar -->
                                                                          <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #00d4ff, rgba(0, 212, 255, 0.3)); border-radius: 8px 8px 0 0;"></div>
                                                                          <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Accuracy</p>
                                                                          <p style="margin: 0; color: #ffffff; font-size: 17px; font-weight: 700;">${printingAccuracy}</p>
                                                                      </td>
                                                                  </tr>
                                                              </table>
                                                          </td>
                                                          
                                                          <!-- Color Card -->
                                                          <td width="33%" style="padding-left: 12px;">
                                                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #1a1f2e; border-radius: 8px; padding: 22px 16px; text-align: center; border: 1px solid rgba(0, 212, 255, 0.2); position: relative;">
                                                                  <tr>
                                                                      <td>
                                                                          <!-- Top accent bar -->
                                                                          <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #00d4ff, rgba(0, 212, 255, 0.3)); border-radius: 8px 8px 0 0;"></div>
                                                                          <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Color</p>
                                                                          <p style="margin: 0; color: #ffffff; font-size: 17px; font-weight: 700;">${materialColor}</p>
                                                                      </td>
                                                                  </tr>
                                                              </table>
                                                          </td>
                                                      </tr>
                                                  </table>
                                              </td>
                                          </tr>
                                      </table>

                                      ${comment ? `
                                      <!-- Project Requirements -->
                                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 35px;">
                                          <tr>
                                              <td style="background: #0a0f1b; border-radius: 10px; padding: 28px; border: 1px solid rgba(0, 212, 255, 0.2); box-shadow: 0 0 20px rgba(0, 212, 255, 0.08);">
                                                  
                                                  <!-- Section Header -->
                                                  <h3 style="margin: 0 0 20px 0; color: #00d4ff; font-size: 20px; font-weight: 600; display: flex; align-items: center; padding-bottom: 15px; border-bottom: 1px solid rgba(0, 212, 255, 0.3);">
                                                      <span style="margin-right: 12px; font-size: 22px;">💭</span>Project Requirements
                                                  </h3>
                                                  
                                                  <!-- Comment Content -->
                                                  <div style="background: #1a1f2e; border-left: 4px solid #00d4ff; border-radius: 8px; padding: 22px; border: 1px solid rgba(0, 212, 255, 0.2); box-shadow: 0 0 15px rgba(0, 212, 255, 0.1);">
                                                      <p style="margin: 0; color: #a8b2c3; font-size: 16px; line-height: 1.7; font-style: italic;">"${comment.replace(/\n/g, '<br>')}"</p>
                                                  </div>
                                              </td>
                                          </tr>
                                      </table>
                                      ` : ''}

                                      ${attachment && attachment.size > 0 ? `
                                      <!-- File Attachments -->
                                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 35px;">
                                          <tr>
                                              <td style="background: #0a0f1b; border-radius: 10px; padding: 28px; border: 1px solid rgba(0, 212, 255, 0.2); box-shadow: 0 0 20px rgba(0, 212, 255, 0.08);">
                                                  
                                                  <!-- Section Header -->
                                                  <h3 style="margin: 0 0 20px 0; color: #00d4ff; font-size: 20px; font-weight: 600; display: flex; align-items: center; padding-bottom: 15px; border-bottom: 1px solid rgba(0, 212, 255, 0.3);">
                                                      <span style="margin-right: 12px; font-size: 22px;">📎</span>Attached Files
                                                  </h3>
                                                  
                                                  <!-- File Item -->
                                                  <div style="background: #1a1f2e; border-radius: 8px; padding: 20px; border: 1px solid rgba(0, 212, 255, 0.2); display: flex; align-items: center;">
                                                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                          <tr>
                                                              <td width="60" style="padding-right: 16px;">
                                                                  <div style="background: linear-gradient(135deg, #00d4ff, #0099cc); color: #0a0f1b; width: 50px; height: 50px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 700; box-shadow: 0 0 20px rgba(0, 212, 255, 0.4);">📄</div>
                                                              </td>
                                                              <td>
                                                                  <p style="margin: 0 0 6px 0; color: #ffffff; font-size: 17px; font-weight: 600;">${attachment.name}</p>
                                                                  <p style="margin: 0; color: #6b7280; font-size: 13px; font-weight: 500;">${(attachment.size / 1024 / 1024).toFixed(2)} MB • ${attachment.type || 'File'} • Uploaded just now</p>
                                                              </td>
                                                          </tr>
                                                      </table>
                                                  </div>
                                              </td>
                                          </tr>
                                      </table>
                                      ` : ''}

                                  </td>
                              </tr>

                              <!-- Footer -->
                              <tr>
                                  <td style="background: #0a0f1b; padding: 30px; text-align: center; border-radius: 0 0 12px 12px; border-top: 2px solid #00d4ff;">
                                      <p style="margin: 0 0 12px 0; color: #a8b2c3; font-size: 15px; line-height: 1.6;">
                                          Received on <span style="color: #00d4ff; font-weight: 600;">${timestamp}</span>
                                      </p>
                                      <p style="margin: 0; color: #6b7280; font-size: 12px; line-height: 1.5; letter-spacing: 0.3px;">
                                          This quote request was generated by your 3D Era Lab email system.<br>
                                          © 2024 3D Era Lab • Advanced 3D Printing Solutions
                                      </p>
                                  </td>
                              </tr>

                          </table>
                      </td>
                  </tr>
              </table>
          </body>
          </html>
        `,
        reply_to: email,
      };

      // Handle file attachment if present
      if (attachment && attachment.size > 0) {
        // Check file size limit (10MB for Cloudflare Workers)
        if (attachment.size > 10 * 1024 * 1024) {
          return new Response(
            JSON.stringify({ error: 'File too large. Maximum size is 10MB.' }),
            {
              status: 400,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
            }
          );
        }

        const attachmentBuffer = await attachment.arrayBuffer();
        
        // Convert to base64 more efficiently for large files
        const uint8Array = new Uint8Array(attachmentBuffer);
        let binaryString = '';
        const chunkSize = 8192; // Process in chunks to avoid stack overflow
        
        for (let i = 0; i < uint8Array.length; i += chunkSize) {
          const chunk = uint8Array.slice(i, i + chunkSize);
          binaryString += String.fromCharCode.apply(null, chunk);
        }
        
        const attachmentBase64 = btoa(binaryString);

        emailPayload.attachments = [
          {
            filename: attachment.name,
            content: attachmentBase64,
            content_type: attachment.type || 'application/octet-stream',
          },
        ];
      }

      // Send email via Resend API
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailPayload),
      });

      if (!resendResponse.ok) {
        const errorData = await resendResponse.json();
        console.error('Resend API error:', errorData);
        throw new Error(`Failed to send email: ${errorData.message || 'Unknown error'}`);
      }

      const result = await resendResponse.json();

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Email sent successfully',
          id: result.id 
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );

    } catch (error) {
      console.error('Error processing request:', error);
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send email', 
          message: error.message 
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
  },
};