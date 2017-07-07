var express = require('express');
var router = express.Router();
var myProducts = require('../models/schemaecom');
var isLoggedIn = require('../protect middleware/protect');

router.get('/',(req,res)=>{
    myProducts.find({},(e, data)=>{
        if(e || (!data)){
            return console.log("nothing found!", err)
        }else{

        res.render('mainpage.ejs',{data})
        
    }
    })
})

router.get('/add', isLoggedIn, (req,res)=>{    
res.render('additems.ejs')
})

router.post('/add', isLoggedIn, function(req,res){
    var item = req.body.item;
    var price = req.body.price;
    var description = req.body.description;
    var availability = req.body.availability;
    myProducts.create({item:item, price:price, description:description,availability:availability},(err, data)=>{
        if(err) return console.log('err', err)
        console.log('succesfully saved', data)
    })

        res.redirect('/products')

})

router.get('/admin', isLoggedIn, (req,res)=>{    
myProducts.find({},(e, data)=>{
        if(e || (!data)){
            return console.log("nothing found!", err)
        }else{
        res.render('admin.ejs',{data})}
    })
})


router.get('/addphotos/:name', isLoggedIn, (req,res)=>{
var name= req.params.name    
res.render('addphotos.ejs', {name})
})

router.post('/addphotos/:name', isLoggedIn, function(req,res){
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
                
        res.redirect('/products/admin')
    
})

router.get('/editprice/:name', isLoggedIn, (req,res)=>{
var name= req.params.name    
res.render('admin.ejs', {name})
})


router.post('/editprice/:name', isLoggedIn, function(req,res){
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


    res.redirect('/products/admin')

})


router.get('/editstock/:name', isLoggedIn, (req,res)=>{
var name= req.params.name    
res.render('admin.ejs', {name})
})


router.post('/editstock/:name', isLoggedIn, function(req,res){
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


    res.redirect('/products/admin')

})

router.get('/updatepage', isLoggedIn, (req,res)=>{
myProducts.find({},(e, data)=>{
        if(e || (!data)){
            return console.log("nothing found!", err)
        }else{
        res.render('updatepage.ejs',{data})}
    })
})

router.get('/edititem/:name', isLoggedIn, (req,res)=>{
var name= req.params.name    
res.render('updatepage.ejs', {name})
})


router.post('/edititem/:name', isLoggedIn, function(req,res){
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


    res.redirect('/products/updatepage')

})


router.get('/editdescription/:name', isLoggedIn, (req,res)=>{
var name= req.params.name    
res.render('updatepage.ejs', {name})
})


router.post('/editdescription/:name', isLoggedIn, function(req,res){
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


    res.redirect('/products/updatepage')

})


router.get('/deleteitem/:id', isLoggedIn, (req,res)=>{
var id= req.params.id    
res.render('updatepage.ejs', {id})
})

router.post('/deleteitem/:id', isLoggedIn, function(req,res){
    var id = req.params.id

    
    myProducts.findByIdAndRemove({_id:id}, (err,data)=>{
        if (err) return console.log(err)
        console.log(data)

    })

        res.redirect('/products/updatepage')
})

router.get('/deletephoto/:id', isLoggedIn, (req,res)=>{
    var id = req.params.id
    var photo=req.body.photo
    res.render('updatepage.ejs', {data, id, photo})
})

router.post('/deletephoto/:id', isLoggedIn, function(req,res){
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


        res.redirect('/products/updatepage')
})



module.exports = router;
