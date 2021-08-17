const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverrid = require('method-override');
const Camp = require('./models/camp');

// Connect to the database
mongoose.connect('mongodb://localhost:27017/lotr-camp',{
    useNewUrlParser: true,
    useCreateIndex:true,
    useUnifiedTopology:true
});

// Verify the database is connected
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.use(express.urlencoded({extended:true}));
app.use(methodOverrid('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))




// Routes
app.get('/', (req,res)=>{
    res.send("Hello from the shire!")
})

app.get('/newcamp', async(req,res)=>{
    const campground = new Camp({
        title:"Prancing Pony",
        description:"A place for refreshments and sleep",
        location:"Brandywine",
        price:"200"
    })
    await campground.save();
    res.send(campground)
})

app.get('/campgrounds', async(req,res)=>{
    const campgrounds = await Camp.find({})
    res.render('campgrounds/index', {campgrounds});
})

app.get('/campgrounds/new', (req,res) =>{
    res.render('campgrounds/new');
})


app.get('/campgrounds/:id/edit', async(req,res)=>{
    const {id} = req.params;
    console.log(id);
    const campground = await Camp.findById(id);
    res.render('campgrounds/edit', {campground});
})

app.put('/campgrounds/:id', async(req,res)=>{
    const {id} = req.params;
    const campground = await Camp.findByIdAndUpdate(id, {...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);
})

app.delete('/campgrounds/:id', async(req,res)=>{
    const {id} = req.params;
    const campground = await Camp.findByIdAndDelete(id);
    console.log(id)
    res.redirect('/campgrounds');
})



app.post('/campgrounds', async(req,res)=>{
    const camp = new Camp(req.body.campground)
    const campground = await camp.save();
    res.redirect('/campgrounds');
})



app.get('/campgrounds/:id', async(req,res) =>{
   const {id} = req.params;
   const campground = await Camp.findById(id);
   res.render('campgrounds/show', {campground})
})



app.listen('3000',()=>{
    console.log("They are taking the hobits to port 3000!")
})

