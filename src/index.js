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
        subject: `New 3D Printing Quote Request from ${firstName} ${lastName}`,
        html: `
          <h2>New 3D Printing Quote Request</h2>
          
          <h3>Customer Information</h3>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email}</p>
          
          <h3>Printing Requirements</h3>
          <p><strong>Material Type:</strong> ${materialType}</p>
          <p><strong>Printing Accuracy:</strong> ${printingAccuracy}</p>
          <p><strong>Material Color:</strong> ${materialColor}</p>
          
          ${comment ? `
          <h3>Additional Comments</h3>
          <p>${comment.replace(/\n/g, '<br>')}</p>
          ` : ''}
          
          ${attachment && attachment.size > 0 ? '<p><strong>File attachment included</strong></p>' : ''}
          
          <hr>
          <p><em>This quote request was submitted via your website contact form.</em></p>
        `,
        reply_to: email,
      };

      // Handle file attachment if present
      if (attachment && attachment.size > 0) {
        const attachmentBuffer = await attachment.arrayBuffer();
        const attachmentBase64 = btoa(
          String.fromCharCode(...new Uint8Array(attachmentBuffer))
        );

        emailPayload.attachments = [
          {
            filename: attachment.name,
            content: attachmentBase64,
            content_type: attachment.type,
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