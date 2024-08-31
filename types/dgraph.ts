export interface User {
  id: string
  name: string
  image?: string
}

export interface AuthUser extends User {
  email: string
  emailVerified: Date | null
  password?: string
  accessToken?: string
  provider?: string
}

export interface ProviderUser {
  id: string
  accounts: Account[]
}

export interface Account {
  accessToken: string
}
