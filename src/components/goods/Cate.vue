<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card>
        <el-row>
          <el-col>
                <el-button type="primary" @click="showAddGoodsDialog">添加商品</el-button>
          </el-col>
        </el-row>

          <tree-table
           ref="treeTable"
            :border="true"
           show-index
            :expand-type="false"
             :selection-type="false"
                :data="cateList"
                :columns="columns">
                <!-- 是否有效模板 -->
                  <template slot ="isok" slot-scope="scope">
                    <i v-if="scope.row.cat_deleted === false" class="el-icon-success" ></i>
                    <i  v-else class="el-icon-error"></i>
                  </template>
                  <template slot="order" slot-scope="scope">
                    <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
                    <el-tag type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
                    <el-tag type="warning" v-else>三级</el-tag>
                  </template>
                  <template slot="opt" slot-scope="scope">
                      <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                      <el-button type="danger" icon="el-icon-delete" size="mini" @click="delCatekind(scope.row.cat_id)"></el-button>
                  </template>
          </tree-table>

            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[3, 5, 10]"
                :page-size="this.queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
              </el-pagination>
      </el-card>
      <!-- 添加商品对话框 -->
      <el-dialog
        title="添加商品"
        :visible.sync="addGoodsDialogVisible"
        width="50%"
        @close="addGoodsDialogClosed">
        <el-form :model="addGoodsForm" :rules="addGoodsRules" ref="addGoodsForm" label-width="100px">
          <el-form-item label="分类名称 :" prop="cat_name">
            <el-input v-model="addGoodsForm.cat_name"></el-input>
          </el-form-item>

          <!-- 级联选择器 -->
          <el-form-item label="父级分类 :">
            <div class="block">
            <!-- options绑定数据源 -->
                  <el-cascader
                  change-on-selectd
                  clearable
                  expand-trigger="hover"
                  :props="cascaderProps"
                    v-model="selectedKeys"
                    :options="parentCateList"
                    @change="handleChange"></el-cascader>
                </div>
          </el-form-item>
          </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addGoodsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCateConfirm">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
  export default{
    data(){
      return{
        parentCateList:[],
        // 选中的父级分类id数组
       selectedKeys:[],
        addGoodsForm:{
              cat_pid:0,
              cat_name:'',
              cat_level:0,
        },
        cascaderProps:{
          label:'cat_name',
          value:'cat_id',
          children:'children',

        },
        addGoodsRules:{
          cat_name:[
            { required: true, message: '请输入商品名称', trigger: 'blur' },
             { min: 1, max: 5, message: '长度在 5 到 5 个字符', trigger: 'blur' }
          ]
        },
          cateList:[],
          columns:[
            {
              label:'商品种类',
              prop:'cat_name',
              width:'200px'
              },
              {
                label:'是否有效',
                width:'200px',
                type:'template',
                template:'isok'
              },
              {
                label:'操作',
                type:'template',
                template:'opt',
                width:'200px'
              },
          ],
          // 查询条件
          queryInfo:{
            pagesize:5,
            pagenum:1,
            type:3
          },
          total:0,
          addGoodsDialogVisible:false,


      }
    },
    created(){
          this.getCateList()
    },
    methods:{
      // 监听删除商品类别按钮
     async delCatekind(id){
        const {data:res} = await this.$http.delete(`categories/${id}`)
        if(res.meta.status!==200) this.$message.error('删除分类失败')
        this.$message.success('删除分类成功')
        this.getCateList()


      },

      // 监听关闭添加商品对话框关闭
      addGoodsDialogClosed(){
        this.$refs.addGoodsForm.resetFields()
        this.selectedKeys=[]
        this.addGoodsForm.cat_level = 0
        this.addGoodsForm.cat_name = ''
        this.addGoodsForm.cat_pid = 0
      },
      // 监听确认添加商品分类
     async addCateConfirm(){
       // console.log(this.addGoodsForm)
        const {data:res} = await this.$http.post('categories',this.addGoodsForm)
          this.getCateList()
        this.addGoodsDialogVisible = false
        // console.log('你好')
      },
      // 选择项发生变化出发这个函数
      handleChange(){
        console.log(this.selectedKeys)
        // 父级分类的id
        if(this.selectedKeys.length > 0){
          this.addGoodsForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
          console.log(this.addGoodsForm.cat_pid)
          // 为当前分类的等级赋值
          this.addGoodsForm.cat_level = this.selectedKeys.length
          // console.log(this.addGoodsForm.cat_level)
          return
        }else{
          this.addGoodsForm.cat_pid = 0
          this.addGoodsForm.cat_level = 0
        }


      },
      // 展示添加商品对话框
       showAddGoodsDialog(){
          this.getParentCateList()
        this.addGoodsDialogVisible = true
      },
     async getParentCateList(){
        const {data:res} = await this.$http.get('categories',{params:{type:2}})
        // console.log(res.data)
          if(res.meta.status!==200) return this.$message.error('获取父级分类列表失败')
          this.parentCateList = res.data
      },
    async  getCateList(){
        const {data:res} = await this.$http.get('categories',{params:this.queryInfo})
        // console.log(res)
        if(res.meta.status!==200) return this.$message.error('获取商品分类列表失败')
          // console.log(res.data)
        this.cateList = res.data.result
        this.total = res.data.total
      },

      // 监听pagesize改变
      handleSizeChange(newSize){
          this.queryInfo.pagesize = newSize
          this.getCateList()
      },
      // 监听pagenum的改变
      handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage
        this.getCateList()
      }
    }
  }
</script>

<style>
  .el-icon-success{
    color:lightgreen
  }
  .el-icon-error{
    color:tomato
  }
  .el-button{
    margin:20px;
  }
  .el-cascader{
    width: 100%;
  }
  .block{
    width: 100%;

  }
  .el-dialog{
    overflow: auto;
  }
</style>
