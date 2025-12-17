import nodemailer from "nodemailer";

export const sendMail = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.ZOHO_EMAIL,
        pass: process.env.ZOHO_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Formulario Web" <${process.env.ZOHO_EMAIL}>`,
      to: process.env.ZOHO_EMAIL,
      replyTo: email,
      subject: "📩 Nuevo mensaje desde la web",
      text: `
Nombre: ${name}
Correo: ${email}

Mensaje:
${message}
      `,
    });

    res.json({ ok: true });
  } catch (error) {
    console.error("Error Zoho:", error);
    res.status(500).json({ ok: false });
  }
};
