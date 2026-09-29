<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import SysDialog from '@/components/Dialog/SysDialog.vue';
import useInstance from '@/hooks/useInstance.ts';
import usePerm from '@/hooks/usePerm.ts';
import useTablePage from '@/hooks/useTablePage.ts';
import useTableHeight from '@/hooks/useTableHeight.ts';
import useCrudDialog from '@/hooks/useCrudDialog.ts';
import type { CategoryOption } from '@/api/category/type.ts';
import { getSelectApi } from '@/api/category';
import type { SysGoods } from '@/api/goods/type.ts';
import { addApi, deleteApi, editApi, getListApi } from '@/api/goods';
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

// 所属类型下拉
const categoryOptions = ref<CategoryOption[]>([]);
const getCategoryOptions = async () => {
  const res = await getSelectApi();
  if (res && res.code === 200) {
    categoryOptions.value = res.data;
  }
};

// 新增/编辑弹窗
const { dialog, addRef, addModel, openAdd, openEdit, close, submit } =
  useCrudDialog<SysGoods>({
    createModel: () => ({
      goodsId: '',
      goodsName: '',
      categoryId: '',
      categoryName: '',
      price: 0,
      stock: 0,
      unit: '',
      remark: '',
    }),
    addApi,
    editApi,
    addTitle: '新增商品',
    editTitle: '编辑商品',
    width: 560,
    height: 420,
  });

// 打开弹窗前先取一次下拉数据
const addBtn = async () => {
  await getCategoryOptions();
  openAdd();
};
const editBtn = async (row: SysGoods) => {
  await getCategoryOptions();
  openEdit(row);
};

// 表单校验规则(公共规则见 @/const/rules)
const rules = reactive({
  goodsName: required('请输入商品名称'),
  categoryId: required('请选择所属类型', 'change'),
  price: required('请输入单价'),
  stock: required('请输入库存'),
  unit: required('请输入单位'),
});

// 删除
const deleteBtn = async (row: SysGoods) => {
  const confirm = await global.$myConfirm('确定要删除该数据吗？');
  if (!confirm) return;
  const res = await deleteApi(row.goodsId);
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
          placeholder="请输入商品名称"
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
          v-if="hasPerm(['goods:list:add'])"
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
      <el-table-column prop="goodsName" label="商品名称"></el-table-column>
      <el-table-column
        prop="categoryName"
        label="所属类型"
        align="center"
      ></el-table-column>
      <el-table-column prop="price" label="单价" width="100" align="center">
        <template #default="scope">￥{{ scope.row.price }}</template>
      </el-table-column>
      <el-table-column
        prop="stock"
        label="库存"
        width="90"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="unit"
        label="单位"
        width="80"
        align="center"
      ></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="200"
        v-if="hasPerm(['goods:list:update', 'goods:list:delete'])"
      >
        <template #default="scope">
          <el-button
            type="primary"
            icon="Edit"
            @click="editBtn(scope.row)"
            v-if="hasPerm(['goods:list:update'])"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            icon="Delete"
            @click="deleteBtn(scope.row)"
            v-if="hasPerm(['goods:list:delete'])"
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
      :height="dialog.height"
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
          <el-form-item label="商品名称" prop="goodsName">
            <el-input v-model="addModel.goodsName"></el-input>
          </el-form-item>
          <el-form-item label="所属类型" prop="categoryId">
            <el-select
              v-model="addModel.categoryId"
              placeholder="请选择所属类型"
              style="width: 100%"
            >
              <el-option
                v-for="item in categoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="单价" prop="price">
            <el-input-number
              v-model="addModel.price"
              :min="0"
              :precision="2"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="库存" prop="stock">
            <el-input-number
              v-model="addModel.stock"
              :min="0"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="单位" prop="unit">
            <el-input v-model="addModel.unit"></el-input>
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
