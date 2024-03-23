var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');

//--------BRANCH DATA--------
// View branches
router.get('/o/(:org_name)', function(req, res, next) {

  let org_name = req.params.org_name;

  dbConn.query(`SELECT * FROM branch WHERE org_name = "${org_name}" ORDER BY branch_location desc`, function(err, rows) {

     if (rows.length <= 0) {
          req.flash('error', 'No branches found');
          res.redirect('/admin');
      } else {
      // render to views/admin/index.ejs
      res.render('home/br_list',{data:rows, org_name:org_name});
      //res.status(200).json({ data: rows });
    }
  });
});

// Add Branch
router.get('/o/(:org_name)/add_br', function(req, res, next) {

    // render to add_br.ejs in home folder location
    res.render('home/add_br', {
        org_name : req.params.org_name,
        branch_location: '',
        branch_id: new Date().valueOf(),
        branch_address: '',
        branch_timings: '',
        branch_contact: '',
        branch_email: '',
        branch_instagram: '',
        branch_facebook:'',
        branch_img1:'',
        branch_img2:'',
        branch_img3:''
    })
})

// Add a new branch
router.post('/o/(:org_name)/add_br', function(req, res, next) {
      
    let org_name = req.params.org_name;
    let branch_location = req.body.branch_location;
    let branch_id = req.body.branch_id;
    let branch_address = req.body.branch_address;
    let branch_timings = req.body.branch_timings;
    let branch_contact = req.body.branch_contact;
    let branch_email = req.body.branch_email;
    let branch_instagram = req.body.branch_instagram;
    let branch_facebook = req.body.branch_facebook;
    let branch_img1 = req.body.branch_img1;
    let branch_img2 = req.body.branch_img2;
    let branch_img3 = req.body.branch_img3;
    let errors = false;

    if(org_name.length === 0 || branch_id.length === 0 || branch_location.length === 0 || branch_address.length === 0 ||branch_contact.length ===  0 || branch_email.length === 0 || branch_img1.length === 0 || branch_img2.length === 0 || branch_img3.length === 0 || branch_timings.length === 0) {
      
        errors = true;

        //set flash message
        req.flash('error', "Please enter details correctly");
        // render to add_br.ejs with flash message
        res.render(`home/add_br`, {
            org_name : org_name,
            branch_location : branch_location,
            branch_id : branch_id,
            branch_address : branch_address,
            branch_timings : branch_timings,
            branch_contact : branch_contact,
            branch_email : branch_email,
            branch_instagram : branch_instagram,
            branch_facebook : branch_facebook,
            branch_img1 : branch_img1,
            branch_img2 : branch_img2,
            branch_img3 : branch_img3
            
        })
      }

    // if no error
    if(!errors) {

        var form_data = {
            org_name : org_name,
            branch_location : branch_location,
            branch_id : branch_id,
            branch_address : branch_address,
            branch_timings : branch_timings,
            branch_contact : branch_contact,
            branch_email : branch_email,
            branch_instagram : branch_instagram,
            branch_facebook : branch_facebook,
            branch_img1 : branch_img1,
            branch_img2 : branch_img2,
            branch_img3 : branch_img3            
        }

        // insert query
        dbConn.query('INSERT INTO branch SET ? ', form_data, function(err, result) {
            // if(err) throw err
            if (err) {
                req.flash('error', err)

                // render to add_br.ejs in home folder
                res.render('home/add_br', {
                    branch_location : form_data.branch_location,
                    branch_id : form_data.branch_id,
                    branch_address : form_data.branch_address,
                    branch_timings : form_data.branch_timings,
                    branch_contact : form_data.branch_contact,
                    branch_email : form_data.branch_email,
                    branch_instagram : form_data.branch_instagram,
                    branch_facebook : form_data.branch_facebook,
                    branch_img1 : form_data.branch_img1,
                    branch_img2 : form_data.branch_img2,
                    branch_img3 : form_data.branch_img3                  
                })
            } else {                
                req.flash('success', 'Branch added successfully!');
                res.redirect('/home/o/'+ org_name);
            }
        })
    }
})

//Edit a Branch
router.get('/o/(:org_name)/(:branch_id)/edit_br', function(req, res, next) {

   let org_name = req.params.org_name;
   let branch_id = req.params.branch_id;

    dbConn.query(`SELECT * FROM branch WHERE branch_id = ${branch_id}`, function(err, rows, fields) {
        //if(err) throw err

        //if user not found
        if (rows.length <= 0) {
          req.flash('error', 'Branch not found with branch ID = ' + branch_id)
          res.redirect('/home/o/'+ org_name);
        }
        //if dish found
        else {
           //render to edit.ejs
           res.render('home/edit_br', {
               title: 'Edit Branch', 
               org_name: rows[0].org_name,
               branch_location: rows[0].branch_location,
               branch_id: rows[0].branch_id,
               branch_address: rows[0].branch_address,
               branch_timings: rows[0].branch_timings,
               branch_contact: rows[0].branch_contact,
               branch_email: rows[0].branch_email,
               branch_instagram: rows[0].branch_instagram,
               branch_facebook: rows[0].branch_facebook,
               branch_img1: rows[0].branch_img1,
               branch_img2: rows[0].branch_img2,
               branch_img3: rows[0].branch_img3
           })
       }
   })
})

//update Branch data
router.post('/o/(:org_name)/(:branch_id)/update_br', function(req, res, next) {

    let org_name = req.params.org_name;
    let branch_location = req.body.branch_location;
    let branch_id = req.params.branch_id;
    let branch_address = req.body.branch_address;
    let branch_timings = req.body.branch_timings;
    let branch_contact = req.body.branch_contact;
    let branch_email = req.body.branch_email;
    let branch_instagram = req.body.branch_instagram;
    let branch_facebook = req.body.branch_facebook;
    let branch_img1 = req.body.branch_img1;     
    let branch_img2 = req.body.branch_img2;
    let branch_img3 = req.body.branch_img3;
    let errors = false;

    if(branch_location.length === 0 || branch_address.length === 0 ||branch_contact.length ===  0 || branch_email.length === 0 || branch_img1.length === 0 || branch_img2.length === 0 || branch_img3.length === 0 || branch_timings.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter details correctly");
        // render to add.ejs with flash message
        res.render('home/edit_br', {
            org_name : org_name,
            branch_location : branch_location,
            branch_id : branch_id,
            branch_address : branch_address,
            branch_timings : branch_timings,
            branch_contact : branch_contact,
            branch_email : branch_email,
            branch_instagram : branch_instagram,
            branch_facebook : branch_facebook,
            branch_img1 : branch_img1,
            branch_img2 : branch_img2,
            branch_img3 : branch_img3
        })
    }

    // if no error
    if( !errors ) {   

        var form_data = {
            org_name : org_name,
            branch_location : branch_location,
            branch_id : branch_id,
            branch_address : branch_address,
            branch_timings : branch_timings,
            branch_contact : branch_contact,
            branch_email : branch_email,
            branch_instagram : branch_instagram,
            branch_facebook : branch_facebook,
            branch_img1 : branch_img1,
            branch_img2 : branch_img2,
            branch_img3 : branch_img3
        }
        // update query
        dbConn.query(`UPDATE branch SET ? WHERE branch_id = ${branch_id}`, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('home/edit_br', {
                    org_name : req.params.org_name,
                    branch_location : form_data.branch_location,
                    branch_id : req.params.branch_id,
                    branch_address : form_data.branch_address,
                    branch_timings : form_data.branch_timings,
                    branch_contact : form_data.branch_contact,
                    branch_email : form_data.branch_email,
                    branch_instagram : form_data.branch_instagram,
                    branch_facebook : form_data.branch_facebook,
                    branch_img1 : form_data.branch_img1,
                    branch_img2 : form_data.branch_img2,
                    branch_img3 : form_data.branch_img3
                })
            } else {
                req.flash('success', 'Branch successfully updated');
                res.redirect('/home/o/'+ org_name);
            }
        })
    }
})

// Delete branch
router.get('/o/(:org_name)/(:branch_id)/delete_br', function(req, res, next) {

    let org_name = req.params.org_name;
    let branch_id = req.params.branch_id;

    dbConn.query(`DELETE FROM branch WHERE branch_id = ${branch_id}`, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to menu page
            res.redirect('/home/o/'+ org_name)
        } else {
            // set flash message
            req.flash('success', 'Branch successfully deleted!')
            // redirect to menu page
            res.redirect('/home/o/'+ org_name)
        }
    })
})

//--------MENU OF BRANCH--------

// display menu page of a branch
router.get('/(:branch_id)/view_menu', function(req, res, next) {
    
    let branch_id = req.params.branch_id;
    
    dbConn.query(`SELECT b.org_name, b.branch_location, m.menu_name, m.menu_category, m.menu_type, m.menu_image_link, m.menu_price, m.menu_description FROM menu m, branch b WHERE b.branch_id = m.branch_id AND b.branch_id = ${branch_id} ORDER BY m.menu_type DESC, m.menu_price`,function(err,rows) {
        if (rows.length <= 0) {
          req.flash('error', 'Menu not found');
          res.redirect('/admin');
        } else {
            var data_arr = [];
            var o_name = rows[0].org_name;
            var b_loc = rows[0].branch_location;
            for(let i = 0; i < rows.length; i++){
              var m_name = rows[i].menu_name;
              var m_cat = rows[i].menu_category;
              var m_price = rows[i].menu_price;
              var m_type = rows[i].menu_type;
              var m_desc = rows[i].menu_description;
              var d_url = rows[i].menu_image_link;
              data_arr.push([m_name, m_cat, m_type, m_price, m_desc, d_url]);
            }
            res.render('home/menu_list',{data:data_arr, branch_id:branch_id, org_name:o_name, branch_location:b_loc});
        }
    });
});


// display add dish page
router.get('/(:branch_id)/add_menu', function(req, res, next) {    

    let branch_id = req.params.branch_id;

    // render to add_menu.ejs in home folder
    res.render('home/add_menu', {
        //org_name: req.params.org_name,
        branch_id: req.params.branch_id,
        menu_name: '',
        menu_category: '' ,
        menu_type:'',
        menu_image_link:'',
        menu_price:'',
        menu_description:''
    })
})

// add a new dish
router.post('/(:branch_id)/add_menu', function(req, res, next) {    

    let branch_id = req.params.branch_id;
    let menu_name = req.body.menu_name;
    let menu_category = req.body.menu_category;
    let menu_type = req.body.menu_type;
    let menu_image_link = req.body.menu_image_link;
    let menu_price = req.body.menu_price;
    let menu_description = req.body.menu_description;
    let errors = false;

    if(menu_name.length === 0 || menu_category.length === 0 || menu_type.length === 0 || menu_price.length === 0 || menu_image_link.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter details correctly");
        // render to add.ejs with flash message
        res.render('home/add_menu', {
            menu_name : menu_name,
            menu_category : menu_category,
            menu_type : menu_type,
            menu_image_link : menu_image_link,
            menu_price : menu_price,
            menu_description : menu_description
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            branch_id : req.params.branch_id,
            menu_name : menu_name,
            menu_category : menu_category,
            menu_type : menu_type,
            menu_image_link : menu_image_link,
            menu_price : menu_price,
            menu_description : menu_description
        }
        
        // insert query
        dbConn.query(`INSERT INTO menu SET ?`, form_data, function(err) {
            //if any error
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('home/add_menu', {
                    //org_name : req.params.org_name,
                    branch_id : req.params.branch_id,
                    menu_name : form_data.menu_name,
                    menu_category : form_data.menu_category,
                    menu_type : form_data.menu_type,
                    menu_image_link : form_data.menu_image_link,
                    menu_price : form_data.menu_price,
                    menu_description : form_data.menu_description
                })
            } 
            //If no error
            else {          
                req.flash('success', 'Dish successfully added');
                console.log(branch_id)
                res.redirect('/home/' + branch_id + '/view_menu');
            }
        })
    }
})


// Edit dish of a branch
router.get('/(:branch_id)/(:menu_name)/edit_menu', function(req, res, next) {

    let branch_id = req.params.branch_id;
    let menu_name = req.params.menu_name;
   
    dbConn.query(`SELECT * FROM menu WHERE branch_id = ${branch_id} AND menu_name = "${menu_name}"`, function(err, rows, fields) {
        if(err) throw err
         
        // if dish not found
        if (rows.length <= 0) {
            req.flash('error', 'Dish not found with dish name = ' + menu_name)
            res.redirect('home/'+branch_id +  '/view_menu')
        }
        // if dish found
        else {
            // render to edit.ejs
            res.render('home/edit_menu', {
                title: 'Edit Menu',
                branch_id: rows[0].branch_id,
                menu_name: rows[0].menu_name,
                menu_category: rows[0].menu_category,
                menu_type: rows[0].menu_type,
                menu_price: rows[0].menu_price,
                menu_image_link: rows[0].menu_image_link,
                menu_description: rows[0].menu_description
            })
        }
    })
})

// update menu data
router.post('/(:branch_id)/(:menu_name)/update_menu', function(req, res, next) {

    let branch_id = req.params.branch_id;
    let menu_name = req.params.menu_name;
    let menu_category = req.body.menu_category;
    let menu_type = req.body.menu_type;
    let menu_price = req.body.menu_price;
    let menu_image_link = req.body.menu_image_link;
    let menu_description = req.body.menu_description;
    let errors = false;

    if(menu_name.length === 0 || menu_category.length === 0 || menu_type.length === 0 || menu_price.length === 0 || menu_image_link.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter details correctly");
        // render to add.ejs with flash message
        res.render('home/edit_menu', {
            branch_id: req.params.branch_id,
            menu_name: req.params.menu_name,
            menu_category: menu_category ,
            menu_type: menu_type,
            menu_price: menu_price,
            menu_image_link: menu_image_link,
            menu_description: menu_description
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            branch_id: branch_id,
            menu_name: menu_name,
            menu_category: menu_category ,
            menu_type: menu_type,
            menu_price: menu_price,
            menu_image_link: menu_image_link,
            menu_description: menu_description
        }
        // update query
        dbConn.query(`UPDATE menu SET ? WHERE menu_name = "${menu_name}" AND branch_id = ${branch_id}`, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('home/edit_menu', {
                    branch_id: req.params.branch_id,
                    menu_name: req.params.menu_name,
                    menu_category: menu_category ,
                    menu_type: menu_type,
                    menu_price: menu_price,
                    menu_image_link: menu_image_link,
                    menu_description: menu_description
                })
            } else {
                req.flash('success', 'Dish successfully updated');
                res.redirect('/home/' + branch_id + '/view_menu');
            }
        })
    }
})

   
// Delete a dish
router.get('/(:branch_id)/(:menu_name)/delete_menu', function(req, res, next) {
  
    let branch_id = req.params.branch_id;
    let menu_name = req.params.menu_name;
     
    dbConn.query(`DELETE FROM menu WHERE branch_id = ${branch_id} AND menu_name = "${menu_name}"`, function(err, result) {
        //if error 
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to menu page
            res.redirect('/home/' + branch_id + '/view_menu')
        } else {
            // set flash message
            req.flash('success', 'Dish successfully deleted! Dish name = ' + menu_name)
            // redirect to menu page
            res.redirect('/home/' + branch_id + '/view_menu')
        }
    })
})

module.exports = router;