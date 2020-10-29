<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card>
          <el-table  border style="width: 100%" :data="RightList" stripe>
            <el-table-column  type="index"> </el-table-column>
            <el-table-column  prop="authName" label="权限名称"> </el-table-column>
            <el-table-column prop="path" label="路径"  ></el-table-column>
            <el-table-column prop="level" label="权限登记"  >
              <template slot-scope="scope">
              <el-tag v-if="scope.row.level==='0'">标签一</el-tag>
                <el-tag type="success" v-else-if="scope.row.level==='1'">标签二</el-tag>
                <el-tag type="info" v-else>标签三</el-tag>
              </template>
            </el-table-column>
            </el-table>
      </el-card>
  </div>
</template>

<script>
  export default{
      data(){
        return{
          RightList:[]
        }
      },
      created(){
        this.getRightList()
      },
      methods:{
        async getRightList(){
          const {data:res} = await this.$http.get(`rights/list`)
          console.log(res.data)
          if(res.meta.status!= 200 ){
            return this.$message.error('获取权限列表失败')
          }
          this.RightList = res.data
        }
      }
  }
</script>

<style>
</style>
