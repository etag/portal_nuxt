/*
* See extending axios documentation for more details
* https://axios.nuxtjs.org/extend
*/

const UNAUTHORIZED = 401;

export default function ({ $axios }) {
  $axios.defaults.xsrfCookieName = 'csrftoken'
  $axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"
  //$axios.defaults.withCredentials = true

  // The following catches 401 unauthorized response
  $axios.interceptors.response.use(
    response => response,
    error => {
      const {status} = error.response;
      if (status === UNAUTHORIZED) {
        console.log('401 detected');
        // TODO: get notification working
        // $notify({group: 'alerts', text: 'Unable to access item!'})
      }
      return Promise.reject(error);
    }
  )
}
