import { AppRouteRecord } from '@/types/router'

export const dashboardRoutes: AppRouteRecord = {
  name: 'Dashboard',
  path: '/dashboard',
  component: '/index/index',
  meta: {
    title: '工作台',
    icon: '&#xe721;',
    roles: ['R_SUPER', 'R_ADMIN']
  },
  children: [
    {
      path: 'task',
      name: 'Task',
      component: '/dashboard/task',
      meta: {
        title: '任务单',
        keepAlive: false
      }
    },
    {
      path: 'taskDetail',
      name: 'TaskDetail',
      component: '/dashboard/task/detail',
      meta: {
        title: '任务单详情',
        keepAlive: false,
        isHide: true,
        isHideTab: true,
        activePath: '/dashboard/task'
      }
    }
  ]
}
