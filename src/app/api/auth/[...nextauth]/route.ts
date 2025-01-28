import NextAuth, { Profile } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

// Define the GitHub profile type that extends the base Profile
interface GitHubProfile extends Profile {
  login: string
  // Add other GitHub-specific fields if needed
}

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          login: profile.login,
        }
      },
    }),
  ],
  pages: {
    signIn: '/admin',
    error: '/admin',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      const allowedUsers = process.env.ALLOWED_GITHUB_USERS?.split(',') || []
      // Type cast profile to GitHubProfile
      if (!allowedUsers.includes((profile as GitHubProfile)?.login)) {
        throw new Error('AccessDenied')
      }
      return true
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          login: token.login,
        },
      }
    },
    async jwt({ token, profile }) {
      if (profile) {
        token.login = (profile as GitHubProfile).login
      }
      return token
    },
  },
})

export { handler as GET, handler as POST } 