const publicacion = require('../models/publicacion.model');
const indexcontroller = {  
};


indexcontroller.getindex =async (req,res)=>{
       
      const publications= await publicacion.find().sort({'createdAt':'desc'})
      .populate('author')
      .populate("comments.comment");
      
    
    
   res.send({publications: publications});
   
   
};

module.exports= indexcontroller;