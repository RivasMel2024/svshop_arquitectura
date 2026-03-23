const orderService = require('./order.service');


//Crea una orden nueva
const createOrder = async (req, res) => {
  try {
    const order = await orderService.create(req.body);
    res.status(201).json(order)
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


//Busca una orden usando Id
const getOrderById = async (req, res) => {
  try {

    const {id} = req.params;
    const order = await orderService.getById(id)

    res.status(200).json(order);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//Busca ordenes de un usuario
const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page, limit } = req.query;

    const result = await orderService.getByUser(userId, {
      page: Number(page),
      limit: Number(limit)
    });

    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

//actualiza estado de una orden
const updateOrderStatus = async (req, ses) => {
    try{
        const { id } = req.params;
        const { newState, comment} = req.body;

        const state = await orderService.updateOrderStatus(id, newState, comment)
        res.json(state)
    }

    catch(error) {

        res.status(400).json({ message: error.message });
    }
}

module.exports = {
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderStatus

};

