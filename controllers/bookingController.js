const Booking = require('../models/booking');
const Asset = require('../models/asset');
const User = require('../models/user')
const Parlour = require('../models/parlour');
const booking = require('../models/booking');


exports.createBooking = async (req, res) => {
    try {
        const parlourId = req.params.parlourId;
        const userId = req.user._id;
        const { device, gameId, bookingTime, totalTime } = req.body;

        const start = new Date(bookingTime);
        const totalTimeHours = parseFloat(totalTime);

        if (isNaN(totalTimeHours) || totalTimeHours <= 0) {
            return res.status(400).json({ message: "Invalid totalTime" });
        }

        const end = new Date(start.getTime() + totalTimeHours * 60 * 60 * 1000);

        // ✅ Fix: changed `game` to `games` in query
        const matchingAssets = await Asset.find({
            device,
            games: gameId,
            parlour: parlourId 
        }).populate('parlour');

        if (!matchingAssets.length) {
            return res.status(400).json({
                message: "No asset with selected game/device found. Try different options."
            });
        }

        const availableAsset = await findAvailableAsset(matchingAssets, start, end);
        if (!availableAsset) {
            return res.status(409).json({
                message: "No asset available at this time, try changing the time"
            });
        }

        const parlour = availableAsset.parlour;
        const isHappyHour = checkHappyHour(parlour, start);
        const rate = isHappyHour
            ? availableAsset.pricing.happyhours ?? availableAsset.pricing.regular
            : availableAsset.pricing.regular;

        const totalPrice = Math.ceil(rate * totalTimeHours);

        const booking = await Booking.create({
            user: userId,
            parlour: parlour._id,
            asset: availableAsset._id,
            game: gameId,
            bookingTime: start,
            startTime: start,
            endTime: end,
            totalTime: totalTimeHours,
            totalPrice
        });

        await User.findByIdAndUpdate(userId,{
            $push:{bookings:booking._id}
        })

        await Parlour.findByIdAndUpdate(parlourId,{
            $push:{bookings:booking._id}
        })

        return res.status(201).json({ message: "Booking created", booking });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Booking failed", error: err.message });
    }
};


exports.cancelBooking = async(req,res)=>{
    try{
        const bookingId = req.params.bookingId
        const userId = req.user._id

        const booking = await Booking.findById(bookingId)
        if(!booking){
            return res.status(400).json({
                message:"Booking not found"
            })
        }
        if(booking.user.toString()!=userId.toString()){
            return res.status(403).json({message:"Unauthorized User"})
        }

        await Booking.findByIdAndDelete(bookingId)

        await User.findByIdAndUpdate(userId,{
            $pull:{bookings:bookingId}
        })

        await Parlour.findByIdAndUpdate(booking.parlour,{
            $pull:{bookings:bookingId}
        })

        res.status(200).json({message:"Booking cancelled successfully!"})
    }catch(err){

        res.status(500).json({
            message:"Cancellation Failed"
        })
    }
}

async function findAvailableAsset(assets, start, end) {
    for (const asset of assets) {
        const conflict = await Booking.findOne({
            asset: asset._id,
            $or: [
                { startTime: { $lt: end }, endTime: { $gt: start } }
            ]
        });
        if (!conflict) return asset;
    }
    return null;
}

function checkHappyHour(parlour, time) {
    if (!parlour.happyhours) return false;
    const hour = time.getHours();
    const start = parseInt(parlour.happyhours.start);
    const end = parseInt(parlour.happyhours.end);
    return hour >= start && hour < end;
}
