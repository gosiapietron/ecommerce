var express         =   require('express'),
    app             =   express(),
    LocalStrategy   =   require('passport-local'),
    passport        =   require("passport"),
    User            =   require('./models/user'),
    bodyParser      =   require('body-parser'),
    mongoose        =   require('mongoose'),
    myProducts      =   require('./models/schemaecom'),
    myPurchases     =   require('./models/schemabuy'),
    flash           =   require('connect-flash')
    app.use(bodyParser.urlencoded({ extended: false }))

    
mongoose.connect('mongodb://localhost/passport-js-simple-app');
//===================
// PASSPORT CONFIGURATION
//======================
app.use(require("express-session")({
    secret: "passport example super secret...",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash('error');
    res.locals.success=req.flash('success')
    next();
})


// app.get('/',(req,res)=>{
//     res.send(`<h1>Welcome to the online shop</h1>`)
// })

//=======================================================
//                  REGISTER
//=======================================================
app.get("/register", function(req, res){
   res.render("register.ejs"); 
});
app.post("/register", function(req, res){
    var newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            console.log("success", "you have successfully registered as  " + user.username);
           res.redirect("/"); 
        });
    });
});
//=======================================================
//                  LOGIN
//=======================================================
app.get('/login',(req,res)=>{
    res.render('login.ejs')
})
//handling login logic
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/",
        successFlash: 'Logged in succesfully',
        failureRedirect: "/login",
        failureFlash: 'Invalid username or password.'
    }), function(req, res){
});
//=======================================================
//                  LOGOUT
//=======================================================
app.get("/logout", (req, res)=>{
    req.logout();
    console.log("success", "You have successfully logged out ");
    req.flash("success", "You have successfully logged out ");
    res.redirect("/login");
});

//MIDDLEWARE TO PROTECT OUR ROUTES:
var isLoggedIn = (req, res, next)=>{
    if(req.isAuthenticated()){return next()}
    res.redirect("/login");
}

app.get('/',(req,res)=>{
    myProducts.find({user:req.user},(e, data)=>{
        if(e || (!data)){
            return console.log("nothing found!", err)
        }else{

        res.render('mainpage.ejs',{data})
        
    }
    })
})

app.get('/add',(req,res)=>{    
res.render('additems.ejs')
})

app.post('/add',function(req,res){
    var item = req.body.item;
    var price = req.body.price;
    var description = req.body.description;
    var availability = req.body.availability;
    myProducts.create({item:item, price:price, description:description,availability:availability},(err, data)=>{
        if(err) return console.log('err', err)
        console.log('succesfully saved', data)
    })

        res.redirect('/')

})

app.get('/admin',(req,res)=>{    
myProducts.find({user:req.user},(e, data)=>{
        if(e || (!data)){
            return console.log("nothing found!", err)
        }else{
        res.render('admin.ejs',{data})}
    })
})


app.get('/addphotos/:name',(req,res)=>{
var name= req.params.name    
res.render('addphotos.ejs', {name})
})

app.post('/addphotos/:name',function(req,res){
    var name= req.params.name
    var photo=req.body.photo
    console.log("yey")
    
    myProducts.find({},(err, data)=>{
        if(err || (!data)){
            return console.log("nothing found!", err)
        }else{
            data.map((item)=>{
                if(item.item == name){

                item.photos.push({photo:photo})
                item.save((err, success)=>{
                if(err) return console.log('err',err)
                else console.log("Yeah updated", success)
                })

        }else{
                     console.log("no matches found!!!")
                }
            })
        }
    })
                
        res.redirect('/admin')
    
})

app.get('/editprice/:name',(req,res)=>{
var name= req.params.name    
res.render('admin.ejs', {name})
})


app.post('/editprice/:name',function(req,res){
    var name= req.params.name
    var newPrice = req.body.editprice
    
    myProducts.find({},(err, data)=>{
        if(err || (!data)){
            return console.log("nothing found!", err)
        }else{
            data.map((item)=>{
                if(item.item == name){
                    item.price = newPrice
                    item.save((err, success)=>{
                        if(err) return console.log('err',err)
                        else console.log("Yeah updated", success)
                    })
                
                }else{
                     console.log("no matches found!!!")
                }
            })
        }
    })


    res.redirect('/admin')

})


app.get('/editstock/:name',(req,res)=>{
var name= req.params.name    
res.render('admin.ejs', {name})
})


app.post('/editstock/:name',function(req,res){
    var name= req.params.name
    var newStock = req.body.editstock
    
    myProducts.find({},(err, data)=>{
        if(err || (!data)){
            return console.log("nothing found!", err)
        }else{
            data.map((item)=>{
                if(item.item == name){
                    item.availability = newStock
                    item.save((err, success)=>{
                        if(err) return console.log('err',err)
                        else console.log("Yeah updated", success)
                    })
                
                }else{
                     console.log("no matches found!!!")
                }
            })
        }
    })


    res.redirect('/admin')

})

app.get('/buy/:name/:price/:availability',(req,res)=>{
var name= req.params.name
var price= req.params.price
var availability= req.params.availability
var quantity=1 

    myPurchases.find({user:req.user},(e, data)=>{
        if(e || (!data)){
            return console.log("nothing found!", err)
        }else{

        res.render('buy.ejs', {data, name, price, quantity, availability})
        
        }
    })
})


app.post('/buy/:name/:price/:availability',function(req,res){
    var name= req.params.name
    var price= req.params.price
    var availability= req.params.availability
    var quantity=1
     
            
            myPurchases.create({name:name, price:price, quantity:quantity, availability:availability},(err, data)=>{
            if(err) return console.log('err', err)
            console.log('succesfully saved', data)
                     
                
        res.redirect('/buy/:name/:price/:availability')
    })
})

app.get('/mycart',(req,res)=>{    
res.redirect('/buy/:name/:price/:availability')
})



app.post('/:name/:availability/plus',function(req,res){
    var name=req.params.name
    var availability=req.params.availability
    var quantity
    
    myPurchases.find({},(err, data)=>{
        if(err || (!data)){
            return console.log("nothing found!", err)
        }else{
            data.map((item)=>{
                if(item.name==name && item.quantity<item.availability){
                    item.quantity +=1
                    item.save((err, success)=>{
                        if(err) return console.log('err',err)
                        else console.log("Yeah updated", success)
                    })
                
                }else{
                     console.log("no matches found!!!")
                }
            })
        }
    })


    res.redirect('/buy/:name/:price/:availability')

})

app.post('/:name/:id/minus',function(req,res){
    var id= req.params.id
    var name=req.params.name
    var quantity
    
    myPurchases.find({},(err, data)=>{
        if(err || (!data)){
            return console.log("nothing found!", err)
        }else{
            data.map((item)=>{
                if(item.name==name && item.quantity>=1){
                    item.quantity -=1
                    item.save((err, success)=>{
                        if(err) return console.log('err',err)
                        else console.log("Yeah updated", success)
                    })
                
                } 
                if (item.quantity===0){
                    
                    myPurchases.findByIdAndRemove({_id:id}, (err,data)=>{
                    if (err) return console.log(err)
                    console.log(data)

                
                    data.save((err, success)=>{
                        if(err) return console.log('err',err)
                        else console.log("Yeah updated", success)
                    })
                    })
                }
                else{
                     console.log("no matches found!!!")
                }
            })
        }
    })


    res.redirect('/buy/:name/:price/:availability')

})

app.get('/checkout/:sum',(req,res)=>{ 
var sum= req.params.sum   
res.render('checkout.ejs', {sum})
})

app.post('/checkout/:sum',function(req,res){
   var sum= req.params.sum 
     console.log(req.params)

    
    myPurchases.find({},(err, data)=>{
        if(err || (!data)){
            return console.log("nothing found!", err)
        }else{
                
            data.map((item)=>{                            
                    item.availability = item.availability - item.quantity
                    item.save((err, success)=>{
                        if(err) return console.log('err',err)
                        else console.log("Yeah updated", success)
                    })
                       

            myProducts.find({},(err, done)=>{
            if(err || (!done)){
            return console.log("nothing found!", err)
            }else{
                
            done.map((x)=>{                   
                if(x.item === item.name){                  
                x.availability=item.availability }                                          
                x.save((err, success)=>{
                        if(err) return console.log('err',err)
                        else console.log("Yeah updated", success)
                   })
            }) 
            }
            })  
              

        })
        }
    
        myPurchases.remove({},(err, done)=>{ 
        if(err || (!done)){
            return console.log("nothing found!", err)}
        else {console.log("successfully removed")}
        })

    })
        res.render('checkout.ejs', {sum})
})

app.get('/updatepage',(req,res)=>{
myProducts.find({user:req.user},(e, data)=>{
        if(e || (!data)){
            return console.log("nothing found!", err)
        }else{
        res.render('updatepage.ejs',{data})}
    })
})

app.get('/edititem/:name',(req,res)=>{
var name= req.params.name    
res.render('updatepage.ejs', {name})
})


app.post('/edititem/:name',function(req,res){
    var name= req.params.name
    var newName = req.body.edititem
    
    myProducts.find({},(err, data)=>{
        if(err || (!data)){
            return console.log("nothing found!", err)
        }else{
            data.map((item)=>{
                if(item.item == name){
                    item.item = newName
                    item.save((err, success)=>{
                        if(err) return console.log('err',err)
                        else console.log("Yeah updated", success)
                    })
                
                }else{
                     console.log("no matches found!!!")
                }
            })
        }
    })


    res.redirect('/updatepage')

})


app.get('/editdescription/:name',(req,res)=>{
var name= req.params.name    
res.render('updatepage.ejs', {name})
})


app.post('/editdescription/:name',function(req,res){
    var name= req.params.name
    var newDescription = req.body.editdescription
    
    myProducts.find({},(err, data)=>{
        if(err || (!data)){
            return console.log("nothing found!", err)
        }else{
            data.map((item)=>{
                if(item.item == name){
                    item.description = newDescription
                    item.save((err, success)=>{
                        if(err) return console.log('err',err)
                        else console.log("Yeah updated", success)
                    })
                
                }else{
                     console.log("no matches found!!!")
                }
            })
        }
    })


    res.redirect('/updatepage')

})


app.get('/deleteitem/:id',(req,res)=>{
var id= req.params.id    
res.render('updatepage.ejs', {id})
})

app.post('/deleteitem/:id',function(req,res){
    var id = req.params.id

    
    myProducts.findByIdAndRemove({_id:id}, (err,data)=>{
        if (err) return console.log(err)
        console.log(data)

    })

        res.redirect('/updatepage')
})

app.get('/deletephoto/:id',(req,res)=>{
    var id = req.params.id
    var photo=req.body.photo
    res.render('updatepage.ejs', {data, id, photo})
})

    app.post('/deletephoto/:id',function(req,res){
    var id = req.params.id
    var photo=req.body.photo

    myProducts.findOne({_id:id}, (err, data)=>{
        if(err || (!data)){
            return console.log("nothing found!", err)
        }
        else{
                console.log(data)
                data.photos.map((item, i)=>{
                    if(item.photo === photo){
                    data.photos.splice(i,1)
                    }
                    data.save((err, success)=>{
                    if(err) return console.log('err',err)
                        else console.log("Yeah updated", success)
                    })
                            
                    console.log(data)           
                })
            }                               
        
    })


        res.redirect('/updatepage')
})



app.listen(2501,()=>{
    console.log("Server running on port", 2501)
})