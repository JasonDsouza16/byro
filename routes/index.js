var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');
var path = require('path');
var app = express();
var cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true
});

//Cloudinary Transformation
var retImage = function (img_name, width_arr, flag) {
  let url_arr = [];
  for(let i = 0; i < width_arr.length; i++) {
    if(flag === "normal") {
      w_param = ` ${width_arr[i]}w`
    }
    else if (flag === "dish") {
      w_param = ` ${i+1}x`
    }
    else if (flag === "empty") {
      w_param = ''
    }
    else {
      throw(err);
    }
    url_arr.push(cloudinary.url(img_name, {quality: "auto", width: width_arr[i], crop: "scale", fetch_format: "auto"}) + w_param);
  }
  return url_arr.join();
}

//List all the organisations 
router.get('/', function(req, res, next) {
  
  dbConn.query(`SELECT org_name, org_logo, org_about_us from organisation`, function(err, rows, fields) {
    if (err) throw err;
    if (rows.length <= 0) {
      req.flash('error', 'Something went wrong!')
      res.redirect('/')
    } else {
      //Function call
      const arr = [208, 679, 1016];
      var data_arr = [];
      for(let i = 0; i < rows.length;i ++){
        var o_name = rows[i].org_name;
        var about = rows[i].org_about_us;
        var logo = rows[i].org_logo;
        var logo_url = retImage(logo.match(/v.*[0-9].*/),arr,"normal");
        var logo_url_src = retImage(logo.match(/v.*[0-9].*/),[1016],"normal");
        data_arr.push([o_name, about, logo_url, logo_url_src]);
      }
      res.render('frontend/org',{ data: data_arr});
    }
  });
});

//List the branches of a organisation
router.get('/o/(:org_name)', function(req, res, next) {

  let org_name = req.params.org_name;
  dbConn.query(`SELECT o.org_name, o.org_logo, o.org_landing_img, o.org_tagline, o.org_about_us, o.org_about_us_img, b.branch_location, b.branch_contact, b.branch_email ,b.branch_img1 FROM organisation o,branch b WHERE b.org_name = "${org_name}" AND o.org_name = "${org_name}"`, function(err, rows, fields) {
    if (err) throw err;
    if (rows.length <= 0) {
      req.flash('error', 'Something went wrong!')
      res.redirect('/')
    } else {
      //Function call
      const arr = [320, 563, 770, 956, 1109, 1283, 1439, 1508, 1712, 1864, 1993, 2115, 2246, 2377, 2506, 2560];
      var data_arr = [];
      var o_name = rows[0].org_name;
      var o_about = rows[0].org_about_us;
      var o_tagline = rows[0].org_tagline;
      var o_logo = rows[0].org_logo;
      var o_landing = rows[0].org_landing_img;
      var ld_url = retImage(o_landing.match(/v.*[0-9].*/),arr,"normal");
      var ld_url_src = retImage(o_landing.match(/v.*[0-9].*/),[2560],"normal");
      var about_img = rows[0].org_about_us_img;
      var about_img_link = retImage(about_img.match(/v.*[0-9].*/),arr,"normal");
      var about_img_src = retImage(about_img.match(/v.*[0-9].*/),[2560],"normal");
      for(let i = 0; i < rows.length; i++){
        var b_loc = rows[i].branch_location;
        var b_card = rows[i].branch_img1;
        var b_contact = rows[i].branch_contact;
        var b_email = rows[i].branch_email;
        var b_card_url = retImage(b_card.match(/v.*[0-9].*/),[208, 679, 1016],"normal");
        var b_card_src = retImage(b_card.match(/v.*[0-9].*/),[1016],"normal");
        data_arr.push([b_loc, b_contact, b_email, b_card_url, b_card_src]);
      }
      res.render('frontend/branch', { data: data_arr, org_name: o_name, org_about_us : o_about, org_tagline: o_tagline, org_logo: o_logo, org_landing: ld_url, org_landing_src: ld_url_src, org_about_img: about_img_link, org_about_img_src: about_img_src});
    }
  });
});

//Give branch details of a particular branch of a particular organisation
router.get('/o/(:org_name)/(:branch_location)', function(req, res, next) {

  let org_name = req.params.org_name;
  let branch_location = req.params.branch_location;

  dbConn.query(`SELECT o.org_name, o.org_logo, o.org_about_us, o.org_tagline, o.org_about_us_img, b.branch_location, b.branch_address, b.branch_contact, b.branch_email, b.branch_instagram, b.branch_facebook, b.branch_img1, b.branch_img2, b.branch_img3, b.branch_timings FROM branch b, organisation o WHERE b.org_name = o.org_name AND o.org_name = "${org_name}" AND b.branch_location = "${branch_location}"`, function(err, rows, fields) {
    if (err) throw err;
    if (rows.length <= 0) {
      req.flash('error', 'Branch not found!')
      res.redirect('/o/' + org_name)
    } else {
      //Function call
      var b_time =  rows[0].branch_timings;
      var b_add =  rows[0].branch_address;
      var br_i1 = rows[0].branch_img1;
      var br_i2 = rows[0].branch_img2;
      var br_i3 = rows[0].branch_img3;
      var about_img = rows[0].org_about_us_img;
      const b_arr = [320, 563, 770, 956, 1109, 1283, 1439, 1508, 1712, 1864, 1993, 2115, 2246, 2377, 2506, 2560];
      var about_img_link = retImage(about_img.match(/v.*[0-9].*/),b_arr,"normal");
      var about_img_src = retImage(about_img.match(/v.*[0-9].*/),[2560],"normal");
      var br_img1_url = retImage(br_i1.match(/v.*[0-9].*/),b_arr,"normal");
      var br_img2_url = retImage(br_i2.match(/v.*[0-9].*/),b_arr,"normal");
      var br_img3_url = retImage(br_i3.match(/v.*[0-9].*/),b_arr,"normal");
      var br_i1_src = retImage(br_i1.match(/v.*[0-9].*/),[2560],"normal");
      var br_i2_src = retImage(br_i2.match(/v.*[0-9].*/),[2560],"normal");
      var br_i3_src = retImage(br_i3.match(/v.*[0-9].*/),[2560],"normal");
      res.render('frontend/org_br', { data: rows, br_img1: br_img1_url, br_img1_src: br_i1_src, br_img2: br_img2_url, br_img2_src: br_i2_src, br_img3: br_img3_url, br_img3_src: br_i3_src, branch_address: b_add.trim(), branch_timings: b_time.trim(), org_about_img: about_img_link, org_about_img_src: about_img_src});
    }
  });
});

//Menu of a Branch Based on Category sorted by type
router.get('/o/(:org_name)/(:branch_location)/menu/(:menu_category)', function(req, res, next) {

  let o_name = req.params.org_name;
  let b_location = req.params.branch_location;
  let m_category = req.params.menu_category;
  
  dbConn.query(`SELECT o.org_name, o.org_logo, b.branch_location, b.branch_contact, b.branch_email, b.branch_instagram, b.branch_facebook, b.branch_timings, b.branch_address, b.branch_contact, m.menu_name, m.menu_category, m.menu_type, m.menu_image_link, m.menu_price, m.menu_description FROM branch b, organisation o, menu m WHERE o.org_name = b.org_name AND o.org_name = '${o_name}' AND b.branch_id = m.branch_id AND b.branch_location = '${b_location}' AND m.menu_category = '${m_category}' ORDER BY menu_type DESC, menu_price`, function(err, rows) {

    if (err) throw err; 
    if (rows.length <= 0) {
      req.flash('error', 'Menu unavailable!')
      res.redirect('/o/' + o_name + '/' + b_location)
    } else {
      //Function call
      const arr = [150,300];
      var data_arr = [], temp_type_arr = [];
      var o_logo = rows[0].org_logo;
      var b_fb = rows[0].branch_facebook;
      var b_ig = rows[0].branch_instagram;
      var b_email = rows[0].branch_email;
      var b_timing = rows[0].branch_timings;
      var b_address = rows[0].branch_address;
      var b_contact = rows[0].branch_contact;

      for(let i = 0; i < rows.length; i++){
        var m_name = rows[i].menu_name;
        var m_price = rows[i].menu_price;
        var m_type = rows[i].menu_type;
        var m_desc = rows[i].menu_description;
        var d_url = rows[i].menu_image_link;
        var dish_url = retImage(d_url.match(/v.*[0-9].*/),[150],"dish");
        var dish_url_src = retImage(d_url.match(/v.*[0-9].*/),arr,"dish");
        data_arr.push([m_name, m_price, m_type, m_desc, dish_url, dish_url_src]);
      }

      res.render('frontend/menu',{data: data_arr, org_name: o_name, org_logo: o_logo, branch_location : b_location, branch_facebook: b_fb, branch_instagram: b_ig, branch_email: b_email, branch_timings: b_timing.trim(), branch_address: b_address.trim(), branch_contact: b_contact, menu_category: m_category.toUpperCase()});
    }
  });
});

//Get images for album of a particular branch
router.get('/o/(:org_name)/(:branch_location)/album', function(req, res, next) {

  let o_name = req.params.org_name;
  let b_location = req.params.branch_location;
  //let m_category = req.params.menu_category;
  
  dbConn.query(`SELECT o.org_name, o.org_logo, b.branch_location, b.branch_contact, b.branch_email, b.branch_instagram, b.branch_facebook, b.branch_timings, b.branch_address, m.menu_image_link FROM branch b, organisation o, menu m WHERE o.org_name = b.org_name AND o.org_name = "${o_name}" AND b.branch_id = m.branch_id AND b.branch_location = "${b_location}" ORDER BY RAND () LIMIT 9`, function(err, rows) {

    if (err) throw err; 
    if (rows.length <= 0) {
      req.flash('error', 'Album not available!')
      res.redirect('/o/' + o_name + '/' + b_location)
    }
    else {
      //Function call
      const arr = [300,600,900];
      var data_arr = [], temp_type_arr = [];
      var o_logo = rows[0].org_logo;
      var b_fb = rows[0].branch_facebook;
      var b_ig = rows[0].branch_instagram;
      var b_email = rows[0].branch_email;
      var b_timing = rows[0].branch_timings;
      var b_address = rows[0].branch_address;
      var b_contact = rows[0].branch_contact;

      for(let i = 0; i < rows.length; i++){
        var d_url = rows[i].menu_image_link;
        var l_url = retImage(d_url.match(/v.*[0-9].*/),[900],"empty");
        var t_url = retImage(d_url.match(/v.*[0-9].*/),[300],"empty");
        var t_url_src = retImage(d_url.match(/v.*[0-9].*/),arr,"dish");
        data_arr.push([l_url,t_url,t_url_src]);
      }

      //res.status(200).json({data: data_arr, org_name: o_name, org_logo: o_logo, branch_location : b_location, branch_facebook: b_fb, branch_instagram: b_ig, branch_email: b_email, branch_timings: b_timing.trim(), branch_address: b_address.trim(), branch_contact: b_contact});

      res.render('frontend/album',{data: data_arr, org_name: o_name, org_logo: o_logo, branch_location : b_location, branch_facebook: b_fb, branch_instagram: b_ig, branch_email: b_email, branch_timings: b_timing.trim(), branch_address: b_address.trim(), branch_contact: b_contact});
    }
  });
});

module.exports = router;