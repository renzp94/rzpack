import { Button, Space, Switch } from 'antd'
import React, { useEffect, useState } from 'react'

import EditModal from './components/EditModal'
import { message, modal } from '@/App'
import { removeProxy, updateAllProxyEnabled, updateProxyEnabled } from '@/api/proxy'
import { ProxyModel } from '@/models/proxy'
import useModal from '@/utils/useModal'

import styles from './index.module.less'

interface UseColumnsOptions {
  onEdit: (data: ProxyModel) => void
  refresh: () => void
}

export const useColumns = ({ onEdit, refresh }: UseColumnsOptions) => {
  const onRemove = (id: string) => {
    modal.confirm({
      content: '此操作将删除该接口代理，是否继续',
      onOk: async () => {
        const { msg } = await removeProxy(id)
        message.success(msg)
        refresh()
      },
      title: '警告',
    })
  }

  const [enabledId, setEnabledId] = useState('')
  const onUpdateEnabled = async (id: string, status: boolean) => {
    try {
      setEnabledId(id)
      await updateProxyEnabled(id, status)
      refresh()
    } finally {
      setEnabledId('')
    }
  }

  return [
    {
      dataIndex: 'path',
      title: '接口地址',
      width: 180,
    },
    {
      dataIndex: 'target',
      title: '代理地址',
    },
    {
      dataIndex: 'description',
      title: '描述',
    },
    {
      dataIndex: 'enabled',
      render: (status: boolean, record: ProxyModel) => (
        <Switch
          checked={status}
          data-no-drag="true"
          loading={enabledId === record.id}
          onChange={() => onUpdateEnabled(record.id, !status)}
        />
      ),
      title: '是否开启',
      width: 120,
    },
    {
      key: 'action',
      render: (_: unknown, record: ProxyModel) => {
        return (
          <Space data-no-drag="true">
            <Button ghost onClick={() => onEdit(record)} type="primary">
              编辑
            </Button>
            <Button danger onClick={() => onRemove(record.id)}>
              删除
            </Button>
          </Space>
        )
      },
      title: '操作',
      width: 120,
    },
  ]
}

export const useEditModal = (refresh: () => void) => {
  const { hideModal, modalData, modalProps, setModalData, showModal } = useModal<ProxyModel>()
  const onEdit = (data: ProxyModel) => {
    setModalData(data)
    showModal()
  }
  const onEditModalOk = () => {
    onEditModalCancel()
    refresh()
  }
  const onEditModalCancel = () => {
    hideModal()
    setModalData(undefined)
  }

  const modalComponent = (
    <EditModal {...modalProps} data={modalData} onCancel={onEditModalCancel} onOk={onEditModalOk} />
  )

  return {
    modalComponent,
    onEdit,
    showModal,
  }
}
export interface UseToolsOptions {
  refresh: () => void
  showModal: () => void
  status: boolean
}
export const useTools = ({ refresh, showModal, status }: UseToolsOptions) => {
  const [loading, setLoading] = useState(false)
  const [checked, setChecked] = useState(status)
  useEffect(() => {
    setChecked(status)
  }, [status])
  const onUpdateEnabled = async () => {
    try {
      setLoading(true)
      const { msg } = await updateAllProxyEnabled(!checked)
      message.success(msg)
      refresh()
    } finally {
      setLoading(false)
    }
  }

  const toolsComponent = (
    <Space className={styles.header} size="large">
      <Button ghost onClick={showModal} type="primary">
        添加
      </Button>
      <div className={styles.switch}>
        <div>批量开关：</div>
        <Switch checked={checked} loading={loading} onChange={onUpdateEnabled} />
      </div>
    </Space>
  )

  return toolsComponent
}
