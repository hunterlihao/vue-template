<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';

// 角色列表数据
const roleList = ref([
  {
    id: 1,
    roleName: '超级管理员',
    roleCode: 'ROLE_ADMIN',
    description: '系统最高权限，可以管理所有功能',
    createTime: '2023-01-01 08:00:00',
    updateTime: '2023-06-15 16:30:00',
  },
  {
    id: 2,
    roleName: '普通管理员',
    roleCode: 'ROLE_MANAGER',
    description: '可以管理部分功能，无删除权限',
    createTime: '2023-02-05 10:20:00',
    updateTime: '2023-05-20 11:45:00',
  },
  {
    id: 3,
    roleName: '开发人员',
    roleCode: 'ROLE_DEV',
    description: '开发相关功能权限',
    createTime: '2023-03-10 09:15:00',
    updateTime: '2023-04-12 14:20:00',
  },
  {
    id: 4,
    roleName: '测试人员',
    roleCode: 'ROLE_TEST',
    description: '测试相关功能权限',
    createTime: '2023-03-15 11:30:00',
    updateTime: '2023-05-18 10:40:00',
  },
  {
    id: 5,
    roleName: '访客',
    roleCode: 'ROLE_GUEST',
    description: '只有查看权限，无操作权限',
    createTime: '2023-04-20 16:45:00',
    updateTime: '2023-04-20 16:45:00',
  },
]);

// 分页相关
const total = ref(50);
const currentPage = ref(1);
const pageSize = ref(10);

// 搜索表单
const searchForm = reactive({
  roleName: '',
  roleCode: '',
});

// 添加/编辑角色对话框
const dialogVisible = ref(false);
const dialogTitle = ref('添加角色');

// 角色表单
const roleForm = reactive({
  id: '',
  roleName: '',
  roleCode: '',
  description: '',
});

// 表单规则
const rules = {
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  roleCode: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
};

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1;
  ElMessage.success('搜索成功');
};

// 重置搜索
const resetSearch = () => {
  searchForm.roleName = '';
  searchForm.roleCode = '';
  currentPage.value = 1;
  ElMessage.info('已重置搜索条件');
};

// 处理分页
const handleCurrentChange = (val) => {
  currentPage.value = val;
};

// 打开添加对话框
const openAddDialog = () => {
  dialogTitle.value = '添加角色';
  Object.assign(roleForm, {
    id: '',
    roleName: '',
    roleCode: '',
    description: '',
  });
  dialogVisible.value = true;
};

// 打开编辑对话框
const openEditDialog = (row) => {
  dialogTitle.value = '编辑角色';
  Object.assign(roleForm, {
    id: row.id,
    roleName: row.roleName,
    roleCode: row.roleCode,
    description: row.description,
  });
  dialogVisible.value = true;
};

// 提交表单
const submitForm = () => {
  ElMessage.success(roleForm.id ? '修改成功' : '添加成功');
  dialogVisible.value = false;
};

// 删除角色
const handleDelete = (id) => {
  ElMessage.success(`已删除ID为${id}的角色`);
};

// 分配权限
const handleAssignAuth = (id, name) => {
  ElMessage.info(`正在为角色"${name}"(ID:${id})分配权限`);
};
</script>

<template>
  <div class="role-container">
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="角色名称">
          <el-input
            v-model="searchForm.roleName"
            placeholder="请输入角色名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="角色编码">
          <el-input
            v-model="searchForm.roleCode"
            placeholder="请输入角色编码"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 操作按钮区域 -->
      <div class="action-bar">
        <el-button type="primary" @click="openAddDialog">添加角色</el-button>
      </div>

      <!-- 表格区域 -->
      <el-table
        :data="roleList"
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
          prop="roleName"
          label="角色名称"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="roleCode"
          label="角色编码"
          width="150"
        ></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间"
          width="180"
        ></el-table-column>
        <el-table-column label="操作" width="250" align="center">
          <template #default="{ row }">
            <el-button type="primary" link @click="openEditDialog(row)">
              编辑
            </el-button>
            <el-button
              type="success"
              link
              @click="handleAssignAuth(row.id, row.roleName)"
            >
              分配权限
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
          :page-sizes="[10, 20, 50]"
          :background="true"
          layout="total, sizes, prev, pager, next"
          :total="total"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 角色表单对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="roleForm" label-width="100px" :rules="rules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="roleForm.roleName"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色编码" prop="roleCode">
          <el-input
            v-model="roleForm.roleCode"
            placeholder="请输入角色编码"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="roleForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入描述"
          ></el-input>
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
.role-container {
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
