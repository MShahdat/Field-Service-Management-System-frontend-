import apiClient from "@/lib/apiClient"


export const userLogin = (payload: {
  email: string,
  password: string
}) => {
  return apiClient('/auth/login', {
    method: 'POST',
    body: payload
  })
}


export const getMe = () => {
  return apiClient('/auth/me')
}

export const googleAuth = () => {
  return apiClient('/auth/google')
}




