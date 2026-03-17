/**
 * Invoice Controller
 * Responsabilidad: Recibir peticiones HTTP, validar entrada, delegar al servicio
 */


const invoiceService = require('./invoice.service');

const createInvoice = async (req, res) => {
  try {
    const invoice = await invoiceService.create(req.body);
    res.status(201).json(invoice)
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getInvoiceById = async (req, res) => {
  try {

    const {id} = req.params;
    const invoice = await invoiceService.getById(id)

    res.status(200).json(invoice);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUserInvoices = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page, limit } = req.query;

    const result = await invoiceService.getByUser(userId, {
      page: Number(page),
      limit: Number(limit)
    });

    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  createInvoice,
  getInvoiceById,
  getUserInvoices
};
