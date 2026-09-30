<script setup lang="ts">
import { reactive, ref } from 'vue';
import SysDialog from '@/components/Dialog/SysDialog.vue';
import type { FormRules } from 'element-plus';
import type { SysRole } from '@/api/role/type.ts';
import { addApi, deleteApi, editApi, getListApi } from '@/api/role';
import usePerm from '@/hooks/usePerm.ts';
import useTablePage from '@/hooks/useTablePage.ts';
import useTableHeight from '@/hooks/useTableHeight.ts';
import useCrudDialog from '@/hooks/useCrudDialog.ts';
import useDelete from '@/hooks/useDelete.ts';
import SearchBar from '@/components/SearchBar/SearchBar.vue';
import TablePager from '@/components/TablePager/TablePager.vue';
import TableEmpty from '@/components/TableEmpty/TableEmpty.vue';
import AssignTree from '@/views/system/Role/AssignTree.vue';

// 全局属性($myConfirm)与权限判断
const { hasPerm } = usePerm();

// 列表数据 + 分页
const {
  searchParm,
  tableList,
  loading,
  getList,
  searchBtn,
  resetBtn,
  sizeChange,
  currentChange,
} = useTablePage<SysRole>({ api: getListApi });

// 表格高度
const { tableHeight } = useTableHeight(300);

// 新增/编辑弹窗
const {
  dialog,
  addRef,
  addModel,
  submitting,
  openAdd,
  openEdit,
  close,
  submit,
} = useCrudDialog<SysRole>({
  createModel: () => ({ roleId: '', roleName: '', remark: '' }),
  addApi,
  editApi,
  addTitle: '新增角色',
  editTitle: '编辑角色',
  width: 400,
});

// 表单校验规则
const rules = reactive<FormRules<SysRole>>({
  roleName: [
    {
      required: true,
      message: '请输入角色名称',
      trigger: 'blur',
    },
  ],
});

// 分配菜单弹窗
const assignTree = ref<InstanceType<typeof AssignTree>>();
const assignTreeEdit = (row: SysRole) => {
  assignTree.value?.show(row.roleId, row.roleName);
};

// 删除(确认 + 调接口 + 刷新 + 提示,统一走 useDelete)
const { remove: deleteBtn } = useDelete(deleteApi, getList);
</script>

<template>
  <el-card>
    <!--搜素框-->
    <SearchBar :model="searchParm" @search="searchBtn" @reset="resetBtn">
      <el-form-item>
        <el-input
          v-model="searchParm.params"
          aria-label="角色关键字"
          placeholder="请输入关键字"
        ></el-input>
      </el-form-item>
      <template #actions>
        <el-button
          type="primary"
          icon="Plus"
          @click="openAdd()"
          v-if="hasPerm(['sys:role:add'])"
        >
          新增
        </el-button>
      </template>
    </SearchBar>
    <!-- 表格数据 -->
    <el-table
      v-loading="loading"
      :height="tableHeight"
      :data="tableList"
      row-key="roleId"
      border
      stripe
      :header-cell-style="{ 'text-align': 'center' }"
    >
      <el-table-column prop="roleName" label="角色名称" align="center" />
      <el-table-column prop="remark" label="角色备注" align="center" />
      <el-table-column
        label="操作"
        width="220"
        align="center"
        v-if="
          hasPerm(['sys:role:update', 'sys:role:allotMenu', 'sys:role:delete'])
        "
      >
        <template #default="scope">
          <el-button
            type="primary"
            icon="Edit"
            @click="openEdit(scope.row)"
            v-if="hasPerm(['sys:role:update'])"
          >
            编辑
          </el-button>
          <el-button
            type="success"
            icon="Setting"
            @click="assignTreeEdit(scope.row)"
            v-if="hasPerm(['sys:role:allotMenu'])"
          >
            分配菜单
          </el-button>
          <el-button
            type="danger"
            icon="Delete"
            @click="deleteBtn(scope.row.roleId)"
            v-if="hasPerm(['sys:role:delete'])"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <TableEmpty />
      </template>
    </el-table>
    <!-- 分页 -->
    <TablePager
      :current="searchParm.current"
      :size="searchParm.size"
      :total="searchParm.total"
      @update:size="sizeChange"
      @update:current="currentChange"
    />
    <!--新增,编辑弹窗-->
    <SysDialog
      :title="dialog.title"
      :width="dialog.width"
      :loading="submitting"
      :visible="dialog.visible"
      @on-close="close"
      @on-confirm="submit(getList)"
    >
      <template v-slot:content>
        <el-form
          ref="addRef"
          :model="addModel"
          :rules="rules"
          label-width="80px"
          size="default"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input
              v-model="addModel.roleName"
              placeholder="请输入角色名称"
            />
          </el-form-item>
          <el-form-item label="角色描述" prop="remark">
            <el-input v-model="addModel.remark" placeholder="请输入角色描述" />
          </el-form-item>
        </el-form>
      </template>
    </SysDialog>
    <!-- 分配菜单 -->
    <AssignTree ref="assignTree" />
  </el-card>
</template>
