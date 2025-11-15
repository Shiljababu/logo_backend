import Cart from "../models/cartModel.js"
import Product from "../models/productModel.js"

export const addCart = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized. Please log in." })
    }
    const userId = req.session.user.id
    const { productId, quantity = 1 } = req.body
    const product = await Product.findById(productId)
    if (!product) return res.status(404).json({ message: "Product not found" })
    let userCart = await Cart.findOne({ userId })
    if (userCart) {
      const itemExists = userCart.items.find(
        (item) => item.productId.toString() === productId
      )
      if (itemExists) {
        await Cart.updateOne(
          { userId, "items.productId": productId },
          { $inc: { "items.$.quantity": quantity } }
        )
      } else {
        userCart.items.push({ productId, quantity })
      }
      userCart.totalPrice = await calculateTotal(userCart.items)
      await userCart.save()
      res.json({ message: "Cart updated successfully", cart: userCart })
    } else {
      const totalPrice = product.price * quantity
      const newCart = await Cart.create({
        userId,
        items: [{ productId, quantity }],
        totalPrice,
      })
      res.json({ message: "Cart created", cart: newCart })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const editCart = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized. Please log in." })
    }

    const userId = req.session.user.id
    const { productId, quantity } = req.body

    if (!productId || !quantity) {
      return res.status(400).json({ message: "Product ID and quantity are required." })
    }

    const userCart = await Cart.findOne({ userId })
    if (!userCart) {
      return res.status(404).json({ message: "Cart not found" })
    }

    const itemIndex = userCart.items.findIndex(
      (item) => item.productId.toString() === productId
    )

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" })
    }

    userCart.items[itemIndex].quantity = quantity

    userCart.totalPrice = await calculateTotal(userCart.items)
    await userCart.save()

    res.status(200).json({
      message: "Cart updated successfully",
      cart: userCart,
    })
  } catch (error) {
    console.error("Edit cart error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// export const deleteProductCart = async (req, res) => {
//   try {
//     if (!req.session.user) {
//       return res.status(401).json({ message: "Unauthorized. Please log in." })
//     }

//     const userId = req.session.user.id
//     const { productId } = req.params

//     if (!productId) {
//       return res.status(400).json({ message: "Product ID is required" })
//     }

//     const userCart = await Cart.findOne({ userId })
//     if (!userCart) {
//       return res.status(404).json({ message: "Cart not found" })
//     }

//     const itemIndex = userCart.items.findIndex(
//       (item) => item.productId.toString() === productId
//     )

//     if (itemIndex === -1) {
//       return res.status(404).json({ message: "Product not found in cart" })
//     }

//     if (userCart.items[itemIndex].quantity > 1) {
//       userCart.items[itemIndex].quantity -= 1
//     } else {
//       userCart.items.splice(itemIndex, 1)
//     }

//     userCart.totalPrice = await calculateTotal(userCart.items)
//     await userCart.save()

//     res.status(200).json({
//       message: "Cart updated successfully after deletion",
//       cart: userCart,
//     })
//   } catch (error) {
//     console.error("Delete cart item error:", error)
//     res.status(500).json({ message: "Server error", error: error.message })
//   }
// }
export const deleteProductCart = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const userId = req.session.user.id;
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const userCart = await Cart.findOne({ userId });
    if (!userCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = userCart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // ✅ Remove or decrement quantity
    if (userCart.items[itemIndex].quantity > 1) {
      userCart.items[itemIndex].quantity -= 1;
    } else {
      userCart.items.splice(itemIndex, 1);
    }

    // ✅ Recalculate total and save
    userCart.totalPrice = await calculateTotal(userCart.items);
    await userCart.save();

    res.status(200).json({
      message: "Cart updated successfully after deletion",
      cart: userCart,
    });
  } catch (error) {
    console.error("Delete cart item error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized. Please log in." })
    }

    const userId = req.session.user.id

    const userCart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      model: "Product",
      select: "name price image description brand color size category", 
    })

    if (!userCart || userCart.items.length === 0) {
     return res.status(200).json({
        message: "Cart is empty",
        cart: { items: [], totalPrice: 0 },
      });
    }

    const totalPrice = await calculateTotal(userCart.items);

    res.status(200).json({
      message: "Cart fetched successfully",
      cart: {
        ...userCart.toObject(),
        totalPrice,
      },
    });
  } catch (error) {
    console.error("Get Cart Error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}


const calculateTotal = async (items) => {
  let total = 0
  for (let item of items) {
    const product = await Product.findById(item.productId)
    if(product) total += product.price * item.quantity
  }
  return total
}
