<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';

// 用户列表数据
const userList = ref([
  {
    id: 1,
    username: '张三',
    nickname: 'admin',
    email: 'zhangsan@example.com',
    phone: '13800138001',
    status: 1,
    createTime: '2023-01-01 12:00:00',
    roleName: '超级管理员',
  },
  {
    id: 2,
    username: '李四',
    nickname: 'test',
    email: 'lisi@example.com',
    phone: '13800138002',
    status: 1,
    createTime: '2023-01-02 10:30:00',
    roleName: '测试人员',
  },
  {
    id: 3,
    username: '王五',
    nickname: 'dev',
    email: 'wangwu@example.com',
    phone: '13800138003',
    status: 0,
    createTime: '2023-01-03 09:15:00',
    roleName: '开发人员',
  },
  {
    id: 4,
    username: '赵六',
    nickname: 'guest',
    email: 'zhaoliu@example.com',
    phone: '13800138004',
    status: 1,
    createTime: '2023-01-04 14:20:00',
    roleName: '访客',
  },
]);

// 分页相关
const total = ref(100);
const currentPage = ref(1);
const pageSize = ref(10);

// 搜索表单数据
const searchForm = reactive({
  username: '',
  status: '',
});

// 添加/编辑用户对话框
const dialogVisible = ref(false);
const dialogTitle = ref('添加用户');
const userForm = reactive({
  id: '',
  username: '',
  nickname: '',
  email: '',
  phone: '',
  password: '',
  status: 1,
});

// 表单规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号码',
      trigger: 'blur',
    },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
  ],
};

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1;
  ElMessage.success('搜索成功');
  // 实际项目中这里会调用API
};

// 重置搜索
const resetSearch = () => {
  searchForm.username = '';
  searchForm.status = '';
  currentPage.value = 1;
  ElMessage.info('已重置搜索条件');
};

// 处理分页
const handleCurrentChange = (val) => {
  currentPage.value = val;
  // 实际项目中这里会重新加载数据
};

// 打开添加对话框
const openAddDialog = () => {
  dialogTitle.value = '添加用户';
  // 重置表单
  Object.assign(userForm, {
    id: '',
    username: '',
    nickname: '',
    email: '',
    phone: '',
    password: '',
    status: 1,
  });
  dialogVisible.value = true;
};

// 打开编辑对话框
const openEditDialog = (row) => {
  dialogTitle.value = '编辑用户';
  // 填充表单
  Object.assign(userForm, {
    id: row.id,
    username: row.username,
    nickname: row.nickname,
    email: row.email,
    phone: row.phone,
    password: '', // 编辑时通常不回显密码
    status: row.status,
  });
  dialogVisible.value = true;
};

// 提交表单
const submitForm = () => {
  ElMessage.success(userForm.id ? '修改成功' : '添加成功');
  dialogVisible.value = false;
  // 实际项目中这里会调用API
};

// 删除用户
const handleDelete = (id) => {
  ElMessage.success(`已删除ID为${id}的用户`);
  // 实际项目中这里会调用API
};
</script>

<template>
  <div class="user-container">
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="用户名">
          <el-input
            v-model="searchForm.username"
            placeholder="请输入用户名"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
          >
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 操作按钮区域 -->
      <div class="action-bar">
        <el-button type="primary" @click="openAddDialog">添加用户</el-button>
      </div>

      <!-- 表格区域 -->
      <el-table
        :data="userList"
        border
        stripe
        style="width: 100%; margin-top: 15px"
      >
        <el-table-column
          type="index"
          label="序号"
          width="70"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="username"
          label="用户名"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="nickname"
          label="昵称"
          width="120"
        ></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column
          prop="phone"
          label="手机号"
          width="130"
        ></el-table-column>
        <el-table-column
          prop="roleName"
          label="角色"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="180"
        ></el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template #default="{ row }">
            <el-button type="primary" link @click="openEditDialog(row)">
              编辑
            </el-button>
            <el-button type="danger" link @click="handleDelete(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 用户表单对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="userForm" label-width="100px" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="userForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!userForm.id">
          <el-input v-model="userForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="userForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.user-container {
  padding: 20px;

  .search-form {
    margin-bottom: 20px;
  }

  .action-bar {
    margin-bottom: 20px;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
