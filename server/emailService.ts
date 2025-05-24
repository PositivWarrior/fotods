import nodemailer from 'nodemailer';

const emailHost = process.env.EMAIL_HOST;
const emailPort = process.env.EMAIL_PORT;
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const emailFrom =
	process.env.EMAIL_FROM || '"FotoDS Contact Form" <noreply@example.com>';
const emailTo = 'info@fotods.no'; // Your desired recipient address

if (!emailHost || !emailPort || !emailUser || !emailPass) {
	console.warn(
		'Email service is not fully configured. Missing EMAIL_HOST, EMAIL_PORT, EMAIL_USER, or EMAIL_PASS in .env file. Emails will not be sent.',
	);
}

// Create a transporter object using SMTP transport
// Ensure your environment variables are set for this to work.
const transporter = nodemailer.createTransport({
	host: emailHost,
	port: parseInt(emailPort || '587', 10),
	secure: parseInt(emailPort || '587', 10) === 465, // true for 465, false for other ports
	auth: {
		user: emailUser,
		pass: emailPass,
	},
	// If you are using a self-signed certificate or encounter TLS issues with your provider,
	// you might need to add this. However, it's generally not recommended for production.
	// tls: {
	//   rejectUnauthorized: false
	// }
});

interface ContactMessagePayload {
	name: string;
	email: string;
	phone?: string | null;
	service?: string | null;
	message: string;
}

export async function sendContactEmail(payload: ContactMessagePayload) {
	if (!emailHost || !emailPort || !emailUser || !emailPass) {
		console.error(
			'Email service not configured. Cannot send contact email.',
		);
		return; // Or throw an error, depending on desired behavior
	}

	const subject = `New Contact Form Submission from ${payload.name}`;
	const textBody = `
    You have received a new contact form submission:

    Name: ${payload.name}
    Email: ${payload.email}
    Phone: ${payload.phone || 'Not provided'}
    Service/Interest: ${payload.service || 'Not specified'}
    Message:
    ${payload.message}
  `;
	const htmlBody = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${payload.name}</p>
    <p><strong>Email:</strong> <a href="mailto:${payload.email}">${
		payload.email
	}</a></p>
    <p><strong>Phone:</strong> ${payload.phone || 'Not provided'}</p>
    <p><strong>Service/Interest:</strong> ${
		payload.service || 'Not specified'
	}</p>
    <p><strong>Message:</strong></p>
    <pre>${payload.message}</pre>
  `;

	const mailOptions = {
		from: emailFrom,
		to: emailTo,
		subject: subject,
		text: textBody,
		html: htmlBody,
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log('Contact email sent successfully: %s', info.messageId);
	} catch (error) {
		console.error('Error sending contact email:', error);
		// Depending on your error handling strategy, you might want to re-throw the error
		// or handle it silently if the main goal (DB save) was achieved.
	}
}
