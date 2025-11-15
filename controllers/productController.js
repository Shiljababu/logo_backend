import Product from "../models/productModel.js"

export const addProduct = async (req, res) => {
  try {
    
    if (!req.session.admin) return res.status(401).json({ message: "Admin only" })

    const { name, description, size, color, brand, categoryId, price } = req.body
    const image = req.files ? req.files.map((file) => file.path) : []

    const newProduct = new Product({
      name, description, size, color, brand, categoryId, price, image
    })

    await newProduct.save()
    res.status(201).json({ message: "Product added", product: newProduct })
  } catch (err) {
    console.error("Add product error:", err)
    res.status(500).json({ message: "Server error", error: err.message })
  }
}
export const getAllProductsUsers = async (req, res) => {
  try {
    const products = await Product.find({ isDisabled: false })
      .populate("categoryId", "name")
      .sort({ createdAt: -1 });
    res.status(200).json({ message: "Active products fetched", products });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find() 
      .populate("categoryId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "All products fetched", products });
  } catch (err) {
    console.error("Get all products error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("categoryId", "name")
    if (!product) return res.status(404).json({ message: "Product not found" })
    res.status(200).json({ message: "Product fetched", product })
  } catch (err) {
    console.error("Get single product error:", err)
    res.status(500).json({ message: "Server error", error: err.message })
  }
}


export const updateProduct = async (req, res) => {
  try {
    if (!req.session.admin)
      return res.status(401).json({ message: "Admin only" });

    const { name, description, size, color, brand, categoryId, price } = req.body;
    const updateData = { name, description, size, color, brand, categoryId, price };

    // If new images are uploaded, replace the old ones
    if (req.files && req.files.length > 0) {
      updateData.image = req.files.map((file) => file.path);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });

    res
      .status(200)
      .json({ message: "✅ Product updated successfully", product: updatedProduct });
  } catch (err) {
    console.error("❌ Update product error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// export const updateProduct = async (req, res) => {
//   try {
//     if (!req.session.admin) return res.status(401).json({ message: "Admin only" })
//     const { name, description, size, color, brand, categoryId, price } = req.body
//     const image = req.file ? req.file.filename : undefined
//     const updateData = { name, description, size, color, brand, categoryId, price }
//     if (image) updateData.image = image
//     const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true })
//     if (!updatedProduct) return res.status(404).json({ message: "Product not found" })
//     res.status(200).json({ message: "Product updated", product: updatedProduct })
//   } catch (err) {
//     console.error("Update product error:", err)
//     res.status(500).json({ message: "Server error", error: err.message })
//   }
// }

export const disableProduct = async (req, res) => {
  try {
    if (!req.session.admin) return res.status(401).json({ message: "Admin only" })
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: "Product not found" })
    product.isDisabled = !product.isDisabled
    await product.save()
    res.status(200).json({
      message: `Product ${product.isDisabled ? "disabled" : "enabled"} successfully`,
      product
    })
  } catch (err) {
    console.error("Toggle product status error:", err)
    res.status(500).json({ message: "Server error", error: err.message })
  }
}