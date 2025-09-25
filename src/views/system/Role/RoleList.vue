<script setup lang="ts">
import { reactive, ref } from 'vue';
import SysDialog from '@/components/SysDialog.vue';
import useDialog from '@/hocks/useDialog.ts';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import type { SysRole } from '@/api/role/type.ts';
import { addApi } from '@/api/role';
//-----------------------------上面导入依赖---------------------------
//表单绑定对象
const searchParm = reactive({
  current: '',
  size: '',
  roleName: '',
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
// --------------------- 上面定义参数 下面定义方法--------------------
//搜索按钮
const searchBtn = () => {};
//重置按钮
const resetBtn = () => {};
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
        ElMessage.success('新增成功');
        onClose();
      }
    }
  });
};
</script>

<template>
  <el-card>
    <!--搜素框-->
    <el-form :model="searchParm" :inline="true">
      <el-form-item>
        <el-input
          placeholder="请输入关键字"
          :v-model="searchParm.roleName"
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
