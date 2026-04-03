/**
 * Invoice Service
 * Responsabilidad: Contiene TODA la lógica de negocio de facturación
 */



const Invoice = require('./invoice.model');
const User = require('../users/user.model')

const create = async (invoiceData) => {
  // TODO: Generar JSON de factura según tipo de documento
  // TODO: Validar que precio en carrito coincida con precio en factura (0% discrepancia)

  const subTotal = invoiceData.items.reduce((sum, p) => sum + p.precio, 0)
  const IVA = 0.13


    try{
        const invoice = new Invoice(
      {
        usuario: invoiceData.userId,
        tipoDocumento: invoiceData.tipoDocumento,
        items: invoiceData.items,
        subtotal: subTotal,
        iva: subTotal * IVA,
        total: subTotal * (IVA + 1),
        datosFacturación: invoiceData.datosFacturación,
      }
    )

    return await invoice.save()
    }

    catch (error) {
      throw new Error(`Error creating Invoice: ${error.message}`);
      }

};

const getById = async (invoiceId) => {

    try{
        const invoice =  await Invoice.findById(invoiceId);

        if(!invoice){
          throw new Error("Invoice not found");
        }

        return invoice;
    }

    catch (error) {
      throw new Error(`Error retrieving invoice: ${error.message}`);
  }
    

};

const getByUser = async (userId, page = 1, limit = 10) => {

  page = Math.max(page, 1);

  limit = Math.min(limit, 100);

  const skip = (page - 1) * limit;

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const invoices = await Invoice.find({ usuario: userId })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Invoice.countDocuments({ usuario: userId });

  return {
    data: invoices,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}

const updateStatus = async (invoiceId, estado) => {
  const invoice = await Invoice.findByIdAndUpdate(
    invoiceId,
    { estado },
    { new: true, runValidators: true }
  );

  if (!invoice) {
    throw new Error('Invoice not found');
  }

  return invoice;
}

module.exports = {
  create,
  getById,
  getByUser,
  updateStatus
};
