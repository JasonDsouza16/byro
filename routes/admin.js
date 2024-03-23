var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');

//--------ADMIN--------
// Display Organisation
router.get('/', function(req, res, next) {

  dbConn.query('SELECT * FROM organisation ORDER BY org_name desc', function(err, rows) {

    if (err) {
      req.flash('error', err);
      // render to views/admin/org_list.ejs
      res.render('admin/org_list', { data: '' });
    } else {
      // render to views/admin/org_list.ejs
      res.render('admin/org_list', { data: rows });
    }
  });
});

// Add Organisation
router.get('/add_org', function(req, res, next) {
  // render to add_org.ejs
  res.render('admin/add_org', {
    org_name: '',
    org_logo: '',
    org_about_us: '',
    org_tagline: '',
    org_landing_img: '',
    org_about_us_img: ''
  })
})

// add a new org
router.post('/add_org', function(req, res, next) {

  let org_name = req.body.org_name;
  let org_logo = req.body.org_logo;
  let org_about_us = req.body.org_about_us;
  let org_tagline = req.body.org_tagline;
  let org_landing_img = req.body.org_landing_img;
  let org_about_us_img = req.body.org_about_us_img;
  let errors = false;

  if (org_name.length === 0 || org_logo.length === 0 || org_about_us.length === 0 || org_landing_img.length === 0 || org_about_us_img.length === 0) {
    errors = true;

    // set flash message
    req.flash('error', "Please enter details correctly");

    res.render('admin/add_org', {
      org_name: org_name,
      org_logo: org_logo,
      org_about_us: org_about_us,
      org_tagline: org_tagline,
      org_landing_img: org_landing_img,
      org_about_us_img: org_about_us_img
    })
  }

  // if no error
  if (!errors) {

    var form_data = {
      org_name: org_name,
      org_logo: org_logo,
      org_about_us: org_about_us,
      org_tagline: org_tagline,
      org_landing_img: org_landing_img,
      org_about_us_img: org_about_us_img
    }

    // insert query
    dbConn.query('INSERT INTO organisation SET ?', form_data, function(err, result) {
      // if error
      if (err) {
        req.flash('error', err)

        // render to add_org.ejs
        res.render('admin/add_org', {
          org_name: form_data.org_name,
          org_logo: form_data.org_logo,
          org_about_us: form_data.org_about_us,
          org_tagline: form_data.org_tagline,
          org_landing_img: form_data.org_landing_img,
          org_about_us_img: form_data.org_about_us
        })
      } else {
        req.flash('success', 'Organisation successfully added');
        res.redirect('/admin');
      }
    })
  }
})

//Edit Organisation
router.get('/(:org_name)/edit', function(req, res, next) {

  let org_name = req.params.org_name;

  dbConn.query(`SELECT * FROM organisation WHERE org_name = "${org_name}"`, function(err, rows, fields) {
    if (err) throw err;

    //if organization not found
    if (rows.length <= 0) {
      req.flash('error', 'Organisation not found with name = ' + org_name)
      res.redirect('/admin')
    }
    //if organisation found
    else {
      //render to edit_org.ejs
      res.render('admin/edit_org', {
        title: 'Edit Organisation',
        org_name: rows[0].org_name,
        org_logo: rows[0].org_logo,
        org_about_us: rows[0].org_about_us,
        org_tagline: rows[0].org_tagline,
        org_landing_img: rows[0].org_landing_img,
        org_about_us_img: rows[0].org_about_us_img
      })
    }
  })
})

//Update Organisation
router.post('/(:org_name)/update', function(req, res, next) {

  let org_name = req.params.org_name;
  let org_logo = req.body.org_logo;
  let org_about_us = req.body.org_about_us;
  let org_tagline = req.body.org_tagline;
  let org_landing_img = req.body.org_landing_img;
  let org_about_us_img = req.body.org_about_us_img;
  let errors = false;

  if (org_name.length === 0 || org_logo.length === 0 || org_about_us.length === 0 || org_landing_img.length === 0 || org_about_us_img.length === 0) {
    errors = true;

    // set flash message
    req.flash('error', "Please enter details correctly");
    // render to edit_org.ejs with flash message
    res.render('admin/edit_org', {
      org_name: req.params.org_name,
      org_logo: org_logo,
      org_about_us: org_about_us,
      org_tagline: org_tagline,
      org_landing_img: org_landing_img,
      org_about_us_img: org_about_us_img
    })
  }

  // if no error
  if (!errors) {

    var form_data = {
      org_name: org_name,
      org_logo: org_logo,
      org_about_us: org_about_us,
      org_tagline: org_tagline,
      org_landing_img: org_landing_img,
      org_about_us_img: org_about_us_img
    }
    // update query
    dbConn.query(`UPDATE organisation SET ? WHERE org_name = "${org_name}"`, form_data, function(err, result) {
      //if(err) throw err
      if (err) {
        // set flash message
        req.flash('error', err)
        // render to edit.ejs
        res.render('admin/edit_org', {
          org_name: req.params.org_name,
          org_logo: form_data.org_logo,
          org_about_us: form_data.org_about_us,
          org_tagline: form_data.org_tagline,
          org_landing_img: form_data.org_landing_img,
          org_about_us_img: form_data.org_about_us
        })
      } else {
        req.flash('success', 'Organisation successfully updated');
        res.redirect('/admin');
      }
    })
  }
})

// Delete organisation
router.get('/(:org_name)/delete', function(req, res, next) {

  let org_name = req.params.org_name;

  dbConn.query(`DELETE FROM organisation WHERE org_name = "${org_name}"`, function(err, result) {
    // if error
    if (err) {
      // set flash message
      req.flash('error', err)
      // redirect to menu page
      res.redirect('/admin')
    } else {
      // set flash message
      req.flash('success', 'Organisation successfully deleted! Organisation name = ' + org_name)
      // redirect to menu page
      res.redirect('/admin')
    }
  })
})


module.exports = router;