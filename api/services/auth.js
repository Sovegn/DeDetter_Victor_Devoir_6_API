const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

exports.login = async (req, res, next) => {
  const { email, password } = req.body; 

  try {
    const user = await User.findOne({ email: email }, '-__v -createdAt -updatedAt');

    if (user) {
      bcrypt.compare(password, user.password, function(err, response) {
        if (err) {
          throw new Error(err);
        }
        if (response) {
          // Update last login time
          user.lastLogin = Date.now();
          user.save();
          
          const userData = {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
          };

          const expireIn = 24 * 60 * 60;
          const token = jwt.sign({
            user: userData
          },
          SECRET_KEY,
          {
            expiresIn: expireIn
          });

          res.cookie('token', token, { 
            httpOnly: true,
            maxAge: expireIn * 1000
          });
          
          // For API requests
          res.header('Authorization','Bearer ' + token);

          // Redirect to dashboard for form submissions
          if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
            return res.redirect('/dashboard');
          }
          
          return res.status(200).json('login_success');
        }
        
        return res.status(403).json('wrong_credentials');
      });
    } else {
      return res.status(404).json('user_not_found');
    }
  } catch (error) {
    return res.status(501).json(error);
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  return res.redirect('/');
};