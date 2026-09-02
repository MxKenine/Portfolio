import nodemailer from 'nodemailer';

export default async function sendConfirmationEmail(destinataire, url) {
    //Configuration du transporteur, on utilise le mot de passe d'application
    const transporteur = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GUSER,
            pass: process.env.GPASS,
        }
    })
    //Définition du contenu et des options de l'email
    const mailOption = {
        from: process.env.GUSER,
        to: destinataire,
        subject: 'Confirmez votre email',
        html: `<p>Cliquez <a href="${url}">ici</a> pour confirmer votre email.`
    }
    //Envoi du mail
    try {
        await transporteur.sendMail(mailOption)
        console.log('email evoyé')
    } catch (err) {
        console.log("Erreur lors de l'envoi du mail", err)
    }
}