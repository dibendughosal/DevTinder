const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum:{
            values: ["interested", "ignore", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        }
    }
}, {timestamps: true})

connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this;

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("You Can not Send Connection to yourself.")
    }
    next();
})

connectionRequestSchema.index({fromUserId: 1, toUserId: 1 })

const connectionRequestModel = mongoose.model("connectionRequest", connectionRequestSchema);
 
module.exports = connectionRequestModel;