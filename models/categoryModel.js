import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: 
    { 
        type: String, 
        required: true 
    },
    description: 
    { 
        type: String 

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

const Category = mongoose.model("Category", categorySchema);
export default Category;
