import Cookies from 'js-cookie'

const _key = 'SmsCodeTime'

export function getSmsCodeTime() {
  return Cookies.get(_key)
}

export function setSmsCodeTime(time) {
  return Cookies.set(_key, time)
}

export function removeSmsCodeTime() {
  return Cookies.remove(_key)
}
