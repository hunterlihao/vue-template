<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import useDialog from '@/hocks/useDialog.ts';
import { ElMessage, type FormInstance } from 'element-plus';
import SysDialog from '@/components/Dialog/SysDialog.vue';
import SelectChecked from '@/components/SelectCheck/SelectChecked.vue';
import useInstance from '@/hocks/useInstance.ts';
import { useUserStore } from '@/store/modules/user.ts';
import type { AddModel, SysUser } from '@/api/user/type.ts';
import {
  addApi,
  editApi,
  getListApi,
  getRoleListApi,
  deleteApi,
  resetPasswordApi,
} from '@/api/user';
import { getSelectApi } from '@/api/role';
//-----------------------------上面导入依赖---------------------------
const selectRef = ref();
const $router = useRouter();
const userStore = useUserStore();
//下拉数据
let options = ref<any>([]);
//获取全局global
const { global } = useInstance();
//表单ref属性
const addRef = ref<FormInstance>();
//表单绑定对象
const searchParm = reactive({
  current: 1,
  size: 10,
  total: 0,
  params: '',
});
//弹窗属性
const { dialog, onShow, onClose } = useDialog();
//新增表单绑定对象
const addModel = reactive<AddModel>({
  userId: '',
  username: '',
  password: '',
  phone: '',
  email: '',
  sex: '',
  nickName: '',
  roleId: '',
});
//表格数据
const tableList = ref([]);
//页容量改变时触发
const sizeChange = (size: number) => {
  searchParm.size = size;
  getList();
};
//页码改变时触发
const currentChange = (current: number) => {
  searchParm.current = current;
  getList();
};
//表格高度
const tableHeight = ref(0);
//判断新增还是编辑
const tags = ref('');

// 根据用户Id查询角色
const bindValue = ref([]);

const roleIds = ref<string>('');

const selected = (value: Array<string | number>) => {
  addModel.roleId = value.join(',');
  console.log(addModel);
};
// --------------------- 上面定义参数 下面定义方法--------------------
//查询按钮
const searchBtn = () => {
  getList();
};
//重置按钮
const resetBtn = () => {
  searchParm.current = 1;
  searchParm.params = '';
  getList();
};
// 新增按钮
const addBtn = async () => {
  tags.value = 'add';
  dialog.title = '新增用户';
  dialog.height = 230;
  //清空下拉数据
  options.value = [];
  // 清除之前的表单校验结果
  addRef.value?.clearValidate();
  Object.assign(addModel, {
    userId: '',
    username: '',
    password: '',
    phone: '',
    email: '',
    sex: '',
    nickName: '',
    roleId: '',
  });
  //获取角色下拉数据
  await getSelect();
  //显示弹窗
  onShow();
  await nextTick(() => {
    //清空之前选中的数据
    selectRef.value.clear();
  });
};
//提交按钮
const commit = () => {
  addRef.value?.validate(async (valid) => {
    console.log(addModel);
    if (valid) {
      console.log('验证成功');
      let res = null;
      if (tags.value === 'add') {
        res = await addApi(addModel);
      } else {
        res = await editApi(addModel);
      }
      if (res && res.code === 200) {
        await getList();
        //重新查询
        ElMessage.success('操作成功');
        //关闭弹窗
        onClose();
      }
    }
  });
};
//根据用户id查询用户角色
const getRoleList = async (userId: string) => {
  let res = await getRoleListApi(userId);
  if (res && res.code === 200) {
    bindValue.value = res.data;
    roleIds.value = res.data.join(',');
    console.log(res.data);
  }
};
// 编辑按钮
const editBtn = async (row: SysUser) => {
  tags.value = 'edit';
  //清空下拉数据
  options.value = [];
  //获取角色下拉数据
  await getSelect();
  await getRoleList(row.userId);
  dialog.title = '编辑用户';
  dialog.height = 230;
  // 清除之前的表单校验结果
  addRef.value?.clearValidate();
  Object.assign(addModel, {
    userId: '',
    username: '',
    password: '',
    phone: '',
    email: '',
    sex: '',
    nickName: '',
    roleId: '',
  });

  await nextTick(() => {
    //数据回显
    Object.assign(addModel, row);
    addModel.password = '';
    //设置角色id
    addModel.roleId = roleIds.value as string;
  });
  //显示弹窗
  onShow();
};
// 删除按钮
const deleteBtn = async (userId: string) => {
  console.log(userId);
  console.log(global);
  const confirm = await global.$myConfirm('确定要删除该数据吗？');
  if (confirm) {
    let res = await deleteApi(userId);
    if (res && res.code === 200) {
      await getList();
      ElMessage.success('删除成功');
    }
  }
};
// 重置密码
const resetPassword = async (userId: string) => {
  const confirm = await global.$myConfirm('确定要重置密码吗?');
  if (confirm) {
    let res = await resetPasswordApi({ userId: userId });
    if (res && res.code === 200) {
      await getList();
      ElMessage.success('重置成功,新密码为:123456');

      // 判断是否重置的是当前登录用户
      if (userId === userStore.getUserId) {
        ElMessage.success(
          '检测到重置的是当前登录用户，即将退出登录并跳转到登录页面',
        );
        // 延迟1秒后退出登录
        setTimeout(async () => {
          // 调用用户仓库中的退出登录方法
          await userStore.logout();

          // 跳转到登录页面
          await $router.push('/login');
        }, 1000);
      }
    }
  }
};
//规则
const rules = reactive({
  nickName: [
    {
      required: true,
      message: '请输入姓名',
      trigger: ['blur'],
    },
  ],
  sex: [
    {
      required: true,
      message: '请选择性别',
      trigger: ['blur'],
    },
  ],
  phone: [
    {
      required: true,
      message: '请输入手机号',
      trigger: ['blur'],
    },
  ],
  username: [
    {
      required: true,
      message: '请输入账号',
      trigger: ['blur'],
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: ['blur'],
    },
  ],
  email: [
    {
      required: true,
      message: '请输入邮箱',
      trigger: ['blur'],
    },
  ],
  roleId: [
    {
      required: true,
      message: '请选择角色',
      trigger: ['blur'],
    },
  ],
});
// 查询角色下拉数据
const getSelect = async () => {
  let res = await getSelectApi();
  if (res && res.code === 200) {
    options.value = res.data;
    console.log(res.data);
  }
};

//查询表格数据
const getList = async () => {
  let res = await getListApi(searchParm);
  if (res && res.code === 200) {
    tableList.value = res.data.records;
    searchParm.total = res.data.total;
  }
};
//挂载时操作
onMounted(() => {
  getList();
  nextTick(() => {
    tableHeight.value = window.innerHeight - 300;
  });
});
</script>

<template>
  <el-card>
    <el-form :model="searchParm" :inline="true" size="default">
      <el-form-item>
        <el-input
          v-model="searchParm.params"
          placeholder="请输入姓名"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="Search" type="primary" plain @click="searchBtn">
          搜索
        </el-button>
        <el-button icon="Refresh" type="danger" plain @click="resetBtn">
          重置
        </el-button>
        <el-button
          icon="Plus"
          type="primary"
          @click="addBtn"
          v-if="global.$hasPerm(['sys:user:add'])"
        >
          新增
        </el-button>
      </el-form-item>
    </el-form>
    <!-- 表格数据 -->
    <el-table
      :height="tableHeight"
      :data="tableList"
      border
      stripe
      :header-cell-style="{ 'text-align': 'center' }"
    >
      <el-table-column prop="nickName" label="姓名"></el-table-column>
      <el-table-column prop="sex" label="性别" align="center">
        <template #default="scope">
          <el-tag
            type="primary"
            v-if="scope.row.sex === '0'"
            size="default"
            effect="dark"
          >
            男
          </el-tag>
          <el-tag
            type="danger"
            v-if="scope.row.sex === '1'"
            size="default"
            effect="dark"
          >
            女
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="username" label="账户"></el-table-column>
      <el-table-column prop="isAdmin" label="是否超级管理员" align="center">
        <template #default="scope">
          <el-tag
            type="primary"
            v-if="scope.row.isAdmin === '1'"
            size="default"
            effect="dark"
          >
            是
          </el-tag>
          <el-tag type="danger" v-else size="default" effect="dark">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="315"
        v-if="
          global.$hasPerm([
            'sys:user:update',
            'sys:user:updatePassword',
            'sys:user:delete',
          ])
        "
      >
        <template #default="scope">
          <div class="action-buttons">
            <el-button
              type="primary"
              icon="Edit"
              @click="editBtn(scope.row)"
              v-if="global.$hasPerm(['sys:user:update'])"
            >
              编辑
            </el-button>
            <el-button
              type="warning"
              icon="Setting"
              @click="resetPassword(scope.row.userId)"
              v-if="global.$hasPerm(['sys:user:updatePassword'])"
            >
              重置密码
            </el-button>
            <el-button
              type="danger"
              icon="Delete"
              @click="deleteBtn(scope.row.userId)"
              v-if="global.$hasPerm(['sys:user:delete'])"
            >
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page.sync="searchParm.current"
      :page-sizes="[5, 10, 15, 20, 25]"
      :page-size="searchParm.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="searchParm.total"
      background
      style="margin-top: 10px"
    ></el-pagination>
    <!-- 新增、编辑 -->
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
          label-width="90px"
          :inline="false"
          size="default"
        >
          <el-row :gutter="20">
            <el-col :span="12" :offset="0">
              <el-form-item label="姓名: " prop="nickName">
                <el-input v-model="addModel.nickName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item label="性别: " prop="sex">
                <el-radio-group v-model="addModel.sex">
                  <el-radio :value="'0'">男</el-radio>
                  <el-radio :value="'1'">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12" :offset="0">
              <el-form-item label="手机号: " prop="phone">
                <el-input v-model="addModel.phone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item label="邮箱: " prop="email">
                <el-input v-model="addModel.email"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12" :offset="0">
              <el-form-item label="角色: " prop="roleId">
                <SelectChecked
                  ref="selectRef"
                  :options="options"
                  :bindValue="bindValue"
                  @selected="selected"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12" :offset="0">
              <el-form-item label="账户: " prop="username">
                <el-input v-model="addModel.username"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0" v-if="tags === 'add'">
              <el-form-item label="密码: " prop="password">
                <el-input
                  type="password"
                  v-model="addModel.password"
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
