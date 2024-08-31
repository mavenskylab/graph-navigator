import NextAuth, { Account, Session, User } from 'next-auth'
import { AdapterAccount } from 'next-auth/adapters'
import { ProviderType } from 'next-auth/providers/index'

declare module 'next-auth' {
  interface User {
    id: string
    name: string
    email: string
    emailVerified: Date | null
    image?: string
  }

  interface Account {
    id: string
    type: ProviderType
    provider: string
    providerAccountId?: string
    tokenId: string
    tokenType: string
    refreshToken: string
    accessToken: string
    exp: number
    scope: string
    sessionState: string
  }
}

declare module 'next-auth/adapters' {
  interface AdapterUser extends User {}

  interface AdapterAccount extends Account {
    user: {
      id: string
    }
  }

  interface AdapterSession extends Session {
    user: {
      id: string
    }
  }
}
