<script setup lang="ts">
import { getAssignTreeApi } from '@/api/user';
import SysDialog from '@/components/Dialog/SysDialog.vue';
import useDialog from '@/hooks/useDialog.ts';
import { saveRoleMenuApi } from '@/api/role';
import { ElMessage, ElTree } from 'element-plus';
import { reactive, ref } from 'vue';
import { useUserStore } from '@/store/modules/user.ts';
import type { AssignParm, AssignTreeMenu } from '@/api/user/type.ts';

const userStore = useUserStore();

const { dialog, onClose, onShow } = useDialog();

const commitParm = reactive({
  roleId: '',
  list: [] as string[],
});

// 树数据(menuId 是字符串,与接口返回保持一致)
const assignTreeData = reactive({
  list: [] as AssignTreeMenu[],
  assignTreeChecked: [] as string[], // 已分配的菜单 id
});
const treeRef = ref<InstanceType<typeof ElTree>>();
// 树的属性配置
const defaultProps = {
  children: 'children',
  label: 'title',
};
// 树数据查询的参数
const parms = reactive<AssignParm>({
  userId: '',
  roleId: '',
});
// 查询菜单树
const getAssignTree = async () => {
  parms.userId = userStore.getUserId;
  const res = await getAssignTreeApi(parms);
  if (res && res.code === 200) {
    // 设置权限树数据
    assignTreeData.list = res.data.menuList;
    // 设置角色原来的权限Id
    assignTreeData.assignTreeChecked = res.data.checkList;
    // 数据回显:只勾选叶子节点,父节点由 el-tree 自行推导
    if (assignTreeData.assignTreeChecked.length > 0) {
      const newArr: string[] = [];
      assignTreeData.assignTreeChecked.forEach((item) => {
        checked(item, assignTreeData.list, newArr);
      });
      assignTreeData.assignTreeChecked = newArr;
    }
  }
};

/** 递归收集叶子节点 id */
const checked = (id: string, data: AssignTreeMenu[], newArr: string[]) => {
  data.forEach((item) => {
    if (item.menuId === id) {
      if (item.children && item.children.length === 0) {
        newArr.push(item.menuId);
      }
    } else if (item.children?.length) {
      // 递归调用
      checked(id, item.children, newArr);
    }
  });
};

// 提交
const commit = async () => {
  // 获取选择的菜单数据(组件未挂载时直接返回,避免非空断言)
  const tree = treeRef.value;
  if (!tree) return;
  const checkIds = tree.getCheckedKeys() as string[];
  const halfCheckIds = tree.getHalfCheckedKeys() as string[];
  const ids = [...checkIds, ...halfCheckIds];
  // 设置选中的节点
  commitParm.list = ids;

  // 判断是否已经选择菜单
  if (ids.length === 0) {
    ElMessage.error('请选择菜单');
    return;
  }
  const res = await saveRoleMenuApi(commitParm);
  if (res && res.code === 200) {
    ElMessage.success('分配成功');
    onClose();
  }
};

// 弹框显示
const show = async (roleId: string, name: string) => {
  commitParm.roleId = roleId;
  assignTreeData.assignTreeChecked = [];
  assignTreeData.list = [];
  commitParm.list = [];
  parms.roleId = roleId;
  dialog.width = 320;
  dialog.title = `为【${name}】分配菜单`;
  // 获取树数据
  await getAssignTree();
  onShow();
};
// 暴露出去，给外部组件使用
defineExpose({
  show,
});
</script>

<template>
  <SysDialog
    :title="dialog.title"
    :visible="dialog.visible"
    :width="dialog.width"
    @onClose="onClose"
    @onConfirm="commit"
  >
    <template #content>
      <div class="tree-container">
        <el-tree
          ref="treeRef"
          node-key="menuId"
          :data="assignTreeData.list"
          :props="defaultProps"
          :default-checked-keys="assignTreeData.assignTreeChecked"
          show-checkbox
          default-expand-all
        />
      </div>
    </template>
  </SysDialog>
</template>

<style scoped>
.tree-container {
  padding-right: 5px;
}
</style>
