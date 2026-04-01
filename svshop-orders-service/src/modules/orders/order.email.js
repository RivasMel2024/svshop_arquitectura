const nodemailer = require('nodemailer');
const config = require('../../config/config');

const isEmailConfigured = () => {
  return Boolean(config.SMTP_HOST && config.SMTP_USER && config.SMTP_PASS && config.SMTP_FROM);
};

const buildTransporter = () => {
  return nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: config.SMTP_SECURE,
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS,
    },
  });
};

const sendCheckoutConfirmationEmail = async ({ to, order }) => {
  if (!to) {
    throw new Error('No hay correo del cliente para enviar confirmacion');
  }

  if (!isEmailConfigured()) {
    throw new Error('SMTP no configurado. Completa variables SMTP_* en .env');
  }

  const transporter = buildTransporter();

  const total = Number(order?.totales?.total || order?.total || 0).toFixed(2);
  const estado = order?.estado || 'PENDIENTE';
  const numeroOrden = order?.numeroOrden || order?._id;

  const itemsHtml = Array.isArray(order?.items)
    ? order.items
        .map((item) => {
          const nombre = item?.nombreProducto || 'Producto';
          const cantidad = item?.cantidad || 0;
          const subtotal = Number(item?.subtotal || 0).toFixed(2);
          return `<li>${cantidad} x ${nombre} - $${subtotal}</li>`;
        })
        .join('')
    : '';

  await transporter.sendMail({
    from: config.SMTP_FROM,
    to,
    subject: `Confirmacion de compra - ${numeroOrden}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height:1.6; color:#222;">
        <h2>Gracias por tu compra en SvShop</h2>
        <p>Tu pedido fue creado correctamente.</p>
        <p><strong>Numero de orden:</strong> ${numeroOrden}</p>
        <p><strong>Estado inicial:</strong> ${estado}</p>
        <p><strong>Total:</strong> $${total}</p>
        <h3>Resumen:</h3>
        <ul>${itemsHtml}</ul>
        <p>Te notificaremos cualquier cambio de estado.</p>
      </div>
    `,
  });
};

module.exports = {
  sendCheckoutConfirmationEmail,
};
