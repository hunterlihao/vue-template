<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// 品牌列表数据
const trademarkList = ref([
  {
    id: 1,
    tmName: '华为',
    logoUrl:
      'https://m.360buyimg.com/babel/jfs/t25261/316/1935309672/11863/c53649a3/5bbdb392N2453677a.png',
    createTime: '2023-01-05 10:22:33',
    updateTime: '2023-06-10 15:30:45',
    sort: 1,
  },
  {
    id: 2,
    tmName: '小米',
    logoUrl:
      'https://m.360buyimg.com/babel/jfs/t20857/165/790879943/9759/82c9f9ba/5b18c8b1n5390c4de.jpg',
    createTime: '2023-01-06 11:35:12',
    updateTime: '2023-05-12 09:20:18',
    sort: 2,
  },
  {
    id: 3,
    tmName: '苹果',
    logoUrl:
      'https://m.360buyimg.com/babel/jfs/t1/95830/33/33432/5105/63d7678fF1b7a404d/e8f4521d2285042c.png',
    createTime: '2023-01-15 14:22:56',
    updateTime: '2023-07-01 16:45:32',
    sort: 3,
  },
  {
    id: 4,
    tmName: '三星',
    logoUrl:
      'https://m.360buyimg.com/babel/jfs/t12070/217/178910249/2646/96b57278/5a02a24bNe50a624a.jpg',
    createTime: '2023-02-01 09:12:45',
    updateTime: '2023-04-20 11:35:26',
    sort: 4,
  },
  {
    id: 5,
    tmName: 'OPPO',
    logoUrl:
      'https://m.360buyimg.com/babel/jfs/t1/84353/8/21140/7216/62143b01E2359f933/2baf80143b717c71.jpg',
    createTime: '2023-02-10 13:10:22',
    updateTime: '2023-03-15 14:25:16',
    sort: 5,
  },
]);

// 分页相关
const total = ref(50);
const currentPage = ref(1);
const pageSize = ref(10);

// 搜索表单
const searchForm = reactive({
  tmName: '',
});

// 添加/编辑品牌对话框
const dialogVisible = ref(false);
const dialogTitle = ref('添加品牌');

// 品牌表单
const trademarkForm = reactive({
  id: '',
  tmName: '',
  logoUrl: '',
  sort: 0,
});

// 表单规则
const rules = {
  tmName: [
    { required: true, message: '请输入品牌名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  logoUrl: [{ required: true, message: '请上传品牌Logo', trigger: 'blur' }],
  sort: [
    { required: true, message: '请输入排序号', trigger: 'blur' },
    { type: 'number', message: '排序号必须为数字', trigger: 'blur' },
  ],
};

// 上传相关
const uploadUrl = 'https://mock-api.example.com/upload';
const uploadHeaders = {
  Authorization: 'Bearer mock-token',
};

// 处理上传成功
const handleUploadSuccess = (_res, file) => {
  trademarkForm.logoUrl = URL.createObjectURL(file.raw);
  ElMessage.success('上传成功');
};

// 上传前校验
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/');
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isImage) {
    ElMessage.error('上传Logo只能是图片格式!');
    return false;
  }
  if (!isLt2M) {
    ElMessage.error('上传Logo大小不能超过 2MB!');
    return false;
  }
  return true;
};

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1;
  ElMessage.success('搜索成功');
};

// 重置搜索
const resetSearch = () => {
  searchForm.tmName = '';
  currentPage.value = 1;
  ElMessage.info('已重置搜索条件');
};

// 处理分页
const handleCurrentChange = (val) => {
  currentPage.value = val;
};

// 打开添加对话框
const openAddDialog = () => {
  dialogTitle.value = '添加品牌';
  Object.assign(trademarkForm, {
    id: '',
    tmName: '',
    logoUrl: '',
    sort: trademarkList.value.length + 1,
  });
  dialogVisible.value = true;
};

// 打开编辑对话框
const openEditDialog = (row) => {
  dialogTitle.value = '编辑品牌';
  Object.assign(trademarkForm, {
    id: row.id,
    tmName: row.tmName,
    logoUrl: row.logoUrl,
    sort: row.sort,
  });
  dialogVisible.value = true;
};

// 提交表单
const submitForm = () => {
  ElMessage.success(trademarkForm.id ? '修改成功' : '添加成功');
  dialogVisible.value = false;
};

// 删除品牌
const handleDelete = (_id, name) => {
  ElMessageBox.confirm(`确定要删除品牌"${name}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      ElMessage.success(`已删除品牌：${name}`);
    })
    .catch(() => {
      ElMessage.info('已取消删除');
    });
};
</script>

<template>
  <div class="trademark-container">
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="品牌名称">
          <el-input
            v-model="searchForm.tmName"
            placeholder="请输入品牌名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 操作按钮区域 -->
      <div class="action-bar">
        <el-button type="primary" @click="openAddDialog">添加品牌</el-button>
      </div>

      <!-- 表格区域 -->
      <el-table
        :data="trademarkList"
        border
        style="width: 100%; margin-top: 15px"
      >
        <el-table-column
          type="index"
          label="序号"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="tmName"
          label="品牌名称"
          width="150"
        ></el-table-column>
        <el-table-column prop="logoUrl" label="品牌Logo" width="200">
          <template #default="{ row }">
            <img :src="row.logoUrl" :alt="row.tmName" class="trademark-logo" />
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="sort"
          label="排序"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="{ row }">
            <el-button type="primary" link @click="openEditDialog(row)">
              编辑
            </el-button>
            <el-button
              type="danger"
              link
              @click="handleDelete(row.id, row.tmName)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 20, 50]"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 品牌表单对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="trademarkForm" label-width="100px" :rules="rules">
        <el-form-item label="品牌名称" prop="tmName">
          <el-input
            v-model="trademarkForm.tmName"
            placeholder="请输入品牌名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌Logo" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :headers="uploadHeaders"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
          >
            <img
              v-if="trademarkForm.logoUrl"
              :src="trademarkForm.logoUrl"
              class="avatar"
            />
            <div v-else class="avatar-uploader-empty">
              <el-icon>
                <Plus />
              </el-icon>
              <div class="el-upload__text">点击上传</div>
            </div>
          </el-upload>
          <div class="upload-tip">图片格式为JPG/PNG，大小不超过2MB</div>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="trademarkForm.sort"
            :min="0"
            :max="999"
            style="width: 100%"
          ></el-input-number>
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
.trademark-container {
  padding: 20px;

  .search-form {
    margin-bottom: 20px;
  }

  .action-bar {
    margin-bottom: 20px;
  }

  .trademark-logo {
    height: 50px;
    max-width: 180px;
    object-fit: contain;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  :deep(.avatar-uploader) {
    display: flex;
    justify-content: center;

    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);

      &:hover {
        border-color: var(--el-color-primary);
      }
    }
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
    object-fit: contain;
  }

  .avatar-uploader-empty {
    width: 178px;
    height: 178px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .el-icon {
      font-size: 28px;
      color: #8c939d;
    }

    .el-upload__text {
      margin-top: 8px;
      color: #8c939d;
    }
  }

  .upload-tip {
    font-size: 12px;
    color: #909399;
    margin-top: 5px;
    text-align: center;
  }
}
</style>
