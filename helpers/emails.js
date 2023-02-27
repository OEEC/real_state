import nodemailer from 'nodemailer'

const registerEmail = async (data) => {
    console.log("🚀 ~ file: emails.js:4 ~ registerEmail ~ data:", data)
    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });

      const { name, email, token } = data;
      console.log("🚀 ~ file: emails.js:15 ~ registerEmail ~ transport:", transport)
      await transport.sendMail({
        from: 'RealState.com',
        to: email,
        subject: "Confirm your RealState.com account",
        text: "Confirm your RealState.com account",
        html: `
            <p>Hello ${name}, we need you to confirm your account from RealState.com </p>

            <p> You cant confirm you account in the next link:
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmEmail/${token}">Confirm Account</a></p>

            <p>If you don't create this account you can ignore this message</p>
        `
      })

}

export {
    registerEmail
}