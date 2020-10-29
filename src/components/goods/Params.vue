<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
      </el-breadcrumb>
          <!-- 警告字样 -->
      <el-card>
             <el-alert
             :closable='false'
                title="注意 : 只允许为第三级分类设置相关参数"
                type="warning"
                show-icon>
              </el-alert>
              <!-- 级联选择器 -->
              <el-row>
                <el-col>
                    <span class="demonstration">选择商品分类 :</span>
                    <el-cascader
                    clearable
                    popperClass="nihao"
                      v-model="selectedCateKeys"
                      :options="cateList"
                      :props="cateProps"
                      @change="handleChange"></el-cascader>
                </el-col>
              </el-row>
              <!-- Tabs标签导航 -->
               <el-tabs v-model="activeName" @tab-click="handleTabClick">
                 <!-- 添加动态参数的面板 -->

                  <el-tab-pane label="用户管理" name="many">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>
                    <!-- 动态参数表格 -->
                    <el-table :data="manyTableData" border stripe>
                      <el-table-column type="expand">
                        <template slot-scope="scope">
                          <el-tag closable v-for="(item ,i) in scope.row.attr_vals" :key="i">{{item}}</el-tag>

                          <el-input
                            class="input-new-tag"
                            v-if="scope.row.inputVisible"
                            v-model="scope.row.inputValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm(scope.row)"
                            @blur="handleInputConfirm(scope.row)"
                          >
                          </el-input>
                          <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>



                        </template>
                      </el-table-column>
                      <el-table-column type="index"></el-table-column>
                      <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                      <el-table-column label="操作" >
                        <template slot-scope="scope">
                 <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                 <el-button type="danger" size="mini" icon="el-icon-delete" @click="open(scope.row)">删除</el-button>
               </template>
                      </el-table-column>
                    </el-table>
                  </el-tab-pane>
                  <!-- 添加静态属性的面板 -->
                  <el-tab-pane label="配置管理" name="only">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性</el-button>
                    <!-- 静态配置表格 -->
                    <el-table :data="onlyTableData" border stripe>
                      <el-table-column type="expand">
                        <template slot-scope="scope">
                          <el-tag closable v-for="(item ,i) in scope.row.attr_vals" :key="i">{{item}}</el-tag>
                          <el-input
                            class="input-new-tag"
                            v-if="scope.row.inputVisible"
                            v-model="scope.row.inputValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm(scope.row)"
                            @blur="handleInputConfirm(scope.row)"
                          >
                          </el-input>
                          <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                        </template>
                      </el-table-column>
                      <el-table-column type="index"></el-table-column>
                      <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                      <el-table-column label="操作" >
                        <template slot-scope="scope">
                  <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                  <el-button type="danger" size="mini" icon="el-icon-delete"  @click="open(scope.row)">删除</el-button>
                </template>
                      </el-table-column>
                    </el-table>
                  </el-tab-pane>
                </el-tabs>
      </el-card>
        <!-- 添加参数/属性对话框 -->
        <el-dialog
        @close="addDialogClosed"
          :title="'添加'+titleText"
          :visible.sync="addDialogVisible"
          width="50%" >
          <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" >
            <el-form-item :label="titleText" prop="attr_name">
              <el-input v-model="addForm.attr_name"></el-input>
            </el-form-item>
            </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addDialogConfirm">确 定</el-button>
          </span>
        </el-dialog>

          <!-- 编辑参数对话框 -->
          <el-dialog
          @close="editDialogClosed"
            :title="'修改'+titleText"
            :visible.sync="editDialogVisible"
            width="50%" >
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" >
              <el-form-item :label="titleText" prop="attr_name">
                <el-input v-model="editForm.attr_name"></el-input>
              </el-form-item>
              </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="editDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="editDialogConfirm">确 定</el-button>
            </span>
          </el-dialog>

  </div>
</template>

<script>
  export default{
    data(){
      return{

        editForm:{},
        editDialogVisible:false,
        editFormRules:{
          attr_name:[
            { required: true, message: '请输入参数名称', trigger: 'blur' },
             { min: 2, max: 10, message: '长度在 2 到 10个字符', trigger: 'blur' }
          ]
        },
        addFormRules:{
          attr_name:[
            { required: true, message: '请输入参数名称', trigger: 'blur' },
             { min: 2, max: 10, message: '长度在 2 到 10个字符', trigger: 'blur' }
          ]
        },
        addForm:{
          attr_name:''
        },
        addDialogVisible:false,
        // 动态参数的数据
        manyTableData:[],
        // 静态属性的数据a
        onlyTableData:[],
        //被激活页签的名称
        activeName:'many',
        cateList:[],
        selectedCateKeys:[],
        cateProps:{
          expandTrigger: 'hover',
          value:'cat_id',
          label:'cat_name',
          children:'children',

        },

      }
    },
    created(){
      this.getCateList()
    },
    methods:{
      showInput(row){
        row.inputVisible = true
      },
      handleInputConfirm(row){row.inputVisible = false},
      // 点击按钮修改参数信息
      async editDialogConfirm(){

             const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{attr_sel:this.activeName,attr_name:this.editForm.attr_name})
                if(res.meta.status!==200) this.$message.error('修改数据失败')
            this.getParamsData()
            this.editDialogVisible = false
      },

      editDialogClosed(){
        this.$refs.editFormRef.resetFields()
      },
      // 点击按钮.展示修改对话框
      async showEditDialog(id){
        // console.log(this.activeName)
        this.canshuId = id
        // console.log(this.canshuId)
        const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${id}`,{params:{attr_sel:this.activeName}})
        if(res.meta.status!==200) return this.$message.error('获取参数信息失败')
        this.editForm = res.data
          this.editDialogVisible = true
      },
      open(scope){
           this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(async () => {
                    console.log(scope)
                    const {data:res} = await this.$http.delete(`categories/${scope.cat_id}/attributes/${scope.attr_id}`)
                    this.getParamsData()
                    this.$message({
                      type: 'success',
                      message: '删除成功!'
                    });
                  }).catch(() => {
                    this.$message({
                      type: 'info',
                      message: '已取消删除'
                    });
                  });
      },
     async addDialogConfirm(){
       this.$refs.addFormRef.validate( async valid=>{
         const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
              attr_name:this.addForm.attr_name,
              attr_sel:this.activeName,
          })
          console.log(res)
          this.getParamsData()
          this.addDialogVisible=false
       }
       )

      },
      addDialogClosed(){
        this.$refs.addFormRef.resetFields()
      },

      // Tab页签点击事件的处理函数
      handleTabClick(){
        console.log(this.activeName)
         this.getParamsData()
      },
      async getCateList(){
        const {data:res} = await this.$http.get('categories')
        // console.log(res)
        if(res.meta.status!==200) return this.$message.error('获取商品分类失败')
        this.cateList = res.data
        // console.log(this.cateList)

      },
      async getParamsData(){
        if(this.selectedCateKeys.length!==3){
          this.$message.error('请选择三级分类,而不是一级或者二级')
          this.selectedCateKeys = []
          return
        }
           // console.log(this.selectedCateKeys)
           //根据所选分类的ID,和当前所处的面板,获取对应的参数
           // console.log('获取参数列表ing')
           const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
           console.log(res.data)
           if(res.meta.status!==200) return this.$message.error('获取参数列表失败')
           // console.log(res.data)

           res.data.forEach(item=>{
            item.attr_vals = item.attr_vals ? item.attr_vals.split(',') :[],
            //控制文本框的显示与隐藏
            item.inputVisible = false
            item.inputValue = ''
           })
           console.log('接下来是数组')
           console.log(res.data)

           if(this.activeName==="many"){
             this.manyTableData = res.data
           }else{
             this.onlyTableData = res.data
           }
              this.inputVisible= false
        },
        //监听级联选择框变化
        handleChange(){
         this.getParamsData()

        }
      },

      computed:{
      isBtnDisabled(){
        if(this.selectedCateKeys.length!==3) {
          return true
        }
        return false
      },
      cateId(){
        if(this.selectedCateKeys.length===3){
            return this.selectedCateKeys[this.selectedCateKeys.length-1]
        }
      },
      titleText(){
        if(this.activeName==='many'){
          return '动态参数'
        }
        return '静态属性'
      },


    },

 }


</script>

<style>
  .nihao div{
    height: 300px;
  }
  .el-cascader{
    width: 300px;
    margin:10px 20px 0 20px;
  }
  .el-tag{
    margin: 10px;
  }
  .input-new-tag{
        width: 120px !important;

        /* border: #2D8CF0 1px solid; */
  }
  .button-new-tag{
    width: 120px;
  }

</style>
