const Order = require('./order.model');
const States = require('../orders/orderStates')

//Verifica los datos de la orden utilizando el modelo y la guarda a la BD
const create = async (orderData) => {
    try{
        const order = new Order(orderData)

        return await order.save()
    }

    catch (error) {
        throw new Error(`Error creating Order: ${error.message}`);
    }

};

//Verifica que existe una orden con el Id que se busca y se retorna
const getById = async (orderId) => {

    try{
        const order =  await Order.findById(orderId);

        if(!order){
            throw new Error("Order not found");
        }

        return order;
    }

    catch (error) {
        throw new Error(`Error retrieving order: ${error.message}`);
    }
    

};

//Retorna órdenes por usuario utilizando paginación
const getByUser = async (userId, page = 1, limit = 10) => {

    try{
        //No se puede tener una pagina menor que 1
        page = Math.max(page, 1);

        //No se puede tener un limite mayor a 100
        limit = Math.min(limit, 100);

        //La cantidad de datos que se tienen que saltar basado en el limite y pagina
        const skip = (page - 1) * limit;

        const orders = await Order.find({ clienteId: userId })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Order.countDocuments({ clienteId: userId });

        return {
            data: orders,
            pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
            }
        };
    }

    catch(error){
    throw new Error(`Error retrieving orders: ${error.message}`)
    }

}



//Actualiza el estado de una orden
const updateOrderStatus = async (orderId, newState, comment) => {


  try {

    const order = await Order.findById(orderId);

    if(!order){
        throw new Error("Orden no encontrada")
    }

    //Recibe las transiciones de estado validas definidas en el objeto que esta en el archivo orderStates
    const validStates = States.VALID_TRANSITIONS[order.estado] || [];

    //Valida que el nuevo estado sea una transición valida
    if (!validStates.includes(newState)) {
    throw new Error("Cambio de estado invalido");
    }


    
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        estado: newState,
        $push: {
          historialEstados: {
            estado: newState,
            comentario: comment
          }
        }
      },
      { new: true }
    );

    if (!updatedOrder) {
      throw new Error("Order not found");
    }

    return updatedOrder;

  } catch (error) {
    throw new Error(`Error updating order: ${error.message}`);
  }
};


module.exports = {
    create,
    getById,
    getByUser,
    updateOrderStatus
};
