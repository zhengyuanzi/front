<template>
  <div>
    <el-card shadow="never" :body-style="{ paddingBottom: '2px' }">
      <el-form ref="formRef" :inline="true" :model="formData">
        <el-form-item label="任务编号" prop="taskId">
          <el-input
            v-model="formData.taskId"
            placeholder="请输入任务编号"
            clearable
            style="width: 350px"
          />
        </el-form-item>
        <el-form-item label="任务名称" prop="taskName">
          <el-input
            v-model="formData.taskName"
            placeholder="请输入任务名称"
            clearable
            style="width: 350px"
          />
        </el-form-item>
        <el-form-item label="任务状态" prop="taskStatus">
          <el-select
            v-model="formData.taskStatus"
            placeholder="请选择状态"
            clearable
            style="width: 350px"
          >
            <el-option label="dev" value="0" />
            <el-option label="sit" value="1" />
            <el-option label="uat" value="2" />
            <el-option label="prod" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button type="primary" @click="handleReset(formRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" style="margin-top: 12px">
      <el-button
        type="primary"
        style="margin-bottom: 20px"
        @click="router.push('/dashboard/taskDetail')"
        >新增任务
      </el-button>
      <el-table v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column prop="TaskId" label="任务编号" min-width="180" />
        <el-table-column prop="TaskName" label="任务名称" min-width="220" />
        <el-table-column min-width="80" label="任务状态" align="center">
          <template #default="scope">{{ statusMap[scope.row.Status] }}</template>
        </el-table-column>
        <el-table-column prop="Workload" min-width="80" label="工作量" align="center" />
        <el-table-column prop="CreateTime" label="创建时间" />
        <el-table-column prop="UpdateTime" label="修改时间" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              link
              type="primary"
              @click="router.push(`/dashboard/taskDetail?id=${scope.row.Id}`)"
              >编辑
            </el-button>
            <el-popconfirm
              confirm-button-text="确认"
              cancel-button-text="取消"
              placement="top"
              title="确认删除？"
              @confirm="handleDelete(scope.row.Id)"
            >
              <template #reference>
                <el-button link type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="prev, pager, next" :total="total" />
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import { fetchTaskDelete, fetchTaskList, TaskItem } from '@/api/task'
  import { ElMessage, FormInstance } from 'element-plus'
  import { router } from '@/router'

  const tableData = ref<TaskItem[]>([])
  const formData = ref({
    taskId: '',
    taskName: '',
    taskStatus: ''
  })
  const total = ref(0)
  const loading = ref(false)
  const formRef = ref<FormInstance>()

  interface StatusMap {
    [key: number]: string
  }

  const statusMap = ref<StatusMap>({
    0: 'dev',
    1: 'sit',
    2: 'uat',
    3: 'prod'
  })

  onMounted(() => {
    getTaskList(1)
  })

  function getTaskList(page: number) {
    loading.value = true
    fetchTaskList({
      page,
      ...formData.value
    })
      .then((res) => {
        tableData.value = res?.list || []
        total.value = res?.total || 0
        loading.value = false
      })
      .catch(() => {
        loading.value = false
      })
  }

  function handleSearch() {
    getTaskList(1)
  }

  function handleReset(formEl: FormInstance | undefined) {
    if (!formEl) return
    formEl.resetFields()
    getTaskList(1)
  }

  function handleDelete(id: string) {
    fetchTaskDelete(id).then(() => {
      ElMessage({
        message: '删除成功',
        type: 'success'
      })
      getTaskList(1)
    })
  }
</script>

<style lang="scss" scoped>
  .pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
</style>
