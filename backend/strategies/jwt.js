const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'SECRET_KEY'; //normally store this in process.env.secret

module.exports = new JwtStrategy(opts, async (jwt_payload, done) => {
    const user = await User.findOne({ username: jwt_payload.username });
    if (!user) {
        return done(null, false, { message: 'Incorrect username' });
    }
    if (jwt_payload.password !== user.password) return done(null, false, { message: 'Incorrect password' });

    return done(null, true);
});
