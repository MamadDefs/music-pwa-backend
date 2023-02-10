const nodeMailer = require('nodemailer');

exports.sendMail = async (options) => {
    const transporter = nodeMailer.createTransport({
        host: 'smtp.liara.ir',
        port: 587,
        auth: {
            user: 'QUzgeuYIyPCOySdI',
            pass: 'ca7dcd81-85c7-4b1e-9d17-0f1e04b8ea5c'
        }
    });

    const mailOptions = {
        from: 'Music PWA <verify@mail.music-pwa.ir>',
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    await transporter.sendMail(mailOptions);
}
