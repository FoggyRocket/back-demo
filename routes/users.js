const express = require('express');
const router = express.Router();

//importamos nuestro modelos y librerias a utilizar
const User = require('../model/User');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")



/* 
* Creamos nuestras rutas necesarias para nuestro crud
* Signup
* Login
* Logout
* Edit-user
*/
router.post('/signup',(req, res, next)=> {
  //destructuramos
  const {password,confirmPassword, ...userValues} = req.body

  if(password !== confirmPassword) res.status(301).json({msg:"La contraseña no coincide"})

  bcrypt.hash(password,10).then(hashedPassword=>{
    const user = {...userValues,password:hashedPassword};
    User.create(user)
    .then(()=>{
      res.status(200).json({msg:"Se creo un usuario por defecto"})
    })
    .catch(error=>{
      res.status(400).json(error)
    })
  })

});

router.post('/login',(req,res,next)=>{
  /**
   * Obtenemos los valores que madamos desde nuestro backend
   * 
  */
  const { email, password} = req.body;
  User.findOne({email}).then((user)=>{
    /* Validamos si el usuario existe en nuestro backend */
    if(user === null ) return res.status(404).json({msg:"Email no existe",code:404})
    /* Comparamos el password para saber si puede cotinuar el proceso  */
    bcrypt.compare(password, user.password).then((match)=>{
      if(match){
        // con esto podremos manipular el objeto para borrar el password
        const userObject = user.toObject(); 
        delete userObject.password;
        
        //crearemos ahora un token para que puede verificar a la persoa y lo guardamos en las cookies

        const token = jwt.sign({id:user._id}, process.env.SECRET,{
          expiresIn: "1d"
        })
        //almacenamos
        res.cookie("token",token,{
          expires: new Date(Date.now() + 86400000),
          secure:false,
          httpOnly:true,
        }).json(userObject)
      }
    });
  }).catch(error=>{
    res.status(400).json({msg:"Error en el login",error})
  });
});


router.post("/logout",(req,res)=>{
  //Aqui eliminamos el token de las cookies
  res.clearCookie("token").json({msg:"Vuelve pronto"})
});


module.exports = router;


/* 
 De esta manera tenemos ya nuestras rutas basicas de ususario 
*/