import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendVerificationEmail = async (to, token) => {
    try {
        const verificationLink = `http://localhost:5001/api/auth/verify-email?token=${token}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject: 'Verify Your Email',
            html: `<p>Click <a href="${verificationLink}">Here</a> to verify your email.</p>`
        };

        await transporter.sendMail(mailOptions);
        console.log("Verification email sent!");
    } catch (error) {
        console.error("Error sending email:", error);
    }
};