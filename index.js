import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
app.use(cors());
app.options("*", cors())
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ Backend funcionando correctamente");
});

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
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
    console.error("Zoho error:", error);
    res.status(500).json({ ok: false });
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log("✅ Backend corriendo");
});
