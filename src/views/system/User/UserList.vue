<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import SysDialog from '@/components/Dialog/SysDialog.vue';
import SelectChecked from '@/components/SelectCheck/SelectChecked.vue';
import useInstance from '@/hooks/useInstance.ts';
import usePerm from '@/hooks/usePerm.ts';
import useTablePage from '@/hooks/useTablePage.ts';
import useTableHeight from '@/hooks/useTableHeight.ts';
import useCrudDialog from '@/hooks/useCrudDialog.ts';
import { useUserStore } from '@/store/modules/user.ts';
import type { SysUser } from '@/api/user/type.ts';
import type { RoleOption } from '@/api/role/type.ts';
import {
  addApi,
  deleteApi,
  editApi,
  getListApi,
  getRoleListApi,
  resetPasswordApi,
} from '@/api/user';
import { getSelectApi } from '@/api/role';
import {
  emailRules,
  nickNameRules,
  passwordRules,
  phoneRules,
  required,
  sexRules,
} from '@/const/rules';

// 全局属性($myConfirm)与权限判断
const { global } = useInstance();
const { hasPerm } = usePerm();
const $router = useRouter();
const userStore = useUserStore();

// 列表数据 + 分页
const {
  searchParm,
  tableList,
  getList,
  searchBtn,
  resetBtn,
  sizeChange,
  currentChange,
} = useTablePage({ api: getListApi });

// 表格高度
const { tableHeight } = useTableHeight(300);

// 角色下拉数据
const options = ref<RoleOption[]>([]);
// 选中组件的 ref
const selectRef = ref<InstanceType<typeof SelectChecked>>();
// 编辑时回显的角色 id(数组)
const bindValue = ref<Array<string | number>>([]);
// 编辑时回显的角色 id(逗号拼接)
const roleIds = ref<string>('');

// 新增/编辑弹窗
const {
  dialog,
  tags,
  addRef,
  addModel,
  submitting,
  openAdd,
  openEdit,
  close,
  submit,
} = useCrudDialog<SysUser>({
  createModel: () => ({
    userId: '',
    username: '',
    password: '',
    phone: '',
    email: '',
    sex: '',
    nickName: '',
    roleId: '',
    isEnabled: -1,
    isAdmin: -1,
  }),
  addApi,
  editApi,
  addTitle: '新增用户',
  editTitle: '编辑用户',
});

// 表单校验规则(公共规则见 @/const/rules)
const rules = reactive({
  nickName: nickNameRules,
  sex: sexRules,
  phone: phoneRules,
  username: required('请输入账号'),
  password: passwordRules,
  email: emailRules,
  roleId: required('请选择角色'),
});

// 手机号脱敏处理
const maskPhone = (phone: string) => {
  if (!phone) return '';
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

// 角色选中事件
const selected = (value: Array<string | number>) => {
  addModel.roleId = value.join(',');
};

// 查询角色下拉数据
const getSelect = async () => {
  const res = await getSelectApi();
  if (res && res.code === 200) {
    options.value = res.data;
  }
};

// 根据用户 id 查询用户角色
const getRoleList = async (userId: string) => {
  const res = await getRoleListApi(userId);
  if (res && res.code === 200) {
    bindValue.value = res.data;
    roleIds.value = res.data.join(',');
  }
};

// 新增按钮
const addBtn = async () => {
  options.value = [];
  bindValue.value = [];
  await getSelect();
  openAdd();
  await nextTick(() => {
    selectRef.value?.clear();
  });
};

// 编辑按钮
const editBtn = async (row: SysUser) => {
  options.value = [];
  await getSelect();
  await getRoleList(row.userId);
  openEdit(row, {
    fill: (model) => {
      model.password = '';
      model.roleId = roleIds.value;
    },
  });
};

// 删除按钮
const deleteBtn = async (userId: string) => {
  const confirm = await global.$myConfirm('确定要删除该数据吗？');
  if (!confirm) return;
  const res = await deleteApi(userId);
  if (res && res.code === 200) {
    await getList();
    ElMessage.success('删除成功');
  }
};

// 重置密码
const resetPassword = async (userId: string) => {
  const confirm = await global.$myConfirm('确定要重置密码吗?');
  if (!confirm) return;
  const res = await resetPasswordApi({ userId });
  if (res && res.code === 200) {
    await getList();
    ElMessage.success('重置成功,新密码为:123456');

    // 判断是否重置的是当前登录用户
    if (userId === userStore.getUserId) {
      ElMessage.success(
        '检测到重置的是当前登录用户，即将退出登录并跳转到登录页面',
      );
      setTimeout(async () => {
        await userStore.logout();
        await $router.push('/login');
      }, 1000);
    }
  }
};
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
          v-if="hasPerm(['sys:user:add'])"
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
            v-if="scope.row.sex === 0"
            size="default"
            effect="dark"
          >
            男
          </el-tag>
          <el-tag
            type="danger"
            v-if="scope.row.sex === 1"
            size="default"
            effect="dark"
          >
            女
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号">
        <template #default="scope">
          {{ maskPhone(scope.row.phone) }}
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="username" label="账户"></el-table-column>
      <el-table-column prop="isEnabled" label="状态" align="center">
        <template #default="scope">
          <el-tag
            type="success"
            v-if="scope.row.isEnabled === 1"
            size="default"
            effect="dark"
          >
            启用
          </el-tag>
          <el-tag type="danger" v-else size="default" effect="dark">
            禁用
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isAdmin" label="是否超级管理员" align="center">
        <template #default="scope">
          <el-tag
            type="primary"
            v-if="scope.row.isAdmin === 1"
            size="default"
            effect="dark"
          >
            是
          </el-tag>
          <el-tag type="danger" v-else size="default" effect="dark">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="315"
        v-if="
          hasPerm([
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
              v-if="hasPerm(['sys:user:update'])"
            >
              编辑
            </el-button>
            <el-button
              type="warning"
              icon="Setting"
              @click="resetPassword(scope.row.userId)"
              v-if="hasPerm(['sys:user:updatePassword'])"
            >
              重置密码
            </el-button>
            <el-button
              type="danger"
              icon="Delete"
              @click="deleteBtn(scope.row.userId)"
              v-if="hasPerm(['sys:user:delete'])"
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
      :current-page="searchParm.current"
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
      :loading="submitting"
      @onClose="close"
      @onConfirm="submit(getList)"
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
                  <el-radio :value="0">男</el-radio>
                  <el-radio :value="1">女</el-radio>
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
                  v-model="bindValue"
                  :options="options"
                  @update:model-value="selected"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12" :offset="0">
              <el-form-item label="状态: " prop="isEnabled">
                <el-radio-group v-model="addModel.isEnabled">
                  <el-radio :value="1">启用</el-radio>
                  <el-radio :value="0">禁用</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item label="管理员: " prop="isAdmin">
                <el-radio-group v-model="addModel.isAdmin">
                  <el-radio :value="1">是</el-radio>
                  <el-radio :value="0">否</el-radio>
                </el-radio-group>
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
