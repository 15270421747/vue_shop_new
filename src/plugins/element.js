import Vue from 'vue'
// import { Button } from 'element-ui'
// import {Form,FormItem} from 'element-ui'
// import {Input} from 'element-ui'
//导入弹框提示组件
// import {Message} from 'element-ui'

//合并element组件的导入
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
    Pagination,
    Dialog,
    MessageBox,
    Tag,
    Tree,
      Select,
      Option,
      Cascader,
      Alert,
      Tabs,
      TabPane,
  } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(TabPane)
Vue.use(Tabs)
// Vue.use(MessageBox)

Vue.prototype.$message = Message   //绑到了vue的原型上，就可以用this来调，把message挂载到了vue上
Vue.prototype.$confirm = MessageBox.confirm
