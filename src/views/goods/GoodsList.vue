<script setup lang="ts">
import { reactive, ref } from 'vue';
import SysDialog from '@/components/Dialog/SysDialog.vue';
import usePerm from '@/hooks/usePerm.ts';
import useTablePage from '@/hooks/useTablePage.ts';
import useTableHeight from '@/hooks/useTableHeight.ts';
import useCrudDialog from '@/hooks/useCrudDialog.ts';
import useDelete from '@/hooks/useDelete.ts';
import SearchBar from '@/components/SearchBar/SearchBar.vue';
import TablePager from '@/components/TablePager/TablePager.vue';
import TableEmpty from '@/components/TableEmpty/TableEmpty.vue';
import type { CategoryOption } from '@/api/category/type.ts';
import { getSelectApi } from '@/api/category';
import type { SysGoods } from '@/api/goods/type.ts';
import { addApi, deleteApi, editApi, getListApi } from '@/api/goods';
import { required } from '@/const/rules';

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
} = useTablePage<SysGoods>({ api: getListApi });

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
const {
  dialog,
  addRef,
  addModel,
  submitting,
  openAdd,
  openEdit,
  close,
  submit,
} = useCrudDialog<SysGoods>({
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

// 删除(确认 + 调接口 + 刷新 + 提示,统一走 useDelete)
const { remove } = useDelete(deleteApi, getList);
const deleteBtn = (row: SysGoods) => remove(row.goodsId);
</script>

<template>
  <el-card>
    <SearchBar :model="searchParm" @search="searchBtn" @reset="resetBtn">
      <el-form-item>
        <el-input
          v-model="searchParm.params"
          aria-label="商品名称"
          placeholder="请输入商品名称"
        ></el-input>
      </el-form-item>
      <template #actions>
        <el-button
          icon="Plus"
          type="primary"
          @click="addBtn"
          v-if="hasPerm(['goods:list:add'])"
        >
          新增
        </el-button>
      </template>
    </SearchBar>

    <el-table
      v-loading="loading"
      :height="tableHeight"
      :data="tableList"
      row-key="goodsId"
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
      <template #empty>
        <TableEmpty />
      </template>
    </el-table>

    <TablePager
      :current="searchParm.current"
      :size="searchParm.size"
      :total="searchParm.total"
      @update:size="sizeChange"
      @update:current="currentChange"
    />

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
