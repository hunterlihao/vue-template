<script setup lang="ts">
import { reactive } from 'vue';
import { ElMessage } from 'element-plus';
import SysDialog from '@/components/Dialog/SysDialog.vue';
import useInstance from '@/hooks/useInstance.ts';
import usePerm from '@/hooks/usePerm.ts';
import useTablePage from '@/hooks/useTablePage.ts';
import useTableHeight from '@/hooks/useTableHeight.ts';
import useCrudDialog from '@/hooks/useCrudDialog.ts';
import type { SysCategory } from '@/api/category/type.ts';
import { addApi, deleteApi, editApi, getListApi } from '@/api/category';
import { required } from '@/const/rules';

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
const {
  dialog,
  addRef,
  addModel,
  submitting,
  openAdd,
  openEdit,
  close,
  submit,
} = useCrudDialog<SysCategory>({
  createModel: () => ({
    categoryId: '',
    categoryName: '',
    categoryCode: '',
    orderNum: '',
    remark: '',
  }),
  addApi,
  editApi,
  addTitle: '新增类型',
  editTitle: '编辑类型',
  width: 500,
});

// 表单校验规则(公共规则见 @/const/rules)
const rules = reactive({
  categoryName: required('请输入类型名称'),
  categoryCode: required('请输入类型编码'),
  orderNum: required('请输入排序'),
});

// 删除
const deleteBtn = async (row: SysCategory) => {
  const confirm = await global.$myConfirm('确定要删除该数据吗？');
  if (!confirm) return;
  const res = await deleteApi(row.categoryId);
  if (res && res.code === 200) {
    await getList();
    ElMessage.success('删除成功');
  }
};
</script>

<template>
  <el-card>
    <el-form :model="searchParm" :inline="true" size="default">
      <el-form-item>
        <el-input
          v-model="searchParm.params"
          placeholder="请输入类型名称/编码"
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
          @click="openAdd()"
          v-if="hasPerm(['goods:category:add'])"
        >
          新增
        </el-button>
      </el-form-item>
    </el-form>

    <el-table
      :height="tableHeight"
      :data="tableList"
      border
      stripe
      :header-cell-style="{ 'text-align': 'center' }"
    >
      <el-table-column prop="categoryName" label="类型名称"></el-table-column>
      <el-table-column
        prop="categoryCode"
        label="类型编码"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="orderNum"
        label="排序"
        width="80"
        align="center"
      ></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="200"
        v-if="hasPerm(['goods:category:update', 'goods:category:delete'])"
      >
        <template #default="scope">
          <el-button
            type="primary"
            icon="Edit"
            @click="openEdit(scope.row)"
            v-if="hasPerm(['goods:category:update'])"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            icon="Delete"
            @click="deleteBtn(scope.row)"
            v-if="hasPerm(['goods:category:delete'])"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

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
          size="default"
        >
          <el-form-item label="类型名称" prop="categoryName">
            <el-input v-model="addModel.categoryName"></el-input>
          </el-form-item>
          <el-form-item label="类型编码" prop="categoryCode">
            <el-input v-model="addModel.categoryCode"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="orderNum">
            <el-input v-model="addModel.orderNum"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="addModel.remark" type="textarea"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </SysDialog>
  </el-card>
</template>

<style scoped lang="scss"></style>
