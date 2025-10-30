import request from '@/utils/http'

export interface TaskItemBase {
  Id?: number | ''
  TaskId: string
  TaskName: string
  Prototype: string
  Status: 0 | 1 | 2 | 3 | ''
  Workload: number
  CreateTime?: string
  UpdateTime?: string
}

export interface TaskItem extends TaskItemBase {
  ServerName?: string[]
}

export interface TaskItemRep extends TaskItemBase {
  ServerName?: string
}

export interface FetchTaskListSuccessRes {
  list: TaskItemRep[]
  total: number
}

export interface FetchTaskListParams {
  page: number
  taskId?: string
  taskName?: string
  taskStatus?: string
}

export function fetchTaskList(params: FetchTaskListParams): Promise<FetchTaskListSuccessRes> {
  return request.get({
    url: '/api/task/getTaskList',
    params
  })
}

export function fetchTaskDetail(id: string): Promise<TaskItemRep> {
  return request.get({
    url: '/api/task/getTaskDetail',
    params: {
      id
    }
  })
}

export function fetchTaskCreate(data: TaskItemRep): Promise<TaskItemRep> {
  return request.post({
    url: '/api/task/createTask',
    data
  })
}

export function fetchTaskUpdate(data: TaskItemRep) {
  return request.post({
    url: '/api/task/updateTask',
    data
  })
}

export function fetchTaskDelete(id: string) {
  return request.post({
    url: '/api/task/deleteTask',
    data: {
      id
    }
  })
}
