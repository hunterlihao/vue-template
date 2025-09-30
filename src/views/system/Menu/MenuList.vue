<script setup lang="ts">
import SysDialog from '@/components/Dialog/SysDialog.vue';
import useDialog from '@/hocks/useDialog.ts';
import { nextTick, onMounted, reactive, ref } from 'vue';
import { ElMessage, type FormInstance } from 'element-plus';
import {
  addApi,
  deleteApi,
  editApi,
  getListApi,
  getParentApi,
} from '@/api/menu';
import type { MenuType } from '@/api/menu/type.ts';
import useInstance from '@/hocks/useInstance.ts';
//-----------------------------上面导入依赖---------------------------
const { global } = useInstance();
//弹框属性
const { dialog, onShow, onClose } = useDialog();
//表单绑定对象
const addModel = reactive({
  menuId: '',
  parentId: '',
  title: '',
  code: '',
  name: '',
  path: '',
  url: '',
  type: -1,
  icon: '',
  parentName: '',
  orderNum: '',
});
// 获取上级菜单数据
const treeList = ref([]);
//表格数据
const tableList = ref([]);
const addRef = ref<FormInstance>();
//定义标识
const tags = ref('');
// --------------------- 上面定义参数 下面定义方法--------------------
//新增按钮
const addBtn = () => {
  tags.value = 'add';
  dialog.title = '新增菜单';
  dialog.visible = true;
  dialog.width = 600;
  dialog.height = 250;
  //清楚数据和校验
  addRef.value?.clearValidate();
  addRef.value?.resetFields();
  Object.assign(addModel, {
    menuId: '',
    parentId: '',
    title: '',
    code: '',
    name: '',
    path: '',
    url: '',
    type: -1,
    icon: '',
    parentName: '',
    orderNum: '',
  });
  //获取上级菜单
  getParent();
  onShow();
};

//提交按钮
const commit = () => {
  addRef.value?.validate(async (valid) => {
    if (valid) {
      console.log('校验成功');
      console.log(addModel);
      let res = null;
      if (tags.value === 'add') {
        res = await addApi(addModel);
      } else {
        res = await editApi(addModel);
      }
      if (res && res.code === 200) {
        ElMessage.success('操作成功');
        await getList();
        onClose();
      }
    }
  });
};
//表单验证规则
// 表单验证规则
const rules = reactive({
  parentId: [
    {
      required: true,
      message: '请选择上级菜单',
      trigger: ['blur'],
    },
  ],
  title: [
    {
      required: true,
      message: '请输入菜单名称',
      trigger: ['blur'],
    },
  ],
  code: [
    {
      required: true,
      message: '请输入权限字段',
      trigger: ['blur'],
    },
  ],
  name: [
    {
      required: true,
      message: '请输入路由名称',
      trigger: ['blur'],
    },
  ],
  path: [
    {
      required: true,
      message: '请输入路由地址',
      trigger: ['blur'],
    },
  ],
  url: [
    {
      required: true,
      message: '请输入路由地址',
      trigger: ['blur'],
    },
  ],
  type: [
    {
      required: true,
      message: '请输入菜单类型',
      trigger: ['blur'],
    },
  ],
  icon: [
    {
      required: true,
      message: '请输入菜单图标',
      trigger: ['blur'],
    },
  ],
  orderNum: [
    {
      required: true,
      message: '请输入菜单序号',
      trigger: ['blur'],
    },
  ],
});

// 上级选中事件
const treeCheckChange = (item: any) => {
  console.log(item);
  addModel.parentName = item.title ? item.title : '';
};

//获取上级菜单数据
const getParent = async () => {
  let res = await getParentApi();
  if (res && res.code === 200) {
    console.log(res.data);
    treeList.value = res.data;
  }
};
//获取表格数据
const getList = async () => {
  let res = await getListApi();
  if (res && res.code === 200) {
    tableList.value = res.data;
    console.log(res.data);
  }
};
//修改按钮
const editBtn = async (row: MenuType) => {
  tags.value = 'edit';
  console.log(row);
  dialog.title = '编辑菜单';
  dialog.visible = true;
  dialog.width = 600;
  dialog.height = 250;
  addRef.value?.clearValidate();
  addRef.value?.resetFields();
  //获取上级菜单
  await getParent();
  onShow();
  await nextTick(() => {
    Object.assign(addModel, row);
  });
};
//删除按钮
const deleteBtn = async (menuId: string) => {
  console.log(menuId);
  const confirm = await global.$myConfirm('确定要删除该数据吗？');
  if (confirm) {
    let res = await deleteApi(menuId);
    if (res && res.code === 200) {
      ElMessage.success('删除成功');
      await getList();
    }
  }
};
onMounted(() => {
  getList();
});
</script>

<template>
  <el-card>
    <el-button
      type="primary"
      icon="Plus"
      @click="addBtn"
      v-if="global.$hasPerm(['sys:menu:add'])"
    >
      新增菜单
    </el-button>
    <!-- 表格 -->
    <el-table
      :data="tableList"
      row-key="menuId"
      border
      stripe
      default-expand-all
      style="margin-top: 20px"
      :header-cell-style="{ 'text-align': 'center' }"
    >
      <el-table-column prop="title" label="菜单名称"></el-table-column>
      <el-table-column prop="icon" label="图标" align="center" width="80">
        <template #default="scope">
          <el-icon v-if="scope.row.icon">
            <component :is="scope.row.icon" />
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="菜单类型" width="100" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.type === 0" type="danger" size="default">
            目录
          </el-tag>
          <el-tag v-if="scope.row.type === 1" type="success" size="default">
            菜单
          </el-tag>
          <el-tag v-if="scope.row.type === 2" type="primary" size="default">
            按钮
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="parentName"
        label="上级菜单"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="name"
        label="路由名称"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="path"
        label="路由地址"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="url"
        label="组件路径"
        width="250"
      ></el-table-column>
      <el-table-column
        prop="code"
        label="权限字段"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="orderNum"
        label="序号"
        width="60"
        align="center"
      ></el-table-column>
      <el-table-column
        label="操作"
        width="220"
        align="center"
        v-if="global.$hasPerm(['sys:menu:update', 'sys:menu:delete'])"
      >
        <template #default="scope">
          <el-button
            type="primary"
            icon="Edit"
            size="default"
            @click="editBtn(scope.row)"
            v-if="global.$hasPerm(['sys:menu:update'])"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            icon="Delete"
            size="default"
            @click="deleteBtn(scope.row.menuId)"
            v-if="global.$hasPerm(['sys:menu:delete'])"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--  新增弹窗  -->
    <SysDialog
      :title="dialog.title"
      :visible="dialog.visible"
      :width="dialog.width"
      :height="dialog.height"
      @onClose="onClose"
      @onConfirm="commit"
    >
      <template v-slot:content>
        <el-form
          :model="addModel"
          ref="addRef"
          :rules="rules"
          label-width="80px"
          :inline="false"
          size="default"
        >
          <el-form-item label="菜单类型" prop="type">
            <el-radio-group v-model="addModel.type">
              <el-radio :value="0">目录</el-radio>
              <el-radio :value="1">菜单</el-radio>
              <el-radio :value="2">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="12" :offset="0">
              <el-form-item label="上级菜单" prop="parentId">
                <el-tree-select
                  v-model="addModel.parentId"
                  :data="treeList"
                  :render-after-expand="false"
                  show-checkbox
                  default-expand-all
                  check-strictly
                  @check-change="treeCheckChange"
                  :disabled="addModel.type === -1"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item label="菜单名称" prop="title">
                <el-input
                  v-model="addModel.title"
                  :disabled="addModel.type === -1"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" v-if="addModel.type !== 2">
            <el-col :span="12" :offset="0">
              <el-form-item label="菜单图标" prop="icon">
                <el-input
                  v-model="addModel.icon"
                  :disabled="addModel.type === -1"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item label="路由名称" prop="name">
                <el-input
                  v-model="addModel.name"
                  :disabled="addModel.type === -1"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12" :offset="0">
              <el-form-item label="菜单序号" prop="orderNum">
                <el-input
                  v-model="addModel.orderNum"
                  :disabled="addModel.type === -1"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item label="权限字段" prop="code">
                <el-input
                  v-model="addModel.code"
                  :disabled="addModel.type === -1"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12" :offset="0" v-if="addModel.type !== 2">
              <el-form-item label="路由地址" prop="path">
                <el-input
                  v-model="addModel.path"
                  :disabled="addModel.type === -1"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0" v-if="addModel.type === 1">
              <el-form-item label="组件路径" prop="url">
                <el-input
                  v-model="addModel.url"
                  :disabled="addModel.type === -1"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
    </SysDialog>
  </el-card>
</template>

<style scoped lang="scss"></style>
