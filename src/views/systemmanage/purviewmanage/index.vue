<template >
  <div class="menumanage">
    <div class="layout_main">
      <div v-show="isShow">
        <el-row style="display:flex;">
          <el-col style="flex:1;">
            <div class="grid-content bg-purple">
              <el-card
                class="box-card"
                shadow="never"
                style="height:800px;margin-right:20px;width:400px;"
              >
                <div class="clearfix" slot="header">
                  <span>菜单权限树</span>
                </div>
                <el-tree
                  :data="treeData"
                  :expand-on-click-node="false"
                  :load="loadNode"
                  :props="defaultProps"
                  @node-click="fnNodeClick"
                  class="tree"
                  highlight-current
                  lazy
                  node-key="menuId"
                  ref="tree"
                  style="overflow-y: auto;height:700px;"
                >
                  <span class="custom-tree-node" slot-scope="{ node ,data}">
                    <span style="flex:1;">{{ node.label }}</span>
                    <div>
                      <span>
                        <el-button @click="() => handleAddMenu(data)" type="text">
                          <span>+子菜单</span>
                        </el-button>
                      </span>
                      <span>
                        <el-button @click="() => handleAddQx(data)" size="mini" type="text">
                          <span style="color:#67C23A;margin-left:10px;">+权 限</span>
                        </el-button>
                      </span>
                    </div>
                  </span>
                </el-tree>
              </el-card>
            </div>
          </el-col>
          <el-col :span="18">
            <div class="grid-content bg-purple-light">
              <el-tabs @tab-click="handleClick" v-model="activeName">
                <el-tab-pane label="菜单信息" name="first">
                  <el-table :data="menuData" :height="tableHeight" border stripe>
                    <el-table-column
                      align="left"
                      label="父菜单名称"
                      prop="parentName"
                      show-overflow-tooltip
                      width="100"
                    >
                      <template slot-scope="scope">
                        <span v-if="!scope.row.parentName">---</span>
                        <span v-else>{{scope.row.parentName}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      align="left"
                      label="菜单名称"
                      prop="menuName"
                      show-overflow-tooltip
                    >
                      <template slot-scope="scope">
                        <span v-if="!scope.row.menuName">---</span>
                        <span v-else>{{scope.row.menuName}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      align="left"
                      label="菜单描述"
                      prop="menuDesc"
                      show-overflow-tooltip
                    >
                      <template slot-scope="scope">
                        <span v-if="!scope.row.menuDesc">---</span>
                        <span v-else>{{scope.row.menuDesc}}</span>
                      </template>
                    </el-table-column>

                    <el-table-column align="left" label="菜单图标" prop="icon" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <span v-if="!scope.row.icon">---</span>
                        <span v-else>{{scope.row.icon}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      align="center"
                      label="菜单类型"
                      prop="menuType"
                      show-overflow-tooltip
                    >
                      <template slot-scope="scope">
                        <span v-if="scope.row.menuType=='PC'">PC</span>
                        <span v-if="scope.row.menuType=='APP'">APP</span>
                      </template>
                    </el-table-column>
                    <el-table-column align="left" label="组件" prop="component" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <span v-if="!scope.row.component">---</span>
                        <span v-else>{{scope.row.component}}</span>
                      </template>
                    </el-table-column>

                    <el-table-column
                      align="center"
                      label="是否可用"
                      prop="available"
                      show-overflow-tooltip
                    >
                      <template slot-scope="scope">
                        <span v-if="scope.row.available==true||scope.row.available==1">可用</span>
                        <span v-if="scope.row.available==false||scope.row.available==0">不可用</span>
                      </template>
                    </el-table-column>

                    <el-table-column
                      align="center"
                      label="是否隐藏"
                      prop="hidden"
                      show-overflow-tooltip
                    >
                      <template slot-scope="scope">
                        <span v-if="scope.row.hidden==true||scope.row.hidden==1">是</span>
                        <span v-if="scope.row.hidden==false||scope.row.hidden==0">否</span>
                      </template>
                    </el-table-column>

                    <el-table-column
                      align="center"
                      label="是否叶子节点"
                      prop="leaf"
                      show-overflow-tooltip
                    >
                      <template slot-scope="scope">
                        <span v-if="scope.row.leaf==true||scope.row.leaf==1">是</span>
                        <span v-if="scope.row.leaf==false||scope.row.leaf==0">否</span>
                      </template>
                    </el-table-column>
                    <el-table-column align="left" label="接口地址" prop="restUri" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <span v-if="!scope.row.restUri">---</span>
                        <span v-else>{{scope.row.restUri}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column align="left" label="前端路由" prop="url" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <span v-if="!scope.row.url">---</span>
                        <span v-else>{{scope.row.url}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column align="left" label="排序" prop="sort" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <span v-if="scope.row.sort||scope.row.sort==0">{{scope.row.sort}}</span>
                        <span v-else>---</span>
                      </template>
                    </el-table-column>

                    <el-table-column align="center" fixed="right" label="操作" width="120">
                      <template slot-scope="scope">
                        <el-button
                          @click="handelEditMenu(scope.row)"
                          icon="el-icon-edit"
                          type="primary"
                        >编辑</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
                <el-tab-pane label="权限信息" name="second">
                  <el-table :data="qxData" :height="tableHeight" border stripe>
                    <el-table-column
                      align="left"
                      label="权限名称"
                      prop="permitName"
                      show-overflow-tooltip
                    >
                      <template slot-scope="scope">
                        <span v-if="!scope.row.permitName">---</span>
                        <span v-else>{{scope.row.permitName}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      align="left"
                      label="权限描述"
                      prop="permitDesc"
                      show-overflow-tooltip
                    >
                      <template slot-scope="scope">
                        <span v-if="!scope.row.permitDesc">---</span>
                        <span v-else>{{scope.row.permitDesc}}</span>
                      </template>
                    </el-table-column>

                    <el-table-column align="left" label="菜单图标" prop="icon" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <span v-if="!scope.row.icon">---</span>
                        <span v-else>{{scope.row.icon}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      align="center"
                      label="菜单类型"
                      prop="permitType"
                      show-overflow-tooltip
                    >
                      <template slot-scope="scope">
                        <span v-if="scope.row.permitType=='CMD'">按钮</span>
                        <span v-if="scope.row.permitType=='LINK'">连接</span>
                        <span v-if="scope.row.permitType=='HIDE'">隐藏请求</span>
                        <span v-if="scope.row.permitType=='OTHER'">其它</span>
                      </template>
                    </el-table-column>
                    <el-table-column align="left" label="组件" prop="component" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <span v-if="!scope.row.component">---</span>
                        <span v-else>{{scope.row.component}}</span>
                      </template>
                    </el-table-column>

                    <el-table-column
                      align="center"
                      label="是否可用"
                      prop="available"
                      show-overflow-tooltip
                    >
                      <template slot-scope="scope">
                        <span v-if="scope.row.available==true||scope.row.available==1">可用</span>
                        <span v-if="scope.row.available==false||scope.row.available==0">不可用</span>
                      </template>
                    </el-table-column>

                    <el-table-column
                      align="center"
                      label="是否隐藏"
                      prop="hidden"
                      show-overflow-tooltip
                    >
                      <template slot-scope="scope">
                        <span v-if="scope.row.hidden==true||scope.row.hidden==1">是</span>
                        <span v-if="scope.row.hidden==false||scope.row.hidden==0">否</span>
                      </template>
                    </el-table-column>
                    <el-table-column align="left" label="接口地址" prop="restUri" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <span v-if="!scope.row.restUri">---</span>
                        <span v-else>{{scope.row.restUri}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column align="left" label="前端路由" prop="url" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <span v-if="!scope.row.url">---</span>
                        <span v-else>{{scope.row.url}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column align="left" label="排序" prop="sort" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <span v-if="scope.row.sort||scope.row.sort==0">{{scope.row.sort}}</span>
                        <span v-else>---</span>
                      </template>
                    </el-table-column>

                    <el-table-column align="center" fixed="right" label="操作" width="100">
                      <template slot-scope="scope">
                        <el-button
                          @click="handelEditQx(scope.row)"
                          icon="el-icon-edit"
                          type="primary"
                        >编辑</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-col>
        </el-row>

        <el-dialog
          :before-close="closeMenuDialog"
          :title="menuTitle"
          :visible.sync="menuvisible"
          width="30%"
        >
          <template>
            <el-form :model="menuForm" :rules="menurules" label-width="110px" ref="menuForm">
              <el-form-item label="菜单名称" prop="menuName">
                <el-input placeholder="请输入菜单名称" v-model="menuForm.menuName"></el-input>
              </el-form-item>
              <el-form-item label="菜单描述" prop="menuDesc">
                <el-input placeholder="请输入菜单描述" v-model="menuForm.menuDesc"></el-input>
              </el-form-item>
              <el-form-item label="菜单排序" prop="sort">
                <el-input placeholder="请输入菜单排序" type="number" v-model="menuForm.sort"></el-input>
              </el-form-item>
              <el-form-item label="前端路由" prop="url">
                <el-input placeholder="请输入前端路由" v-model="menuForm.url"></el-input>
              </el-form-item>
              <el-form-item label="引用组件" prop="component">
                <el-input placeholder="请输入引用组件" v-model="menuForm.component"></el-input>
              </el-form-item>
              <el-form-item label="菜单接口" prop="restUri">
                <el-input placeholder="请输入菜单接口" v-model="menuForm.restUri"></el-input>
              </el-form-item>
              <el-form-item label="菜单图标" prop="icon">
                <el-input placeholder="请输入菜单图标" v-model="menuForm.icon"></el-input>
              </el-form-item>
              <el-form-item label="菜单类型" prop="menuType">
                <el-select style="width:100%;" v-model="menuForm.menuType">
                  <el-option value>请选择</el-option>
                  <el-option label="PC" value="PC"></el-option>
                  <el-option label="APP" value="APP"></el-option>
                  <!-- <el-option label="按钮" value="CMD"></el-option>
                  <el-option label="链接" value="LINK"></el-option>
                  <el-option label="其他" value="OTHER"></el-option>
                  <el-option label="请求接口" value="HIDE"></el-option>-->
                </el-select>
              </el-form-item>
              <el-form-item label="可用状态" prop="available">
                <el-radio-group v-model="menuForm.available">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="是否隐藏" prop="hidden">
                <el-radio-group v-model="menuForm.hidden">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="是否叶子节点" prop="leaf">
                <el-radio-group v-model="menuForm.leaf">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item>
                <el-button
                  @click="handleSubmitMenu"
                  icon="el-icon-check"
                  style="float:right;"
                  type="primary"
                >提交</el-button>
                <el-button
                  @click="closeMenuDialog"
                  icon="el-icon-back"
                  style="float:right;margin-right:10px;"
                  type="default"
                >取消</el-button>
              </el-form-item>
            </el-form>
          </template>
        </el-dialog>
        <el-dialog
          :before-close="closeQxDialog"
          :title="qxTitle"
          :visible.sync="qxvisible"
          width="30%"
        >
          <el-form :model="qxForm" :rules="qxrules" label-width="100px" ref="qxForm">
            <el-form-item label="权限名称" prop="permitName">
              <el-input placeholder="请输入权限名称" v-model="qxForm.permitName"></el-input>
            </el-form-item>
            <el-form-item label="权限描述" prop="permitDesc">
              <el-input placeholder="请输入权限描述" v-model="qxForm.permitDesc"></el-input>
            </el-form-item>
            <el-form-item label="权限排序" prop="sort">
              <el-input placeholder="请输入权限排序" type="number" v-model="qxForm.sort"></el-input>
            </el-form-item>
            <el-form-item label="前端路由" prop="url">
              <el-input placeholder="请输入前端路由" v-model="qxForm.url"></el-input>
            </el-form-item>
            <el-form-item label="引用组件" prop="component">
              <el-input placeholder="请输入引用组件" v-model="qxForm.component"></el-input>
            </el-form-item>
            <el-form-item label="权限接口" prop="restUri">
              <el-input placeholder="请输入权限接口" v-model="qxForm.restUri"></el-input>
            </el-form-item>
            <el-form-item label="权限图标" prop="icon">
              <el-input placeholder="请输入权限图标" v-model="qxForm.icon"></el-input>
            </el-form-item>
            <el-form-item label="权限类型" prop="permitType">
              <el-select style="width:100%;" v-model="qxForm.permitType">
                <el-option label="按钮" value="CMD"></el-option>
                <el-option label="链接" value="LINK"></el-option>
                <el-option label="其他" value="OTHER"></el-option>
                <el-option label="请求接口" value="HIDE"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="可用状态" prop="available">
              <el-radio-group v-model="qxForm.available">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否隐藏" prop="hidden">
              <el-radio-group v-model="qxForm.hidden">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button
                @click="handleSubmitQx"
                icon="el-icon-check"
                style="float:right;"
                type="primary"
              >提交</el-button>
              <el-button
                @click="closeQxDialog"
                icon="el-icon-back"
                style="float:right;margin-right:10px;"
                type="default"
              >取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import * as z from '@/utils/com.js'
import request from '@/utils/request'
export default {
  name: 'menumanage',
  data() {
    return {
      activeName: 'first',
      menuvisible: false, // 打开添加子菜单
      menuTitle: '', // 菜单头
      tmpMenuData: [], // 菜单树数据

      tmpobjMenuData: [], // 菜单树
      menuForm: {
        url: '',
        sort: '',
        restUri: '',
        removed: '',
        parentName: '',
        parentId: '',
        menuType: '',
        menuName: '',
        menuId: '',
        menuDesc: '',
        leaf: 1,
        icon: 'fa fa-tasks',
        hideCode: '',
        hidden: '',
        component: '',
        available: ''
      },
      menurules: {
        url: [
          {
            required: true,
            message: '请输入前端路由',
            trigger: 'blur'
          },
          {
            required: true,
            message: '请输入前端路由',
            trigger: 'change'
          }
        ],
        sort: [
          {
            required: true,
            message: '请输入参数键',
            trigger: 'change'
          },
          {
            required: true,
            pattern: /^([1-9]\d*|[0]{1,1})$/,
            message: '请输入整型数字',
            trigger: 'blur'
          }
        ],
        restUri: [
          {
            message: '请输入菜单接口',
            trigger: 'blur'
          },
          {
            message: '请输入菜单接口',
            trigger: 'change'
          }
        ],
        menuType: [
          {
            required: true,
            message: '请选择菜单类型',
            trigger: 'change'
          },
          {
            required: true,
            message: '请选择菜单类型',
            trigger: 'blur'
          }
        ],
        menuName: [
          {
            required: true,
            message: '请输入菜单名称',
            trigger: 'blur'
          },
          {
            required: true,
            message: '请输入菜单名称',
            trigger: 'change'
          }
        ],
        menuDesc: [
          {
            message: '请输入菜单描述',
            trigger: 'blur'
          },
          {
            message: '请输入菜单描述',
            trigger: 'change'
          }
        ],
        leaf: [
          {
            required: true,
            message: '请选择是否是叶子节点',
            trigger: 'blur'
          },
          {
            required: true,
            message: '请选择是否是叶子节点',
            trigger: 'change'
          }
        ],
        icon: [
          {
            required: true,
            message: '请输入菜单图标',
            trigger: 'blur'
          },
          {
            required: true,
            message: '请输入菜单图标',
            trigger: 'change'
          }
        ],
        hidden: [
          {
            required: true,
            message: '请是否隐藏',
            trigger: 'blur'
          },
          {
            required: true,
            message: '请是否隐藏',
            trigger: 'change'
          }
        ],
        component: [
          {
            required: true,
            message: '请输入引用组件',
            trigger: 'blur'
          },
          {
            required: true,
            message: '请输入引用组件',
            trigger: 'change'
          }
        ],
        available: [
          {
            required: true,
            message: '请选择可用状态',
            trigger: 'change'
          },
          {
            required: true,
            message: '请选择可用状态',
            trigger: 'blur'
          }
        ]
      },
      qxTitle: '',
      tmpQxData: [], // 权限树数据
      qxvisible: false, // 打开添加权限
      qxForm: {
        url: '',
        sort: '',
        restUri: '',
        removed: '',
        permitType: '',
        permitName: '',
        permitId: '',
        permitDesc: '',
        menuId: '',
        icon: '',
        hidden: '',
        component: '',
        available: ''
      },
      qxrules: {
        url: [
          {
            required: true,
            message: '请输入前端路由',
            trigger: 'blur'
          },
          {
            required: true,
            message: '请输入前端路由',
            trigger: 'change'
          }
        ],
        sort: [
          {
            required: true,
            message: '请输入参数键',
            trigger: 'change'
          },
          {
            required: true,
            pattern: /^([1-9]\d*|[0]{1,1})$/,
            message: '请输入整型数字',
            trigger: 'blur'
          }
        ],
        restUri: [
          {
            message: '请输入菜单接口',
            trigger: 'blur'
          },
          {
            message: '请输入菜单接口',
            trigger: 'change'
          }
        ],
        permitType: [
          {
            required: true,
            message: '请选择权限类型',
            trigger: 'change'
          },
          {
            required: true,
            message: '请选择权限类型',
            trigger: 'blur'
          }
        ],
        permitName: [
          {
            required: true,
            message: '请输入权限名称',
            trigger: 'blur'
          },
          {
            required: true,
            message: '请输入权限名称',
            trigger: 'change'
          }
        ],
        permitDesc: [
          {
            message: '请输入权限描述',
            trigger: 'blur'
          },
          {
            message: '请输入权限描述',
            trigger: 'change'
          }
        ],

        icon: [
          {
            message: '请输入权限图标',
            trigger: 'blur'
          },
          {
            message: '请输入权限图标',
            trigger: 'change'
          }
        ],
        hidden: [
          {
            required: true,
            message: '请是否隐藏',
            trigger: 'blur'
          },
          {
            required: true,
            message: '请是否隐藏',
            trigger: 'change'
          }
        ],
        component: [
          {
            message: '请输入引用组件',
            trigger: 'blur'
          },
          {
            message: '请输入引用组件',
            trigger: 'change'
          }
        ],
        available: [
          {
            required: true,
            message: '请选择可用状态',
            trigger: 'change'
          },
          {
            required: true,
            message: '请选择可用状态',
            trigger: 'blur'
          }
        ]
      },
      tableHeight: window.innerHeight - 235,
      searchForm: {
        total: 0,
        pageNo: 1,
        pageSize: 20
      },
      tableData: [],
      isShow: true,
      showCard: false,
      defaultProps: {
        children: 'children',
        label: 'menuName',
        isLeaf: 'leaf'
      },
      // 初始化root树节点数据
      treeData: [
        {
          children: [],
          component: 'layout/Layout',
          disabled: false,
          hidden: 0,
          icon: 'fa fa-cog',
          restUri: null,
          sort: 1,
          type: 0,
          url: '/',
          zones: null,
          available: 1,
          menuId: 'ROOT',
          leaf: false,
          menuDesc: 'ROOT',
          menuName: '运营管理平台',
          menuType: 'PC',
          parentId: 'ROOT',
          parentName: '菜单树'
        }
      ],
      leafData: [], // 叶子节点数据
      qxCard: true, // 权限card
      menuCard: false, // 菜单card
      menuData: [], // 菜单数据
      qxData: [], // 权限信息
      nodeData: {},
      tabData: []
    }
  },
  methods: {
    handleClick(tab) {
      if (this.tabData[tab.index]) {
        return
      } else {
        this.tabData[tab.index] = true
      }
      if (this.activeName === 'first') {
        this.getMenuData(this.nodeData.menuId)
      } else if (this.activeName === 'second') {
        this.getQXData(this.nodeData.menuId)
      }
    },
    handleAddMenu(data) {
      this.menuvisible = true
      this.menuTitle = '添加子菜单'
      this.tmpMenuData = Object.assign({}, data)
      this.menuForm.parentId = data.menuId
    },
    handelEditMenu(row) {
      this.menuvisible = true
      this.menuTitle = '编辑子菜单'
      this.menuForm = Object.assign({}, row)
    },
    closeMenuDialog() {
      this.menuvisible = false
      this.$refs.menuForm.clearValidate()
      this.$refs.menuForm.resetFields()
    },

    handleSubmitMenu() {
      this.$refs.menuForm.validate(valid => {
        if (valid) {
          let url = ''
          if (this.menuTitle === '添加子菜单') {
            // 添加
            url = '/core/sysmenu/save'
          } else if (this.menuTitle === '编辑子菜单') {
            url = '/core/sysmenu/modify'
          }

          request({
            url: url,
            method: 'post',
            params: this.menuForm
          })
            .then(res => {
              z.success('操作成功')
              if (this.menuTitle === '添加子菜单') {
                this.tmpMenuData.children.push(res.data)
              } else {
                this.getMenuData(this.menuForm.parentId)

                // 修改权限树数据
                const menuId = res.data.menuId
                const menuName = res.data.menuName

                const data = this.$refs.tree.data
                this.setMenuName(data, menuId, menuName)
              }
              this.closeMenuDialog()
            })
            .catch(() => {
              this.closeMenuDialog()
            })
        }
      })
    },
    setMenuName(treeData, menuId, menuName) {
      treeData.forEach(element => {
        if (element.menuId !== menuId) {
          if (element.children != null) {
            this.setMenuName(element.children, menuId, menuName)
          }
        } else {
          element.menuName = menuName
          return
        }
      })
    },
    handelEditQx(row) {
      this.qxvisible = true
      this.qxTitle = '编辑权限'
      this.qxForm = Object.assign({}, row)
    },
    handleAddQx(data) {
      this.qxvisible = true
      this.qxTitle = '添加权限'
      this.qxForm.menuId = data.menuId
    },
    closeQxDialog() {
      this.qxvisible = false
      this.$refs.qxForm.clearValidate()
      this.$refs.qxForm.resetFields()
    },
    handleSubmitQx() {
      this.$refs.qxForm.validate(valid => {
        if (valid) {
          let url = ''
          if (this.qxTitle === '添加权限') {
            // 添加
            url = '/core/syspermit/save'
          } else if (this.qxTitle === '编辑权限') {
            url = '/core/syspermit/modify'
          }
          request({
            url: url,
            method: 'post',
            params: this.qxForm
          }).then(() => {
            z.success('操作成功')
            this.getQXData(this.qxForm.menuId)
            this.closeQxDialog()
          })
        }
      })
    },
    // 懒加载
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve(this.treeData)
      }
      if (node.level === 1) {
        this.getOneTreeData(this.treeData[0].menuId)
        return resolve([])
      }
      if (node.level > 1) {
        this.getOneTreeData(node.data.menuId)
      }
      return resolve([])
    },

    getOneTreeData(id) {
      this.leafData = []
      request({
        url: '/core/sysmenu/menus',
        method: 'post',
        params: {
          parentId: id
        }
      }).then(res => {
        // 给数组对象添加children数组
        res.data.forEach(element => {
          element.children = []
        })
        this.leafData = res.data
        this.reback(this.treeData, id, this.leafData)
      })
    },
    reback(treeData, id, data) {
      for (const item in treeData) {
        const tmpid = treeData[item].menuId
        if (tmpid === id) {
          treeData[item].children = data
        } else {
          this.reback(treeData[item].children, id, data)
        }
      }
      return treeData
    },

    fnNodeClick(obj) {
      this.nodeData = Object.assign({}, obj)
      if (obj) {
        this.getMenuData(obj.menuId)
        this.getQXData(obj.menuId)
      }
    },

    getQXData(id) {
      this.qxData = []
      request({
        method: 'post',
        url: '/core/syspermit/findlist',
        params: {
          menuId: id
        }
      }).then(res => {
        this.qxData = res.data
      })
    },
    getMenuData(id) {
      this.menuData = []
      request({
        method: 'post',
        url: '/core/sysmenu/findlist',
        params: {
          parentId: id
        }
      }).then(res => {
        this.menuData = res.data
      })
    }
  }
}
</script>
<style >
.menumanage .custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 15px;
}
@media screen and (min-width: 650px) {
  .menumanage {
    overflow-x: scroll;
  }
}

/* //滚动条的宽度 */
.menumanage .bg-purple ::-webkit-scrollbar {
  width: 0px;
  height: 15px;
}

/* //滚动条的滑块 */
.menumanage .bg-purple ::-webkit-scrollbar-thumb {
  background-color: #dddee2;
  border-radius: 15px;
  display: none;
}

.menumanage .bg-purple .scrollbar-wrapper {
  overflow-x: hidden;
}
</style>
