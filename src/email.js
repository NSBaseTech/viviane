const nodemailer = require("nodemailer")
const { getMaxListeners } = require("nodemailer/lib/xoauth2")

function createTransport() {
    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSW,
        }
    })
}

async function enviarEmail(to, subject, html) {
    await createTransport().sendMail({
        from: process.env.NODEMAILER_EMAIL,
        to,
        subject,
        html,
    })
}

module.exports = {enviarEmail}