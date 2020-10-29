import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Roles from '../components/power/Roles.vue'
import Rights from '../components/power/Rights.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import GoodsList from '../components/goods/GoodsList.vue'
Vue.use(VueRouter)

const routes = [
  {path:'/',redirect:'/Login'},
  {path:'/Login', component:Login},
  {
    path:'/Home',
    component:Home,
    redirect:'/Users',
    children:[
      {path:'/Welcome',component:Welcome},
      {path:'/Users',component:Users},
      {path:'/Roles',component:Roles},
      {path:'/Rights',component:Rights},
      {path:'/categories',component:Cate},
      {path:'/params',component:Params},
      {path:'/goods',component:GoodsList},
      

    ]
    },
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to,from,next) => {
  //to 将要访问的路径
  //from 代表从哪个路径跳过来
  //next 是一个函数，表示放行
  //next() 放行  next('/login') 强制跳转
  if(to.path === '/login') return next()
  //获取token
  const tokener = window.sessionStorage.getItem('token')
  if(!tokener) return next('/login')
  next()
})

export default router
