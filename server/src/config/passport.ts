import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User, { UserRole } from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'dummy',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy',
    callbackURL: process.env.CALLBACK_URL || '/api/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value || '';
      let user = await User.findOne({ 
        $or: [
          { googleId: profile.id },
          { email: email }
        ]
      });

      if (user) {
        // If user exists with this email but no googleId, we can link it
        if (!user.googleId) {
          user.googleId = profile.id;
          if (!user.avatar) user.avatar = profile.photos?.[0]?.value || '';
          await user.save();
        }
        return done(null, user);
      }

      const firstName = profile.name?.givenName || profile.displayName.split(' ')[0] || '';
      const lastName = profile.name?.familyName || profile.displayName.split(' ').slice(1).join(' ') || '';

      user = await User.create({
        googleId: profile.id,
        email: email,
        name: profile.displayName,
        firstName,
        lastName,
        avatar: profile.photos?.[0]?.value || '',
        role: UserRole.USER,
        isEmailVerified: true
      });

      return done(null, user);
    } catch (error) {
      return done(error as Error, undefined);
    }
  }
));

// We are using JWT, so we don't necessarily need session serialization
// but passport might require it for some flows or just to be safe.
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
