
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'CUSTOMER' | 'TECHNICIAN' | 'MANAGER'

export type UserStatus = 'ACTIVE' | 'BLOCKED' | 'DELETED'


export type AuthProvider = 'CREDENTIAL' | 'GOOGLE' | 'FACEBOOK'


export type RegisterRole = 'CUSTOMER' | 'TECHNICIAN'

export interface IUserLogin {
  email: string;
  password: string;
}


export interface LoggedUser {
  name: string
  email: string
  authProvider: AuthProvider
  role: UserRole
  emailVerified: boolean
  googleId?: string
  facebookId?: string
  profileImg?: string
  profileImgPublicId?: string
  status: UserStatus
} 

