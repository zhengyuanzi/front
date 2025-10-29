<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
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
    Workload: 0
  })

  onMounted(() => {
    if (route.query.id) {
      getTaskDetail(<string>route.query.id)
    }
  })

  function getTaskDetail(id: string) {
    fetchTaskDetail(id).then((res) => {
      formData.value = res
    })
  }

  const onSubmit = () => {
    const api = route.query.id ? fetchTaskUpdate : fetchTaskCreate
    api(formData.value).then(() => {
      ElMessage({
        message: route.query.id ? '更新成功' : '新增成功',
        type: 'success'
      })
      router.go(-1)
    })
  }

  const handleUploadSuccess: UploadProps['onSuccess'] = (response) => {
    formData.value.Prototype = response.data.image.url
  }

  const handleBeforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.size / 1024 / 1024 > 32) {
      ElMessage.error('图片限制最大上传32MB!')
      return false
    }
    return true
  }
</script>

<template>
  <el-card shadow="never" header="任务单详情">
    <el-form :model="formData" label-width="auto" style="max-width: 600px">
      <el-form-item label="任务编号">
        <el-input v-model="formData.TaskId" style="width: 400px" placeholder="请输入任务编号" />
      </el-form-item>
      <el-form-item label="任务名称">
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
      <el-form-item label="工作量">
        <el-input v-model="formData.Workload" style="width: 400px" placeholder="请输入工作量" />
      </el-form-item>
      <el-form-item label="原型图">
        <el-upload
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
        <el-button type="primary" @click="onSubmit">保存</el-button>
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
