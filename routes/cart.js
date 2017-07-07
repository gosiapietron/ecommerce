var express = require('express');
var router = express.Router();
var myPurchases = require('../models/schemabuy');
var myProducts = require('../models/schemaecom');
var isLoggedIn = require('../protect middleware/protect');

router.get('/buy/:name/:price/:availability', (req,res)=>{
var name= req.params.name
var price= req.params.price
var availability= req.params.availability
var quantity=1 

    myPurchases.find({},(e, data)=>{
        if(e || (!data)){
            return console.log("nothing found!", err)
        }else{

        res.render('buy.ejs', {data, name, price, quantity, availability})
        
        }
    })
})


router.post('/buy/:name/:price/:availability', isLoggedIn, function(req,res){
    var name= req.params.name
    var price= req.params.price
    var availability= req.params.availability
    var quantity=1
     
            
            myPurchases.create({name:name, price:price, quantity:quantity, availability:availability},(err, data)=>{
            if(err) return console.log('err', err)
            console.log('succesfully saved', data)
                     
                
        res.redirect('/cart/buy/:name/:price/:availability')
    })
})

router.get('/mycart', isLoggedIn, (req,res)=>{    
res.redirect('/cart/buy/:name/:price/:availability')
})

router.post('/:name/:availability/plus', isLoggedIn, function(req,res){
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


    res.redirect('/cart/buy/:name/:price/:availability')

})

router.post('/:name/:id/minus', isLoggedIn, function(req,res){
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


    res.redirect('/cart/buy/:name/:price/:availability')

})

router.get('/checkout/:sum', isLoggedIn, (req,res)=>{ 
var sum= req.params.sum   
res.render('checkout.ejs', {sum})
})

router.post('/checkout/:sum', isLoggedIn, function(req,res){
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



module.exports = router;
