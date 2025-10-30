<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { ElMessage, FormInstance } from 'element-plus'
  import { Plus } from '@element-plus/icons-vue'
  import type { UploadProps } from 'element-plus'
  import { fetchTaskCreate, fetchTaskDetail, fetchTaskUpdate, TaskItem } from '@/api/task'
  import { router } from '@/router'

  const route = useRoute()
  const formData = ref<TaskItem>({
    Id: '',
    TaskId: '',
    TaskName: '',
    Prototype: '',
    Status: '',
    Workload: 0,
    ServerName: [],
  })
  const serverNameList = ref(['苏坤', '冉敬稳', '文俊', '杜志立', '金山三', '宁成山', '李琪'])
  const formRef = ref<FormInstance>()
  const loading = ref(false);
  const uploadLoading = ref(false);

  onMounted(() => {
    if (route.query.id) {
      getTaskDetail(<string>route.query.id)
    }
  })

  function getTaskDetail(id: string) {
    loading.value = true;
    fetchTaskDetail(id).then((res) => {
      formData.value = {
        ...res,
        ServerName: res?.ServerName?.split(',')
      }
      loading.value = false;
    }).catch(() => {
      loading.value = false;
    })
  }

  const onSubmit = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
      if (valid) {
        const api = route.query.id ? fetchTaskUpdate : fetchTaskCreate
        loading.value = true;
        api({
          ...formData.value,
          ServerName: formData.value?.ServerName?.join(',')
        }).then(() => {
          ElMessage({
            message: route.query.id ? '更新成功' : '新增成功',
            type: 'success'
          })
          router.go(-1)
        }).finally(() => {
          loading.value = false;
        })
      }
    })
  }

  const handleUploadSuccess: UploadProps['onSuccess'] = (response) => {
    uploadLoading.value = false
    formData.value.Prototype = response.data.image.url
  }

  const handleBeforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.size / 1024 / 1024 > 5) {
      ElMessage.error('图片限制最大上传5MB!')
      return false
    }
    uploadLoading.value = true
    return true
  }
</script>

<template>
  <el-card shadow="never" header="任务单详情" v-loading="loading">
    <el-form ref="formRef" :model="formData" label-width="auto" style="max-width: 600px">
      <el-form-item prop="TaskId" label="任务编号" :rules="[{ required: true, message: '请输入任务编号' }]">
        <el-input v-model="formData.TaskId" style="width: 400px" placeholder="请输入任务编号" />
      </el-form-item>
      <el-form-item prop="TaskName" label="任务名称" :rules="[{ required: true, message: '请输入任务名称' }]">
        <el-input v-model="formData.TaskName" style="width: 400px" placeholder="请输入任务名称" />
      </el-form-item>
      <el-form-item label="任务状态">
        <el-select
          v-model="formData.Status"
          placeholder="请选择状态"
          clearable
          style="width: 400px"
        >
          <el-option label="dev" :value="0" />
          <el-option label="sit" :value="1" />
          <el-option label="uat" :value="2" />
          <el-option label="prod" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="后端人员">
        <el-select
          v-model="formData.ServerName"
          multiple
          placeholder="请选择后端人员"
          style="width: 400px"
        >
          <el-option
            v-for="(item, index) in serverNameList"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工作量">
        <el-input v-model="formData.Workload" style="width: 400px" placeholder="请输入工作量" />
      </el-form-item>
      <el-form-item label="原型图">
        <el-upload
          v-loading="uploadLoading"
          class="uploader"
          action="https://api.imgbb.com/1/upload"
          :show-file-list="false"
          :on-success="handleUploadSuccess"
          :before-upload="handleBeforeUpload"
          name="image"
          :data="{
            key: 'e1f0211dc34c0f79b9f328a708a61440'
          }"
        >
          <img v-if="formData.Prototype" :src="formData.Prototype" class="image" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="default" @click="router.go(-1)">取消</el-button>
        <el-button type="primary" @click="onSubmit(formRef)">保存</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style>
  .uploader .el-upload {
    position: relative;
    overflow: hidden;
    cursor: pointer;
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    transition: var(--el-transition-duration-fast);
  }

  .uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }

  .el-icon.avatar-uploader-icon {
    width: 178px;
    height: 178px;
    font-size: 28px;
    color: #8c939d;
    text-align: center;
  }

  .image {
    display: block;
    width: 300px;
    height: auto;
  }
</style>
