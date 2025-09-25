<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue';
import SysDialog from '@/components/SysDialog.vue';
import useDialog from '@/hocks/useDialog.ts';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import type { SysRole } from '@/api/role/type.ts';
import { addApi, getListApi } from '@/api/role';
//-----------------------------上面导入依赖---------------------------
//表单绑定对象
const searchParm = reactive({
  current: 1,
  size: 5,
  params: '',
  total: 0,
});
//弹窗属性
const { dialog, onShow, onClose } = useDialog();
//新增表单绑定对象
const addModel = reactive({
  roleId: '',
  roleName: '',
  remark: '',
});
//表单ref属性
const addRef = ref<FormInstance>();
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
// --------------------- 上面定义参数 下面定义方法--------------------
//搜索按钮
const searchBtn = () => {
  getList();
};
//重置按钮
const resetBtn = () => {
  searchParm.params = '';
  searchParm.current = 1;
  getList();
};
//新增按钮
const addBtn = () => {
  dialog.title = '新增角色';
  dialog.height = 120;
  dialog.width = 400;
  //显示弹窗
  onShow();
};
//新增表单规则
const rules = reactive<FormRules<SysRole>>({
  roleName: [
    {
      required: true,
      message: '请输入角色名称',
      trigger: 'change',
    },
  ],
});
//表单提交
const commit = () => {
  addRef.value?.validate(async (valid) => {
    if (valid) {
      //提交表单
      console.log('提交表单');
      //提交请求
      let res = await addApi(addModel);
      if (res && res.code === 200) {
        await getList();
        ElMessage.success('新增成功');
        onClose();
      }
    }
  });
};
//查询列表
const getList = async () => {
  let res = await getListApi(searchParm);
  if (res && res.code === 200) {
    console.log(res);
    //设置表格数据
    tableList.value = res.data.records;
    //设置分页总条数
    searchParm.total = res.data.total;
  }
};
//编辑按钮
const editBtn = (row: SysRole) => {
  console.log(row);
};
//删除按钮
const deleteBtn = (roleId: string) => {
  console.log(roleId);
};
//挂载时操作
onMounted(() => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 300;
  });
  getList();
});
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
        <el-button type="primary" icon="Plus" @click="addBtn">新增</el-button>
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
      <el-table-column prop="createTime" label="创建时间" align="center" />
      <el-table-column label="操作" style="width: 220px" align="center">
        <template #default="scope">
          <el-button type="primary" icon="Edit" @click="editBtn(scope.row)">
            编辑
          </el-button>
          <el-button
            type="danger"
            icon="Delete"
            @click="deleteBtn(scope.row.roleId)"
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
      @on-close="onClose"
      @on-confirm="commit"
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
  </el-card>
</template>

<style scoped lang="scss"></style>
