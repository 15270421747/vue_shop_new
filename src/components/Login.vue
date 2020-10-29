<template>
  <div class="login_container">
    <div class="login_box">

      <div class="avatar_box">
        <img src="../assets/img/timg1.jpg" />
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" label-width="0px" class="login_form" :model="loginForm" :rules="loginFormRules">
         <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input placeholder="请输入账号" v-model="loginForm.username" prefix-icon="el-icon-s-custom"></el-input>
        </el-form-item>
        <!-- 密码 -->
         <el-form-item prop="password">
          <el-input placeholder="请输入密码" v-model= "loginForm.password" prefix-icon="el-icon-unlock" type="password"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="bts">
          <el-button type="primary" @click="login('loginFormRef')" >登录</el-button>
          <el-button type="info" @click="reset('loginFormRef')">重置</el-button>
        </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
  export default{
       data(){
         return{
           // 这是登录表单的数据绑定对象
           loginForm:{
             username : 'admin',
             password : '123456'

           },
           // 表单的验证规则对象
           loginFormRules:{
             // 验证用户名是否合法
             username:[
                { required: true, message: '账号不能为空', trigger: 'blur' },
                 { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
             ],
             // 验证密码是否合法
             password:[
               { required: true, message: '密码不能为空', trigger: 'blur' },
                { min: 3, max: 7, message: '长度在 3 到 7 个字符', trigger: 'blur' }
             ]
           }
         }
       },
       methods:{
         // reset(form){
         //   console.log(this);
         //   this.$refs[form].resetFields()
         // },
          reset(form){
            console.log(this);
            this.$refs.loginFormRef.resetFields()
          },
          login(form){
            this.$refs[form].validate(async valid => {
              // console.log(valid);
              // if(valid){
              //   this.$router.push("/home");
              // }else{
              //   this.$message.error('登录失败');
              // }
               if(!valid) return;
               const {data:res}= await this.$http.post('login',this.loginForm);  //要把这个函数修饰为async
                if(res.meta.status!==200) return this.$message.error('登录失败')
                // console.log(res)
                this.$message.success('登录成功')
                window.sessionStorage.setItem('token',res.data.token)
                this.$router.push('/Home')
            })
          }
       }

  }
</script>

<style lang="less" scoped>
  .login_container{
    background-color: #2b4b6b;
    height: 100%;
  }
  .login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);


  }
  .avatar_box img{
    height: 130px;
    width: 130px;
    // border: #dadada 1px solid;
    border-radius: 50%;
    // padding: 6px;
    box-shadow: 0 0 10px #ddd;
    // background-color: white;
  }
  .avatar_box{
    padding: 10px;
    overflow: hidden;
    height: 130px;
    width: 130px;
    border: #dadada 1px solid;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: white;
    box-shadow: 0 0 10px #ddd;
  }
  .bts{
  display: flex;
  justify-content: flex-end;
  }
  .login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
</style>
