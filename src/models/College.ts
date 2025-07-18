import mongoose  from "mongoose";


interface IDepartment {
    name: string;
    head: mongoose.Types.ObjectId;
  }
  
  interface IContact {
    phone: string[];
    email: string[];
    website?: string;
  }
  
  interface Icollege extends Document {
    collegeName: string;
    affilatedTo: string;
    principal: mongoose.Types.ObjectId;
    vicePrincipal: mongoose.Types.ObjectId;
    departments: IDepartment[];
    collegeCode: string;
    address: string;
    contact: IContact;
    rating?: mongoose.Types.ObjectId;
    tags: string[];
  }
const collegeSchema = new mongoose.Schema({
    collegeName: {
        type:String,
        required: true,
    },
    affilatedTo: {
        type: String,
        required:true,
    },
    principal: {
        type:String,
        required:true,  
    },
    vicePrincipal: {
        type:String,      
        required:true,
    },
    departments: [{
        name: { type: String, required: true },
        head: { type: mongoose.Types.ObjectId, ref: 'Teacher' },
    }],
    collegeCode: {
        type: String,
        unique: true,
   
    },
    address: {
        type: String,
        required:true,
    },
    contact: {
        phone: [String],
        email: [String],
        website: String,
    },
    rating: {
        type: mongoose.Types.ObjectId,
        ref:"Rating",
    },
    tags: [{
        type:String,
    }]
}, {
    timestamps:true,
})



collegeSchema.index({tags:1,address:1,collegeName:1,affilatedTo:-1})
export const College = mongoose.model<Icollege>("College",collegeSchema)