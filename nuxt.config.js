
export default {
  mode: 'spa',
  env: {
    // baseUrl: 'http://localhost'
    baseUrl: 'https://head.ouetag.org'
  },
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Auth module configuration
  */
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/api/api-token-auth/?format=json',
            method: 'post',
            propertyName: 'token',
            //withCredentials: true,
            //xsrfCookieName: 'csrftoken',
            //xsrfHeaderName: "X-CSRFTOKEN",
            headers: {
              'Content-Type': 'application/json',
            //  'Access-Control-Allow-Origin': '*'
              }
          },
          //logout: {
          //  url: '/api/api-auth/logout/',
          //  method: 'post',
          //  propertyName: false
          //  withCredentials: true,
          //  xsrfCookieName: 'csrftoken',
          //  xsrfHeaderName: "X-CSRFTOKEN"
          //},
          user: {
            url: '/api/user/?format=json',
            method: 'get',
            propertyName: false,
            tokenRequired: true,
            tokenType: 'JWT',
            //withCredentials: true,
            //xsrfCookieName: 'csrftoken',
            //xsrfHeaderName: "X-CSRFTOKEN"
          },
        },
        tokenRequired: true,
        tokenType: 'JWT',
        watchLoggedIn: true,
        rewriteRedirects: true,
        redirect: {
          home: "/about",
          logout: "/about"
        }
      }
    }
  },
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/axios'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://auth.nuxtjs.org/
    '@nuxtjs/auth',
    // Doc: ???
    '@nuxtjs/proxy',
    // Doc: ???
    'nuxt-leaflet'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    proxy: true,
    //baseURL: 'http://localhost'
  },
  /*
  ** Proxy configuration
  */
  proxy: {
    //'/api': 'http://localhost'
    '/api': 'http://head.ouetag.org'
  },
  /*
  ** Router configuration
  */
  router: {
    middleware: ['auth']
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
