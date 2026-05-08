import passport from 'passport'
import { Strategy as GitHubStrategy } from 'passport-github2'
import User from '../models/User.js'

export const configurePassport = () => {
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET || !process.env.GITHUB_CALLBACK_URL) {
    return
  }

  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    scope: ['read:user', 'user:email', 'repo'],
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ githubId: profile.id }).select('+githubAccessToken')
      if (!user) {
        user = await User.create({
          githubId: profile.id,
          username: profile.username,
          email: profile.emails?.[0]?.value,
          avatarUrl: profile.photos?.[0]?.value,
          githubAccessToken: accessToken,
        })
      } else {
        user.githubAccessToken = accessToken
        await user.save()
      }
      done(null, user)
    } catch (err) {
      done(err)
    }
  }))
}
