<template>
  <div>
  <!-- 面包屑导航 -->
 <el-breadcrumb separator-class="el-icon-arrow-right">
   <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
   <el-breadcrumb-item>权限管理</el-breadcrumb-item>
   <el-breadcrumb-item>角色列表</el-breadcrumb-item>
   </el-breadcrumb>

  <!-- 内容区域 -->
    <el-card class="box-card">
      <div>
        <!-- 表格区域 -->
<template>
  <el-row>
    <el-col>
<el-button type='success' >添加用户</el-button>
    </el-col>
  </el-row>
  <el-row>
    <el-table  border style="width: 100%" :data="RolesList" stripe>
      <el-table-column  type="expand">
        <template slot-scope="scope">
          <!-- {{scope.row.children}} -->
          <el-row class="vcenter" v-for="(item1, i1) in scope.row.children" :key="item1.id">
            <el-col :span="5" >
                <el-tag @close="removeRightById(scope.row,item1.id)" closable>{{item1.authName}}</el-tag><i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="19" >
                <el-row class="vcenter" v-for="(item2, i2) in item1.children" :key="item2.id">
                  <el-col :span="6" >
                    <el-tag @close="removeRightById(scope.row,item2.id)" closable type="success">{{item2.authName}}</el-tag><i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col class="vcenter" :span="18">
                        <el-tag @close="removeRightById(scope.row,item3.id)" closable v-for="(item3, i3) in item2.children" :key="item3.id" type="warning">{{item3.authName}}</el-tag><i class="el-icon-caret-right"></i>

                  </el-col>
                </el-row>
            </el-col>
          </el-row>
        </template>
        </el-table-column>
      <el-table-column  type="index"> </el-table-column>

      <el-table-column prop="roleName" label="角色名称"  width="180"></el-table-column>
      <el-table-column  prop="roleDesc" label="角色描述"> </el-table-column>
      <el-table-column   label="操作">
      <template slot-scope='scope'>
         <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
         <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)">删除</el-button>
         <el-button type="warning" icon="el-icon-s-tools" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
      </template>
      </el-table-column>
    </el-table>
  </el-row>
</template>


<!-- 分配权限对话框 -->
<el-dialog
  title="分配权限"
  :visible.sync="setRightDialogVisible"
  width="50%"
  @close = "setRightDialogClosed"
  >
  <!-- 树形控件 -->
  <el-tree node-key="id"
   ref="treeRef"
   :data="rightsList"
    :props="treeProps"
     show-checkbox
      default-expand-all
        :default-checked-keys="defKeys"></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="setRightDialog">确 定</el-button>
  </span>
</el-dialog>

      </div>
    </el-card>


 </div>
</template>

<script>
  export default{
    data(){
      return{
        RolesList:[],
        setRightDialogVisible:false,
        //所有权限的数据
        rightsList:[],
        //树形控件的属性绑定对象
        treeProps:{
          label:'authName',
          children:'children'
        },
        //默认选中的节点ID值数组
        defKeys:[],
        // 当前即将分配权限的Id
        roleId:[],
        dialogVisible:false,



      }
    },
   created() {
      this.getRolesList()
   },
    methods:{
      // 获取角色列表
      async getRolesList(){
        const {data:res} = await this.$http.get('roles')
        // console.log(res.data)
        if(res.meta.status!==200) return this.$message.error('获取角色列表失败')
        this.RolesList = res.data
        // console.log(this.RolesList)
      },
      //删除用户
      async removeRightById(role,rightId){
        const confirmresult = await this.$confirm('此操作将永久删除该权限 , 是否继续?', '提示', {
                 confirmButtonText: '确定',
                 cancelButtonText: '取消',
                 type: 'warning'
               }).catch(err => err)
               // console.log(confirmresult)
               if(confirmresult!=="confirm") return
              const {data:res }=await  this.$http.delete(`roles/${role.id}/rights/${rightId}`)
              if(res.meta.status!==200) return this.$message.error('删除权限失败')
               this.$message.success('删除权限成功')
               console.log(role.children)
               // console.log(res.data)
               role.children= res.data
              // console.log(res)
      },

      //展示设置权限对话框
      async showSetRightDialog(role){
        // console.log(role)
        this.roleId = role.id
          const {data:res} = await this.$http.get(`rights/tree`)
          if(res.meta.status!==200) return this.$message.error('获取权限列表失败')
          this.$message.success('获取权限列表成功')
          // console.log(res.data)
          //获取到的权限数据保存到数组中
          this.rightsList = res.data
           // console.log(this.rightsList)
          //递归获取三级节点的ID
          this.getLeafKeys(role, this.defKeys)
          this.setRightDialogVisible = true
      },
      //通过递归的形式，获取角色下所有三级权限的ID，并保存到defKey数组中
      getLeafKeys(node,arr){
        //如果当前node节点不包含children属性，则是三级节点
        if(!node.children){
          return arr.push(node.id)
        }
          //不是三级节点就要用递归，没循环一项得到一个item，用这个item再次调用递归函数
          node.children.forEach(item=>
          this.getLeafKeys(item,arr))
      },
      //监听分配权限对话框的关闭事件
      setRightDialogClosed(){
        this.defKeys = []
      },
      //点击为角色分配权限
     async setRightDialog(){
          const keys = [
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys()
          ]
          const idStr = keys.join(',')
          const {data:res}= await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
          console.log(res)
          if(res.meta.status !==200) return this.$message.error('权限授权失败')
          this.$message.success('权限授权成功')
          this.getRolesList()
          this.setRightDialogVisible = false
          // console.log(keys)
      },
     async deleteUser(id){
       console.log(id)
     const {data:res} = await this.$http.delete(`users/${id}`)
     console.log(res)
     if(res.meta.status!==200) return this.$message.error('删除用户失败')
     this.$message.success('删除用户成功')
     this.getRolesList()
      }


    },
  }
</script>

<style lang="less" scoped>
.vcenter{
  display: flex;
  align-items: center;
  border-top: blanchedalmond 1px solid;
  margin: 10px;
}
</style>
