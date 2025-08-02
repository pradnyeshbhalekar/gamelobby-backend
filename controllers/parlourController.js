const Parlour = require('../models/parlour')

exports.setUpParlour = async(req,res) => {
    try{
        const parlourId = req.parlour._id;


        const updatedParlour = await Parlour.findByIdAndUpdate(
            parlourId,{
                address:req.body.address,
                timings:req.body.timings,
                happyhours:req.body.happyhours,

            },
            
            {new:true}
        )

        res.status(200).json({
            message:"Parlour updated",updatedParlour
        })
    }catch(err){
          res.status(500).json({message:err.message})
    }
}



