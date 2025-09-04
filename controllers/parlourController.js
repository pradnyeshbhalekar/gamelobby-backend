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

exports.toggleParlourStatus = async(req,res) => {
    try{
        const {id} = req.params;
        const parlour = await Parlour.findById(id)

        if(!parlour){
            return res.status(404).json({
                error:"Cafe not found"
            })
        }

        parlour.isOpen = !parlour.isOpen
        await parlour.save()

        res.status(200).json({
            message:`Parlour is now ${parlour.isOpen ? "Open" : "Closed"}`
        })
    }catch(err){
        console.log('error occured',err)
        res.status(500).json({
            message: "Error occured",
            error:err.message
        })
    }
}

exports.enablePreBooking = async (req,res) => {
    try{
        const {id} = req.params
        const parlour = await Parlour.findById(id)

        if(!parlour){
            res.status(404).json({
                message:"Parlour not found"
            })
        }
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate()+1)
        const formatedDate = tomorrow.toLocaleDateString('en-US',options)

        parlour.allowPreBooking = true
        parlour.preBookingDate = formatedDate
        await parlour.save()

        res.status(200).json({
            message:`Prebooking started for ${formatedDate}`,
            allowPreBooking:parlour.allowPreBooking,
            preBookingDate:parlour.preBookingDate
        })
    }catch(err){
        console.log("error occured",err)
        res.status(500).json({
            message:"Error occured",
            error:err.message
        })
    }
}

