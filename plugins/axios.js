/*
* See extending axios documentation for more details
* https://axios.nuxtjs.org/extend
*/

export default function ({ $axios }) {
  $axios.defaults.xsrfCookieName = 'csrftoken'
  $axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"
  //$axios.defaults.withCredentials = true
}
