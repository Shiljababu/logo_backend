import Category from "../models/categoryModel.js"
import Product from "../models/productModel.js"

export const addCategory = async (req, res) => {
  try {
    if (!req.session.admin) return res.status(401).json({ message: "Admin only" })

    const { name, description } = req.body
    const newCategory = new Category({ name, description })
    await newCategory.save()

    res.status(201).json({ message: "Category added successfully", category: newCategory })
  } catch (err) {
    console.error("Add category error:", err)
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({isDisabled:false})
    res.status(200).json({ message: "All categories fetched", categories })
  } catch (err) {
    console.error("Get all categories error:", err)
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

export const getSingleCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) return res.status(404).json({ message: "Category not found" })

    res.status(200).json({ message: "Category fetched", category })
  } catch (err) {
    console.error("Get single category error:", err)
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

export const updateCategory = async (req, res) => {
  try {
    if (!req.session.admin) return res.status(401).json({ message: "Admin only" })

    const { name, description } = req.body
    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, { name, description }, { new: true })

    if (!updatedCategory) return res.status(404).json({ message: "Category not found" })

    res.status(200).json({ message: "Category updated", category: updatedCategory })
  } catch (err) {
    console.error("Update category error:", err)
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

export const toggleCategory = async (req, res) => {
  try {
    if (!req.session.admin) return res.status(401).json({ message: "Admin only" })

    const category = await Category.findById(req.params.id)
    if (!category) return res.status(404).json({ message: "Category not found" })

    category.isDisabled = !category.isDisabled
    await category.save()
    await Product.updateMany({ categoryId: category._id }, { isDisabled: category.isDisabled })

    res.status(200).json({
      message: `Category ${category.isDisabled ? "disabled" : "enabled"} successfully`,
      category,
    })
  } catch (err) {
    console.error("Toggle category status error:", err)
    res.status(500).json({ message: "Server error", error: err.message })
  }
}