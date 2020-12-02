const mongoose = require("mongoose");
const {Schema,model} = mongoose


//creamos nuestro esquema 
const userSchema = new Schema({
    name:{
        type:String,
        required:[true,"Debes agregar un nombre"]
    },
    email:{
        type:String,
        required:[true, "Debes agregar un correo electronico"],
        validate:{
            message: "El email ya esta en uso",
            validator:async (email)=>{
                const items = await mongoose.models['User'].count({email});
                return items < 1;
            },
        },

    },
    password:{
        type:String,
        required:[true,"Debes agregar una contraseña"]
    },
    profile_pic:{
        type:String,
        default:"https://www.centraltrials.com/wp-content/uploads/2016/11/User-Default.jpg"
    }
})

//muy importante exportarlo 

module.exports = model("User",userSchema);