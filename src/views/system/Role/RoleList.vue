<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue';
import SysDialog from '@/components/SysDialog.vue';
import useDialog from '@/hocks/useDialog.ts';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import type { SysRole } from '@/api/role/type.ts';
import { addApi, deleteApi, getListApi, updateApi } from '@/api/role';
import useInstance from '@/hocks/useInstance.ts';
import AssignTree from '@/views/system/Role/AssignTree.vue';
//-----------------------------上面导入依赖---------------------------
//获取全局global
const { global } = useInstance();
//表单绑定对象
const searchParm = reactive({
  current: 1,
  size: 10,
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
//判断新增还是编辑 0新增 1编辑
const tags = ref('');
const assignTree = ref();
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
  tags.value = '0';
  dialog.title = '新增角色';
  dialog.height = 120;
  dialog.width = 400;
  // 清除之前的表单校验结果
  addRef.value?.clearValidate();
  Object.assign(addModel, {
    roleId: '',
    roleName: '',
    remark: '',
  });
  //显示弹窗
  onShow();
};
//新增表单规则
const rules = reactive<FormRules<SysRole>>({
  roleName: [
    {
      required: true,
      message: '请输入角色名称',
      trigger: 'blur',
    },
  ],
});
//表单提交
const commit = () => {
  addRef.value?.validate(async (valid) => {
    if (valid) {
      //提交表单
      console.log('提交表单');
      let res = null;
      //提交请求
      if (tags.value === '0') {
        //新增
        res = await addApi(addModel);
      } else {
        //编辑
        res = await updateApi(addModel);
      }
      if (res && res.code === 200) {
        await getList();
        ElMessage.success('操作成功');
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
  tags.value = '1';
  console.log(row);
  //显示弹窗
  dialog.visible = true;
  dialog.title = '编辑角色';
  dialog.height = 120;
  dialog.width = 400;
  addRef.value?.clearValidate();
  //回显数据
  Object.assign(addModel, row);
};
//删除按钮
const deleteBtn = async (roleId: string) => {
  console.log(roleId);
  console.log(global);
  const confirm = await global.$myConfirm('确定要删除该数据吗？');
  if (confirm) {
    let res = await deleteApi(roleId);
    if (res && res.code === 200) {
      await getList();
      ElMessage.success('删除成功');
    }
  }
};
// 分配菜单
const assignTreeEdit = (row: SysRole) => {
  assignTree.value.show(row.roleId, row.roleName);
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
            type="success"
            icon="Setting"
            @click="assignTreeEdit(scope.row)"
          >
            分配菜单
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
    <!-- 分配菜单 -->
    <AssignTree ref="assignTree" />
  </el-card>
</template>

<style scoped lang="scss"></style>
