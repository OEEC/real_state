import nodemailer from 'nodemailer'

const registerEmail = async (data) => {
    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });

      const { name, email, token } = data;
      await transport.sendMail({
        from: 'RealState.com',
        to: email,
        subject: "Confirm your RealState.com account",
        text: "Confirm your RealState.com account",
        html: `
            <p>Hello ${name}, we need you to confirm your account from RealState.com </p>

            <p> You can confirm your account in the next link:
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmEmail/${token}">Confirm Account</a></p>

            <p>If you don't create this account you can ignore this message</p>
        `
      })

}

const recoveriPasswordEmail = async (data) => {
  var transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const { name, email, token } = data;
    await transport.sendMail({
      from: 'RealState.com',
      to: email,
      subject: "Reset your password on your RealState.com account",
      text: "Reset your password on your RealState.com account",
      html: `
          <p>Hello ${name}, let's change your password </p>

          <p> Pleas click on the link to replace your password for a new one:
          <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/forgotPassword/${token}">Reset Password</a></p>

          <p>If you don't want to change it you can ignore this message</p>
      `
    })

}

export {
    registerEmail,
    recoveriPasswordEmail
}