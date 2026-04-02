const Order = require('./order.model');
const States = require('../orders/orderStates')

//Verifica los datos de la orden utilizando el modelo y la guarda a la BD
const create = async (orderData) => {
    try{
        const items = Array.isArray(orderData.items) ? orderData.items : []
        const uniqueSellers = Array.from(
          new Set(items.map((item) => String(item.vendedorId)))
        ).filter(Boolean)

        const estadosVendedor = uniqueSellers.map((sellerId) => ({
          vendedorId: sellerId,
          estado: "PENDIENTE",
          historial: [{ estado: "PENDIENTE", comentario: "Orden creada" }]
        }))

        const order = new Order({
          ...orderData,
          estadosVendedor
        })

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

// Retorna órdenes de un vendedor (solo órdenes cuyos items son de ese vendedor)
const getBySeller = async (sellerId, page = 1, limit = 10) => {
  try {
    page = Math.max(page, 1);
    limit = Math.min(limit, 100);

    const skip = (page - 1) * limit;

    const query = {
      'items.vendedorId': sellerId,
    };

    const orders = await Order.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    return {
      data: orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    throw new Error(`Error retrieving seller orders: ${error.message}`)
  }
}



//Actualiza el estado de una orden
const updateOrderStatus = async (orderId, newState, comment, sellerId) => {


  try {

    const order = await Order.findById(orderId);

    if(!order){
        throw new Error("Orden no encontrada")
    }

    if (!Array.isArray(order.estadosVendedor) || order.estadosVendedor.length === 0) {
      const items = Array.isArray(order.items) ? order.items : []
      const uniqueSellers = Array.from(new Set(items.map((item) => String(item.vendedorId)))).filter(Boolean)
      order.estadosVendedor = uniqueSellers.map((id) => ({
        vendedorId: id,
        estado: order.estado || "PENDIENTE",
        historial: [{ estado: order.estado || "PENDIENTE", comentario: "Estado inicial" }]
      }))
    }

    const sellerState = order.estadosVendedor.find(
      (entry) => String(entry.vendedorId) === String(sellerId)
    )

    if (!sellerState) {
      throw new Error("El vendedor no tiene items en esta orden")
    }

    //Recibe las transiciones de estado validas definidas en el objeto que esta en el archivo orderStates
    const validStates = States.VALID_TRANSITIONS[sellerState.estado] || [];

    //Valida que el nuevo estado sea una transición valida
    if (!validStates.includes(newState)) {
    throw new Error("Cambio de estado invalido");
    }


    
    sellerState.estado = newState
    sellerState.historial = sellerState.historial || []
    sellerState.historial.push({ estado: newState, comentario: comment })

    const allStates = order.estadosVendedor.map((entry) => entry.estado)

    let overallState = "PENDIENTE"
    if (allStates.includes("CANCELADA")) {
      overallState = "CANCELADA"
    } else if (allStates.every((state) => state === "RECIBIDA")) {
      overallState = "RECIBIDA"
    } else if (allStates.every((state) => state === "EN_CAMINO" || state === "RECIBIDA")) {
      overallState = "EN_CAMINO"
    } else {
      overallState = "PENDIENTE"
    }

    order.estado = overallState
    order.historialEstados = order.historialEstados || []
    order.historialEstados.push({ estado: overallState, comentario: comment })

    const updatedOrder = await order.save()

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
  getBySeller,
    updateOrderStatus
};
