import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  // console.log("Cookies.get",Cookies.get(TokenKey))
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  // console.log("Cookies.set",token)
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
