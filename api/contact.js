import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { firstName, lastName, email, phone, service, eventDate, budget, message } = req.body;

    const { data, error } = await resend.emails.send({
      from: 'Perspective Visuals <hello@mails.perspectivevisuals.co.za>',
      to: ['YOUR_GMAIL@gmail.com'],
      reply_to: email,
      subject: `New Website Enquiry from ${firstName} ${lastName}`,
      html: `
        <h2>New Contact Enquiry</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Service Required:</strong> ${service || 'Not provided'}</p>
        <p><strong>Event Date:</strong> ${eventDate || 'Not provided'}</p>
        <p><strong>Budget Range:</strong> ${budget || 'Not provided'}</p>
        <p><strong>Message:</strong><br/>${message ? message.replace(/\n/g, '<br/>') : 'No message provided'}</p>
      `
    });

    if (error) {
      return res.status(400).json(error);
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
