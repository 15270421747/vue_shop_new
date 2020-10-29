<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Welcome' }" >首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>


        <el-card >
         <el-row :gutter="20">
           <el-col :span="10">
                <!-- 搜索头 -->
              <el-input placeholder="请输入内容"  v-model="queryInfo.query" clearable @clear="getUserList">
                 <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
               </el-input>

           </el-col>
           <el-col :span="4">
             <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
           </el-col>
         </el-row>
         <!-- 用户数据 -->
          <el-table :data="userList" style="width: 100%" border>
            <el-table-column type="index"></el-table-column>
               <el-table-column prop="username" label="姓名" width="180"></el-table-column>
               <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
               <el-table-column prop="mobile" label="电话"></el-table-column>
               <el-table-column prop="role_name" label="角色"></el-table-column>
               <el-table-column  label="状态">
                 <!-- 获取整个一行的数据保存再scope.row当中 -->
                 <template slot-scope="scope">
                   <el-switch  v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
                   </el-switch>
                 </template>
               </el-table-column>
               <!-- 操作一栏的按钮 -->
               <el-table-column  label="操作">
                 <template slot-scope="scope">
                 <el-button type="primary" icon="el-icon-edit" circle @click="editUsers(scope.row.id)"></el-button>
                   <el-button type="danger" icon="el-icon-delete" circle @click= "deleteUser(scope.row.id)"></el-button>
                    <el-button type="warning" icon="el-icon-setting" circle @click="setRoleDialog(scope.row)"></el-button>
                   </template>

               </el-table-column>
             </el-table>
             <!-- 底部页码 -->
              <el-pagination
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="queryInfo.pagenum"
                   :page-sizes="[1, 2, 3, 4]"
                   :page-size="queryInfo.pagesize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total">
                 </el-pagination>
         </el-card>
         <!-- 弹出对话框 -->
         <el-dialog  title="添加用户" :visible.sync="dialogVisible" width="30%" @closed="addDialogClosed">
           <!-- 表单项 -->
           <el-form :model="addUserForm" :rules="addUserFormRules" ref="addUserFormRef" label-width="70px" >
             <el-form-item label="用户名:" prop="username">
               <el-input v-model="addUserForm.username"></el-input>
             </el-form-item>
             <el-form-item label="密码:" prop="password">
               <el-input v-model="addUserForm.password" type="password"></el-input>
             </el-form-item>
             <el-form-item label="邮箱:" prop="email">
               <el-input v-model="addUserForm.email"></el-input>
             </el-form-item>
             <el-form-item label="电话:" prop="mobile">
               <el-input v-model="addUserForm.mobile"></el-input>
             </el-form-item>

            </el-form>
           <!-- 对话框底部区域 -->
           <span slot="footer" class="dialog-footer">
             <el-button @click="dialogVisible = false">取 消</el-button>
             <el-button type="primary"  @click="addUsers">确 定</el-button>
           </span>
         </el-dialog>


         <!-- 修改用户数据对话框 -->
         <el-dialog  title="修改用户数据对话框" :visible.sync="editDialogVisible" width="30%" @closed="editDialogClosed">
           <!-- 表单项 -->
           <el-form :model="editUserForm" :rules="addUserFormRules" ref="editUserFormRef" label-width="70px" >
             <el-form-item label="用户名:" >
               <el-input v-model="editUserForm.username" disabled></el-input>
             </el-form-item>
             <el-form-item label="邮箱:" prop="email">
               <el-input v-model="editUserForm.email"></el-input>
             </el-form-item>
             <el-form-item label="电话:" prop="mobile">
               <el-input v-model="editUserForm.mobile"></el-input>
             </el-form-item>

            </el-form>
           <!-- 对话框底部区域 -->
           <span slot="footer" class="dialog-footer">
             <el-button @click="editDialogVisible = false">取 消</el-button>
             <el-button type="primary"  @click="iseditUsers(editUserForm.id)">确 定</el-button>
           </span>
         </el-dialog>

         <!-- 弹出角色设置的对话框 -->
         <el-dialog
           title="设置角色"
           :visible.sync="setRoleDialogVisible"
           width="50%" @close= "setRoleDialogClose">
           <div>
             <p>当前用户：{{userInfo.username}}</p>
             <p>当前角色：{{userInfo.role_name}}</p>
             <p>分配新角色：
             <template>
            <el-select v-model="value" placeholder="请选择" >
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
             </el-option>
            </el-select>
              </template></p>
           </div>
           <span slot="footer" class="dialog-footer">
             <el-button @click="setRoleDialogVisible = false">取 消</el-button>
             <el-button type="primary" @click="confirmSetRoleDialog">确 定</el-button>
           </span>
         </el-dialog>

  </div>
</template>

<script>
  export default{
    data() {
      return{
        //获取用户列表的参数对象
          queryInfo:{
            query: '',
            pagenum:1,
            pagesize: 2
          },

          userList:[],
          total:0,
           dialogVisible:false,

          addUserForm:{
                username:'',
                password:'',
                email:'',
                mobile:'',
          },
            addUserFormRules:{
                      username:[
                        {required: true,message:'用户名不能为空',trigger:'blur'},
                         { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
                      ],
                       password:[
                         { required: true, message: '密码不能为空', trigger: 'blur' },
                          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
                       ],
                       email:[
                          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                               { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                       ],
                       mobile:[
                         { required: true, message: '电话号码不能为空', trigger: 'blur' },
                          { min: 11, max: 11, message: '长度为11个字符', trigger: 'blur' }
                       ]
            },
            editDialogVisible:false,
            editUserForm:{
              username:'',
              mobile:'',
              email:'',
              id:''
            },
            setRoleDialogVisible:false,
            userInfo:{},
            rolesList:[],
            value: '',
            setRoleId:''
      }

    },
     created() {
       this.getUserList()
    },
    methods:{
      async getUserList(){
        const  {data: res}= await this.$http.get('users',
        {params:this.queryInfo})
        // console.log(res)
        if(res.meta.status!==200) return this.$message.error('获取列表失败')
          this.userList = res.data.users
          this.total = res.data.total
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize){
              this.queryInfo.pagesize = newSize
              this.getUserList()
    },
    // 页码值pagenum发生改变的事件
    handleCurrentChange(newPage){
              this.queryInfo.pagenum = newPage
              this.getUserList()
    },
     async userStateChange(queryInfo){
      console.log(queryInfo)
     const {data: res} = await this.$http.put(`users/${queryInfo.id}/state/${queryInfo.mg_state}`)
     console.log(res)
     if(res.meta.status!==200){
      return queryInfo.mg_state = !queryInfo.mg_state
              this.$message.error("用户状态修改失败")

     }
     console.log(res.data.mg_state)
    },
    addDialogClosed(){
      this.$refs.addUserFormRef.resetFields()

    },
    editDialogClosed(){
      this.$refs.editUserFormRef.resetFields()
    },
    addUsers(){

      this.$refs.addUserFormRef.validate(async valid =>{
        // console.log(valid)
        if(!valid) return
        // 如果valid值为true,说明预校验成功,接下来进行表单提交
        const {data:res} = await this.$http.post('users',this.addUserForm)
        // console.log(res)
        if(res.meta.status!== 201) return this.$message.error('添加用户失败')
            this.$message.success('添加用户成功')
            this.getUserList()
        this.dialogVisible = false
      })
    },

    async editUsers(id){
          const {data:res} = await this.$http.get('users/'+id)
          // console.log(res)
          if(res.meta.status!==200) return this.$message.error('获得用户数据失败')
          this.editUserForm.username = res.data.username
          this.editUserForm.mobile = res.data.mobile
          this.editUserForm.email = res.data.email
          this.editUserForm.id = res.data.id
          this.editDialogVisible = true
    },
    async iseditUsers(id){
      const {data:res} = await this.$http.put('users/'+id,this.editUserForm)
      // console.log(res)
      this.getUserList()
      this.editDialogVisible=false
  },
  //根据ID删除对应的用户信息
   async deleteUser(id){
      console.log(id)
       const confirmresult = await this.$confirm('此操作将永久删除该用户 , 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).catch(err => err)
              // console.log(confirmresult)
              if(confirmresult!=="confirm") return
             const {data:res }=await  this.$http.delete('users/'+id)
             if(res.meta.status!==200) return this.$message.error('删除失败')
              this.$message.success('删除成功')
              this.getUserList()
             // console.log(res)
    },
    //弹出设置角色对话框
   async setRoleDialog(userInfo){
     // console.log(userInfo)
      this.userInfo = userInfo
      const {data:res} = await this.$http.get('roles')
      if(res.meta.status!==200) return this.$message.error('获取角色列表失败')

      this.rolesList = res.data
        this.setRoleDialogVisible = true
    },
    setRoleDialogClose(){
      this.value = ''
    },
   async confirmSetRoleDialog(){
     if(!this.value) return this.$message.error('请选择要分配的角色')
      const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.value})
        if(res.meta.status!==200) return this.$message.error('修改用户角色失败')
        this.$message.success('修改用户角色成功')
         this.getUserList()
      this.setRoleDialogVisible = false
    },


  },
  }
 </script>

<style>
  .el-row{
    margin-bottom: 15px;
  }
  .el-table{
    margin-bottom: 15px;
  }
</style>
