<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// 菜单树数据
const menuData = ref([
  {
    id: 1,
    name: '系统管理',
    code: 'system',
    level: 1,
    path: '/system',
    type: 1, // 1:菜单 2:按钮
    status: 1, // 1:启用 0:禁用
    children: [
      {
        id: 2,
        name: '用户管理',
        code: 'user',
        level: 2,
        path: '/acl/user',
        type: 1,
        status: 1,
        children: [
          {
            id: 6,
            name: '添加用户',
            code: 'user.add',
            level: 3,
            type: 2,
            status: 1,
            children: [],
          },
          {
            id: 7,
            name: '编辑用户',
            code: 'user.edit',
            level: 3,
            type: 2,
            status: 1,
            children: [],
          },
          {
            id: 8,
            name: '删除用户',
            code: 'user.delete',
            level: 3,
            type: 2,
            status: 1,
            children: [],
          },
        ],
      },
      {
        id: 3,
        name: '角色管理',
        code: 'role',
        level: 2,
        path: '/acl/role',
        type: 1,
        status: 1,
        children: [
          {
            id: 9,
            name: '添加角色',
            code: 'role.add',
            level: 3,
            type: 2,
            status: 1,
            children: [],
          },
          {
            id: 10,
            name: '编辑角色',
            code: 'role.edit',
            level: 3,
            type: 2,
            status: 1,
            children: [],
          },
          {
            id: 11,
            name: '删除角色',
            code: 'role.delete',
            level: 3,
            type: 2,
            status: 1,
            children: [],
          },
        ],
      },
      {
        id: 4,
        name: '菜单管理',
        code: 'permission',
        level: 2,
        path: '/acl/permission',
        type: 1,
        status: 1,
        children: [],
      },
    ],
  },
  {
    id: 5,
    name: '商品管理',
    code: 'product',
    level: 1,
    path: '/product',
    type: 1,
    status: 1,
    children: [
      {
        id: 12,
        name: '品牌管理',
        code: 'trademark',
        level: 2,
        path: '/product/trademark',
        type: 1,
        status: 1,
        children: [],
      },
      {
        id: 13,
        name: '属性管理',
        code: 'attr',
        level: 2,
        path: '/product/attr',
        type: 1,
        status: 1,
        children: [],
      },
      {
        id: 14,
        name: 'SPU管理',
        code: 'spu',
        level: 2,
        path: '/product/spu',
        type: 1,
        status: 0, // 禁用状态
        children: [],
      },
      {
        id: 15,
        name: 'SKU管理',
        code: 'sku',
        level: 2,
        path: '/product/sku',
        type: 1,
        status: 1,
        children: [],
      },
    ],
  },
]);

// 默认展开的节点
const defaultExpandedKeys = ref([1, 5]);

// 添加/编辑菜单对话框
const dialogVisible = ref(false);
const dialogTitle = ref('添加菜单');

// 表单数据
const menuForm = reactive({
  id: '',
  name: '',
  code: '',
  level: 1,
  path: '',
  type: 1,
  status: 1,
  parentId: 0,
});

// 表单校验规则
const rules = {
  name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入权限编码', trigger: 'blur' }],
};

// 父级菜单选项
const parentOptions = ref([
  { value: 0, label: '顶级菜单' },
  { value: 1, label: '系统管理' },
  { value: 5, label: '商品管理' },
  { value: 2, label: '用户管理' },
  { value: 3, label: '角色管理' },
  { value: 4, label: '菜单管理' },
  { value: 12, label: '品牌管理' },
  { value: 13, label: '属性管理' },
  { value: 14, label: 'SPU管理' },
  { value: 15, label: 'SKU管理' },
]);

// 打开添加对话框
const openAddDialog = (parentId = 0) => {
  dialogTitle.value = '添加菜单';
  Object.assign(menuForm, {
    id: '',
    name: '',
    code: '',
    level: parentId === 0 ? 1 : parentId < 5 ? 2 : 3,
    path: '',
    type: 1,
    status: 1,
    parentId,
  });
  dialogVisible.value = true;
};

// 打开编辑对话框
const openEditDialog = (node) => {
  dialogTitle.value = '编辑菜单';
  Object.assign(menuForm, {
    id: node.id,
    name: node.name,
    code: node.code,
    level: node.level,
    path: node.path || '',
    type: node.type,
    status: node.status,
    parentId: 0, // 这里应该根据实际层级关系设置
  });
  dialogVisible.value = true;
};

// 提交表单
const submitForm = () => {
  ElMessage.success(menuForm.id ? '修改成功' : '添加成功');
  dialogVisible.value = false;
};

// 删除菜单
const handleDelete = (node) => {
  ElMessageBox.confirm(`确定要删除 ${node.name} 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      ElMessage.success(`已删除菜单：${node.name}`);
    })
    .catch(() => {
      ElMessage.info('已取消删除');
    });
};

// 设置节点图标
const getNodeIcon = (data) => {
  if (data.type === 2) return 'Key';
  return data.level === 1 ? 'Menu' : 'Operation';
};
</script>

<template>
  <div class="permission-container">
    <el-card class="box-card">
      <div class="action-bar">
        <el-button type="primary" @click="openAddDialog()">
          添加顶级菜单
        </el-button>
      </div>

      <!-- 树形控件 -->
      <el-tree
        :data="menuData"
        :default-expanded-keys="defaultExpandedKeys"
        node-key="id"
        :props="{ children: 'children', label: 'name' }"
      >
        <template #default="{ data }">
          <div class="custom-tree-node">
            <div class="node-content">
              <el-icon class="node-icon">
                <component :is="getNodeIcon(data)"></component>
              </el-icon>
              <span class="node-label">{{ data.name }}</span>
              <el-tag
                size="small"
                :type="data.type === 1 ? 'success' : 'info'"
                class="node-tag"
              >
                {{ data.type === 1 ? '菜单' : '按钮' }}
              </el-tag>
              <el-tag
                size="small"
                :type="data.status === 1 ? '' : 'danger'"
                class="node-tag"
              >
                {{ data.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </div>
            <div class="node-actions">
              <el-button
                type="primary"
                link
                size="small"
                @click.stop="openAddDialog(data.id)"
                v-if="data.level < 3 && data.type === 1"
              >
                添加子菜单
              </el-button>
              <el-button
                type="primary"
                link
                size="small"
                @click.stop="openEditDialog(data)"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                link
                size="small"
                @click.stop="handleDelete(data)"
                v-if="data.children.length === 0"
              >
                删除
              </el-button>
            </div>
          </div>
        </template>
      </el-tree>
    </el-card>

    <!-- 菜单表单对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="menuForm" label-width="100px" :rules="rules">
        <el-form-item label="父级菜单">
          <el-select
            v-model="menuForm.parentId"
            placeholder="请选择父级菜单"
            disabled
          >
            <el-option
              v-for="item in parentOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input
            v-model="menuForm.name"
            placeholder="请输入菜单名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="权限编码" prop="code">
          <el-input
            v-model="menuForm.code"
            placeholder="请输入权限编码"
          ></el-input>
        </el-form-item>
        <el-form-item label="菜单级别">
          <el-select
            v-model="menuForm.level"
            placeholder="请选择菜单级别"
            disabled
          >
            <el-option :label="'一级菜单'" :value="1"></el-option>
            <el-option :label="'二级菜单'" :value="2"></el-option>
            <el-option :label="'三级菜单'" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单类型">
          <el-radio-group v-model="menuForm.type">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单路径" v-if="menuForm.type === 1">
          <el-input
            v-model="menuForm.path"
            placeholder="请输入菜单路径"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="menuForm.status">
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
.permission-container {
  padding: 20px;

  .action-bar {
    margin-bottom: 20px;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    width: 100%;

    .node-content {
      display: flex;
      align-items: center;

      .node-icon {
        margin-right: 4px;
      }

      .node-label {
        margin-right: 10px;
      }

      .node-tag {
        margin-right: 5px;
      }
    }
  }
}
</style>
