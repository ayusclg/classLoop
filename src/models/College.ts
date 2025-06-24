import mongoose  from "mongoose";


interface Icollege extends mongoose.Document{
    collegeName: string,
    affilatedTo: string,
    principal: mongoose.Types.ObjectId,
    vicePrincipal: mongoose.Types.ObjectId,
    departments: [Record<string, any>],
    collegeCode: string,
    address: string,
    contact: Record<any, string[]>,
    rating: mongoose.Types.ObjectId,
    tags:string[]
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
        type: mongoose.Types.ObjectId,
        ref:"Teacher",
        required:true,
    },
    vicePrincipal: {
        type: mongoose.Types.ObjectId,
        ref:"Teacher",
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