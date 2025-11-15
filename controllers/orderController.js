import Order from "../models/orderModel.js"
import Cart from "../models/cartModel.js"
import Product from "../models/productModel.js"

export const placeOrder = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized. Please log in." })
    }

    const userId = req.session.user.id

    const cart = await Cart.findOne({ userId }).populate("items.productId")
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty." })
    }

    const orderItems = cart.items.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price,
    }))

    const totalPrice = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    )

    const order = await Order.create({
      userId,
      items: orderItems,
      totalPrice,
      paymentStatus: "Pending",
      shippingStatus: "Processing",
    })

    for (const item of cart.items) {
      const product = await Product.findById(item.productId._id)
      if (product) {
        product.stock = Math.max(product.stock - item.quantity, 0) 
        await product.save()
      }
    }

    await Cart.findOneAndDelete({ userId })

    res.status(201).json({
      message: "Order placed successfully",
      order,
    })
  } catch (error) {
    console.error("Place order error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export const getAllOrders = async (req, res) => {
  try {
    if (!req.session.admin) {
      return res.status(401).json({ message: "Unauthorized. Please log in as admin." })
    }
    const orders = await Order.find({
  $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }]
})
      .populate("userId", "name email")
      .populate("items.productId", "name price brand")

    res.status(200).json({
      message: "All orders fetched successfully",
      orders,
    })
  } catch (error) {
    console.error("Get all orders error:", error)
    res.status(500).json({
      message: "Server error while fetching orders",
      error: error.message,
    })
  }
}

export const getUserOrder = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized. Please log in." })
    }

    const userId = req.session.user.id

const orders = await Order.find({ 
  userId, 
  $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] 
})
      .populate("items.productId", "name price brand category")

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" })
    }

    res.status(200).json({ message: "Orders fetched successfully", orders })
  } catch (error) {
    console.error("Get user orders error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}
export const getOrderById = async (req, res) => {
  try {
    if (!req.session.admin) {
      return res.status(401).json({ message: "Unauthorized. Please log in as admin." })
    }

    const orderId = req.params.id

const order = await Order.findOne({ 
  _id: orderId, 
  $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] 
})      .populate("userId", "name email")
      .populate("items.productId", "name price brand category")

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    res.status(200).json({ message: "Order fetched successfully", order })
  } catch (error) {
    console.error("Get order by ID (admin) error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}


export const editOrderByAdmin = async (req, res) => {
  try {
    if (!req.session.admin) {
      return res.status(401).json({ message: "Unauthorized. Please log in as admin." })
    }

    const orderId = req.params.id
    const { shippingStatus } = req.body

    if (!shippingStatus) {
      return res.status(400).json({ message: "Shipping status is required." })
    }

    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({ message: "Order not found." })
    }

    order.shippingStatus = shippingStatus
    await order.save()

    res.status(200).json({
      message: "Shipping status updated successfully",
      order,
    })
  } catch (error) {
    console.error("Update shipping status error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}


export const editPaymentStatus = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized. Please log in." })
    }

    const userId = req.session.user.id
    const orderId = req.params.id
    const { paymentStatus } = req.body

    if (!paymentStatus) {
      return res.status(400).json({ message: "Payment status is required." })
    }

    const allowedStatuses = ["Pending", "Paid", "Failed"]
    if (!allowedStatuses.includes(paymentStatus)) {
      return res.status(400).json({ 
        message: `Invalid payment status. Allowed values: ${allowedStatuses.join(", ")}` 
      })
    }

    const order = await Order.findOne({ _id: orderId, userId })
    if (!order) {
      return res.status(404).json({ message: "Order not found for this user." })
    }

    order.paymentStatus = paymentStatus
    await order.save()

    res.status(200).json({
      message: "Payment status updated successfully",
      order,
    })
  } catch (error) {
    console.error("Update payment status error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}



export const deleteOrder = async (req, res) => {
  try {
    if (!req.session.admin) {
      return res.status(401).json({ message: "Unauthorized. Please log in as admin." })
    }

    const orderId = req.params.id

    const order = await Order.findById(orderId)
    if (!order || order.isDeleted) {
      return res.status(404).json({ message: "Order not found." })
    }

    order.isDeleted = true 
    await order.save()

    res.status(200).json({ message: "Order deleted successfully" })
  } catch (error) {
    console.error("Delete order error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}
