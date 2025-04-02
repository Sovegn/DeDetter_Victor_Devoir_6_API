const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

exports.checkJWT = async (req, res, next) => {
    // Check for token in headers or cookies
    let token = req.headers['authorization'] || req.headers['x-access-token'] || req.cookies.token;
    
    if(!!token && token.startsWith('Bearer ')){
        token = token.slice(7, token.length);
    }

    if(token){
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if(err){
                // For web views, redirect to login
                if (req.headers['accept'] && req.headers['accept'].includes('text/html')) {
                    return res.redirect('/');
                }
                return res.status(401).json('token_not_valid');
            } else {
                req.decoded = decoded;

                const expiresIn = 24 * 60 * 60;
                const newToken = jwt.sign({
                    user: decoded.user
                },
                SECRET_KEY,
                {
                    expiresIn: expiresIn
                });

                // Set both header and cookie for new token
                res.header('Authorization','Bearer ' + newToken);
                res.cookie('token', newToken, { 
                    httpOnly: true,
                    maxAge: expiresIn * 1000
                });

                next();
            }
        });
    } else {
        // For web views, redirect to login
        if (req.headers['accept'] && req.headers['accept'].includes('text/html')) {
            return res.redirect('/');
        }
        return res.status(401).json('token_required');
    }
}