import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: 
    { 
        type: String, 
        required: true 
    },
    image: 
    [{ 
        type: String,
        
    }],
    description: 
    { 
        type: String 

    },
    size: 
    { 
        type: String 
    },
    color: 
    { 
        type: String 
    },
    brand: 
    { 
        type: String 
    },
    categoryId: 
    { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Category" 
    },
    price: 
    { 
        type: Number, 
        required: true 
    },
    isDisabled: 
    { 
        type: Boolean, 
        default: false 
    },
  },
  { 
    timestamps: true 
}
);

const Product = mongoose.model("Product", productSchema);
export default Product;
