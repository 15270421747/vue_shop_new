<template>
  <el-container>
    <el-header>
      <div class="header">
        <img src="../assets/img/heima.png"/>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" plain @click='loginout'>退出</el-button>
      </el-header>
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside width="200px">

        <el-menu background-color="#cae5d0" active-text-color="#1788f1" unique-opened :router="true" :default-active="activePath" >
              <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id" >
                <template slot="title">
                  <i :class="iconList[item.id]"></i>
                  <span>{{item.authName}}</span>
                </template>

                  <el-menu-item :index="'/'+subitem.path" v-for="subitem  in item.children" :key="subitem.id" @click="saveNavState('/'+subitem.path)" >
                   <template slot="title">
                     <i class="el-icon-menu"></i>
                     <span>{{subitem.authName}}</span>
                   </template>

                  </el-menu-item>
              </el-submenu>
>

            </el-menu>
      </el-aside>


      <el-main >
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>




</template>

<script>
  export default{
    data(){
      return{
        menuList:[],
        iconList:{
          '125':'el-icon-s-custom',
          '103':'el-icon-setting',
          '101':'el-icon-goods',
          '102':'el-icon-shopping-cart-2',
          '145':'el-icon-paperclip',
        },
        //被激活的链接路径
        activePath:""
      }
    },
    created() {
      this.getmenuList()
      this.activePath = window.sessionStorage.getItem('activePath')

    },
    methods:{
      loginout(){
        window.sessionStorage.clear();
        this.$router.push('/login')
      },

      //获取所有的左侧菜单信息
     async getmenuList(){
      const {data:res}= await this.$http.get('menus')
      if(res.meta.status!==200) return this.$message.error('获取菜单失败')
      // console.log(res)
      this.menuList = res.data
      },
      //保存链接的激活状态
      saveNavState(activePath){
        window.sessionStorage.setItem('activePath',activePath)
        this.activePath = activePath
      }
    }
  }
</script>

<style scoped>
  .el-header{
    background-color: cornflowerblue;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #FFFFFF;
    font-size: 20px;
  }
  .el-aside{
    background-color: coral;
  }
  .el-main{
    background-color: white;
  }
  .el-container{
    height: 100%;
  }
  .header{
    display: flex;
    align-items: center;
  }
  .header span{
    margin-left: 20px;
  }
  .el-menu{
    border-right: none;
  }
  .el-main{
    background-color: aliceblue;
  }
</style>
