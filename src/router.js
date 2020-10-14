import Vue from 'vue';
import router from 'vue-router'
// import auth from './components/Auth'

Vue.use(router)

export default new router({
    routes: [
        {
          path: '/login',
          name: 'login',
        //   component: auth
        }
      ]
})