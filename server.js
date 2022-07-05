const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/user.model')
const Movies = require('./models/movies.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const secret = 'secret6101091611074';

mongoose.connect('mongodb+srv://worachat:admin123@movierecord.x5vuq.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error', err);
});

app.use((req,res,next)=>{
  res.header('Access-Control-Allow-Origin','*');
  res.header('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept,Authorization');
  res.header('Access-Control-Allow-Methods','*')
  next();
})

app.use(express.json());

let port = process.env.PORT || 9000;

//////////////////// User Data /////////////////////

// register 
app.post('/api/register', (req, res) => {
  bcrypt.hash(req.body.password, saltRounds,async function(err, hash) {
  try{
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hash,
      avatar:req.body.avatar,
      rank:"CUSTOMER",
      fname: req.body.fname,
      lname: req.body.lname,
    })
    res.json({status:'ok',message:'register success', user})
  }catch(err){
    res.json({status:'error', error:'Duplicate email'})
  }
});
  
});

// login 
app.post('/api/login', async (req, res) => {

  try{
    const user = await User.findOne({
      email: req.body.email,
    })
    const match = await bcrypt.compare(req.body.password, user.password);
    const accessToken = jwt.sign({
      _id:user._id,
      username:user.username,
      rank:user.rank,
      avatar:user.avatar
    }, secret,{expiresIn:'1h'})
    if(match){
      return res.json({status:'ok',message:'Login success' , accessToken:accessToken });
    } else {
      return res.json({status:'error',message:'Login failed'})
  }
  }catch(e){
    return res.json({status:'error',message:'Email or Password incorrect'})
  }
});

//authen
app.post('/api/authen', async (req, res) => {
  try{
    const token = req.headers.authorization.split(' ')[1]
    var decoded = jwt.verify(token,secret)
    return res.json({status:'ok',message:'Authen Success',decoded})
  }catch(error){
    return res.json({status:'error',message:error.message})
  }
});

//get user all
app.get('/api/users', async (req, res) => {
  try{
    const user = await User.find({});
    res.json({
      status:'ok',
      user
    });
  }catch(error){
    res.json({message: error.message})
  }
});

//get user by id
app.get('/api/users/:id', async (req, res) => {
  try{
    const { id } = req.params;
    const user = await User.findById(id);
    res.json({
      status:'ok',
      user,
    });
  }catch(error){
    res.json({message: error.message})
  }
});

//Update user
app.put('/api/users/:id',async (req, res) => {
  try{
    const payload = req.body;
    const { id } = req.params;
    await User.findByIdAndUpdate(id, { $set: payload });
    const user = await User.findById(id);
    const accessToken = jwt.sign({
      _id:user._id,
      username:user.username,
      rank:user.rank,
      avatar:user.avatar
    }, secret,{expiresIn:'1h'})
    res.json({
      status:'ok',
      message:'Update Success',
      user,
      accessToken:accessToken
    });
  }catch(error){
    res.json({message: error.message})
  }
});

//delete user
app.delete('/api/users/:id',async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  res.json({
    status:'ok',
    message:'Delete Success'
  })
  res.status(204).end();
});

//////////////////// End User Data /////////////////////


/////////////////// Movies Data ///////////////////////////

//get movies
app.get('/movies', async (req, res) => {
  try{
    const movie = await Movies.find({});
    res.json({
      status:'ok',
      movie
  });
  }catch(error){
    res.json({
      status:'error',
      message: error.message
    })
  }
});

//get movie by id
app.get('/movies/:id', async (req, res) => {
  try{
    const { id } = req.params;
    const movie = await Movies.findById(id);
    res.json({
      status:'ok',
      movie
    });
  }catch(error){
    res.json({
      status:'error',
      message: error.message
    })
  }
});

//Creat Movies
app.post('/movies', async (req, res) => {
  try{
    const movie = await Movies.create({
      moviename: req.body.moviename,
      released: req.body.released,
      rating: req.body.rating,
      photo:req.body.photo,
      vdo: req.body.vdo,
      text:req.body.text,
    })
    res.json({
      status:'ok',
      message:'Creat movie success', 
      movie
    })
  }catch(error){
    res.json({
      status:'error',
      message: error.message
    })
  }
});

//update movies
app.put('/movies/:id',async (req, res) => {
  try{
    const payload = req.body;
    const { id } = req.params;
    await Movies.findByIdAndUpdate(id, { $set: payload });
    const movie = await Movies.findById(id);
    res.json({
      status:'ok',
      message:'Update movie success', 
      movie
  });
  }catch{
    res.json({
      status:'error',
      message: error.message
    })
  }
});

//delete
app.delete('/movies/:id',async (req, res) => {
  try{
    const { id } = req.params;
    await Movies.findByIdAndDelete(id);
    res.json({
      status:'ok',
      message:'Delete Success'
    })
    res.status(204).end();
  }catch(error){
    res.json({
      status:'error',
      message: error.message
    })
  }
});


app.listen(port, () => {
  console.log('Application is running on port 9000');
});