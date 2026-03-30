/**
 * Invoice Controller
 * Responsabilidad: Recibir peticiones HTTP, validar entrada, delegar al servicio
 */


const invoiceService = require('./invoice.service');

const createInvoice = async (req, res) => {
  try {
    const { items, tipoDocumento, datosFacturación } = req.body;

    // Validar entrada
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'items debe ser un array no vacío' });
    }
    if (!tipoDocumento) {
      return res.status(400).json({ message: 'tipoDocumento es requerido' });
    }
    if (!datosFacturación) {
      return res.status(400).json({ message: 'datosFacturación es requerido' });
    }

    // Crear invoice con userId del usuario autenticado
    const invoiceData = {
      userId: req.user.id,
      items,
      tipoDocumento,
      datosFacturación
    };

    const invoice = await invoiceService.create(invoiceData);
    res.status(201).json(invoice);
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ message: error.message });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que el ID sea válido
    if (!id) {
      return res.status(400).json({ message: 'ID de factura es requerido' });
    }

    const invoice = await invoiceService.getById(id);

    // Validar que el usuario autenticado sea propietario de la invoice
    if (invoice.usuario.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para acceder a esta factura' });
    }

    res.status(200).json(invoice);
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ message: error.message });
  }
};

const getUserInvoices = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Validar que el usuario autenticado solo pueda ver sus propias invoices
    if (userId !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para acceder invoices de otro usuario' });
    }

    const result = await invoiceService.getByUser(userId, Number(page), Number(limit));

    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ message: error.message });
  }
};

module.exports = {
  createInvoice,
  getInvoiceById,
  getUserInvoices
};
