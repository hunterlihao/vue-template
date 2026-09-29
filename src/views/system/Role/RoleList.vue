<script setup lang="ts">
import { reactive, ref } from 'vue';
import SysDialog from '@/components/Dialog/SysDialog.vue';
import { ElMessage, type FormRules } from 'element-plus';
import type { SysRole } from '@/api/role/type.ts';
import { addApi, deleteApi, editApi, getListApi } from '@/api/role';
import useInstance from '@/hooks/useInstance.ts';
import usePerm from '@/hooks/usePerm.ts';
import useTablePage from '@/hooks/useTablePage.ts';
import useTableHeight from '@/hooks/useTableHeight.ts';
import useCrudDialog from '@/hooks/useCrudDialog.ts';
import AssignTree from '@/views/system/Role/AssignTree.vue';

// 全局属性($myConfirm)与权限判断
const { global } = useInstance();
const { hasPerm } = usePerm();

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

// 新增/编辑弹窗
const { dialog, addRef, addModel, openAdd, openEdit, close, submit } =
  useCrudDialog<SysRole>({
    createModel: () => ({ roleId: '', roleName: '', remark: '' }),
    addApi,
    editApi,
    addTitle: '新增角色',
    editTitle: '编辑角色',
    width: 400,
    height: 120,
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
const assignTree = ref();
const assignTreeEdit = (row: SysRole) => {
  assignTree.value.show(row.roleId, row.roleName);
};

// 删除按钮
const deleteBtn = async (roleId: string) => {
  const confirm = await global.$myConfirm('确定要删除该数据吗？');
  if (!confirm) return;
  const res = await deleteApi(roleId);
  if (res && res.code === 200) {
    await getList();
    ElMessage.success('删除成功');
  }
};
</script>

<template>
  <el-card>
    <!--搜素框-->
    <el-form :model="searchParm" :inline="true">
      <el-form-item>
        <el-input
          placeholder="请输入关键字"
          v-model="searchParm.params"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" plain @click="searchBtn">
          查询
        </el-button>
        <el-button type="danger" icon="Refresh" plain @click="resetBtn">
          重置
        </el-button>
        <el-button
          type="primary"
          icon="Plus"
          @click="openAdd()"
          v-if="hasPerm(['sys:role:add'])"
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
      <el-table-column prop="roleName" label="角色名称" align="center" />
      <el-table-column prop="remark" label="角色备注" align="center" />
      <el-table-column
        label="操作"
        style="width: 220px"
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
    <!--新增,编辑弹窗-->
    <SysDialog
      :title="dialog.title"
      :width="dialog.width"
      :height="dialog.height"
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

<style scoped lang="scss"></style>
