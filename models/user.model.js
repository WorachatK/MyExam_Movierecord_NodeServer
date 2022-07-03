const mongoose = require('mongoose')

const User = new mongoose.Schema(
    {
        username:{ type:String,required:true},
        email:{ type:String,required:true ,unique:true},
        password:{ type:String,required:true},
        fname:{ type:String},
        lname:{ type:String}, 
        avatar:{ type:String},
        rank:{ type:String},
    },
    { collection: 'user-data',versionKey: false}
)

const UserModel = mongoose.model('UserData',User)

module.exports = UserModel