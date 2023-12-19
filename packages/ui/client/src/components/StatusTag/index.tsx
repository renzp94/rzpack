import type { YagtProjectInterfaceStatus } from '@/models/yagt'

import { Tag } from 'antd'
import React from 'react'

export interface StatusTagProps {
  status: YagtProjectInterfaceStatus
}

const StatusTag = ({ status }: StatusTagProps) => {
  const titles = {
    done: '完成',
    undone: '未完成',
  }

  const colors = {
    done: 'success',
    undone: 'warning',
  }

  return <Tag color={colors[status]}>{titles[status]}</Tag>
}

export default StatusTag
