const nodeMailer = require('nodemailer');

exports.sendMail = async (options) => {
    const transporter = nodeMailer.createTransport({
        host: 'smtp.mailtrap.io',
        port: 2525,
        auth: {
            user: 'e19b19fc4c39d0',
            pass: '0b9c76872d6868'
        }
    });

    const mailOptions = {
        from: 'ourUntitledProject <security@ouruntitledproject.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    await transporter.sendMail(mailOptions);
}