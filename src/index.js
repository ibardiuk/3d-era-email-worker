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

      // Prepare email payload for Resend
      const emailPayload = {
        from: env.FROM_EMAIL,
        to: [env.TO_EMAIL],
        subject: `🎯 New 3D Printing Quote Request from ${firstName} ${lastName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>3D Printing Quote Request</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa; line-height: 1.6;">
            <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); overflow: hidden;">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 10px;">🎯</div>
                <h1 style="margin: 0; font-size: 28px; font-weight: 700;">New 3D Printing Quote Request</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">A new customer is ready to bring their idea to life!</p>
              </div>
              
              <!-- Customer Information -->
              <div style="padding: 30px;">
                <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                  <h2 style="margin: 0 0 15px 0; color: #1e293b; font-size: 20px; display: flex; align-items: center;">
                    <span style="background-color: #3b82f6; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 14px;">👤</span>
                    Customer Information
                  </h2>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div>
                      <div style="color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">Full Name</div>
                      <div style="color: #1e293b; font-size: 16px; font-weight: 600;">${firstName} ${lastName}</div>
                    </div>
                    <div>
                      <div style="color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">Phone</div>
                      <div style="color: #1e293b; font-size: 16px; font-weight: 600;">${phone}</div>
                    </div>
                  </div>
                  <div style="margin-top: 15px;">
                    <div style="color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">Email Address</div>
                    <div style="color: #1e293b; font-size: 16px; font-weight: 600;">
                      <a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a>
                    </div>
                  </div>
                </div>
                
                <!-- Printing Requirements -->
                <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                  <h2 style="margin: 0 0 15px 0; color: #1e293b; font-size: 20px; display: flex; align-items: center;">
                    <span style="background-color: #22c55e; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 14px;">🎛️</span>
                    Printing Specifications
                  </h2>
                  <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
                    <div style="text-align: center; background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                      <div style="color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: 600; margin-bottom: 8px;">Material</div>
                      <div style="color: #1e293b; font-size: 16px; font-weight: 700;">${materialType}</div>
                    </div>
                    <div style="text-align: center; background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                      <div style="color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: 600; margin-bottom: 8px;">Accuracy</div>
                      <div style="color: #1e293b; font-size: 16px; font-weight: 700;">${printingAccuracy}</div>
                    </div>
                    <div style="text-align: center; background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                      <div style="color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: 600; margin-bottom: 8px;">Color</div>
                      <div style="color: #1e293b; font-size: 16px; font-weight: 700;">${materialColor}</div>
                    </div>
                  </div>
                </div>
                
                ${comment ? `
                <!-- Additional Comments -->
                <div style="background-color: #fefbf3; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                  <h2 style="margin: 0 0 15px 0; color: #1e293b; font-size: 20px; display: flex; align-items: center;">
                    <span style="background-color: #f59e0b; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 14px;">💭</span>
                    Additional Comments
                  </h2>
                  <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; font-style: italic; color: #374151;">
                    "${comment.replace(/\n/g, '<br>')}"
                  </div>
                </div>
                ` : ''}
                
                ${attachment && attachment.size > 0 ? `
                <!-- File Attachment -->
                <div style="background-color: #f3f4f6; border-left: 4px solid #6b7280; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                  <h2 style="margin: 0 0 10px 0; color: #1e293b; font-size: 18px; display: flex; align-items: center;">
                    <span style="background-color: #6b7280; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 14px;">📎</span>
                    File Attachment Included
                  </h2>
                  <div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; display: flex; align-items: center;">
                    <span style="margin-right: 8px; font-size: 20px;">📄</span>
                    <span style="color: #374151; font-weight: 500;">${attachment.name}</span>
                    <span style="margin-left: auto; color: #6b7280; font-size: 14px;">${(attachment.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>
                ` : ''}
                
                <!-- Action Section -->
                <div style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 8px; margin: 25px 0;">
                  <h3 style="margin: 0 0 15px 0; font-size: 18px;">Ready to provide a quote?</h3>
                  <a href="mailto:${email}?subject=Re: 3D Printing Quote Request" 
                     style="display: inline-block; background: white; color: #667eea; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px;">
                    Reply to Customer
                  </a>
                </div>
              </div>
              
              <!-- Footer -->
              <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0; color: #64748b; font-size: 14px;">
                  📅 Received on ${new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                <p style="margin: 5px 0 0 0; color: #94a3b8; font-size: 12px;">
                  This quote request was submitted via your website contact form.
                </p>
              </div>
            </div>
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