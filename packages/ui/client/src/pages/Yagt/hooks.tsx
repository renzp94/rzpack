import type { ProTableHeaderColumn } from '@/components/ProTable/ProTableHeader'
import type { YagtProjectInterfaceModel, YagtProjectInterfaceStatus } from '@/models/yagt'
import type { ColumnsType } from 'antd/es/table'
import type { Method } from 'axios'

import { useRequest } from 'ahooks'
import { Button, Typography } from 'antd'
import React from 'react'

import DetailsModal from './components/DetailsModal'
import GenerateModal from './components/GenerateModal'
import { fetchYagtProjectInterfaceMenus } from '@/api/yagt'
import { MethodTag, ProInput, StatusTag } from '@/components'
import ProSelect from '@/components/ProSelect'
import { useOrderNumberColumn } from '@/components/ProTable'
import useModal from '@/utils/useModal'

export const useHeaderColumns = (): Array<ProTableHeaderColumn> => {
  const { data } = useRequest(fetchYagtProjectInterfaceMenus)

  return [
    {
      content: (
        <ProSelect fieldNames={{ label: 'name', value: 'id' }} options={(data?.data as []) ?? []} />
      ),
      formItemProps: {
        label: '分类',
        name: 'cid',
      },
      span: 8,
    },
    {
      content: <ProInput placeholder="请输入接口名称或接口地址" />,
      formItemProps: {
        label: '接口查询',
        name: 'pathOrName',
      },
      span: 8,
    },
  ]
}

export const useTools = () => {
  const { hideModal, modalProps, showModal } = useModal('项目详情')

  return (
    <>
      <Button ghost onClick={showModal} type="primary">
        配置信息
      </Button>
      <DetailsModal {...modalProps} footer={null} onOk={hideModal} />
    </>
  )
}

export const useColumns = (
  onShowModal: (id: number) => void
): ColumnsType<YagtProjectInterfaceModel> => {
  const orderColumn: any = useOrderNumberColumn()

  return [
    orderColumn,
    {
      dataIndex: 'title',
      title: '名称',
    },
    {
      dataIndex: 'path',
      render: (text: string) => {
        return <Typography.Text copyable>{text}</Typography.Text>
      },
      title: '地址',
    },
    {
      dataIndex: 'method',
      render: (method: Method) => <MethodTag method={method} />,
      title: '类型',
    },
    {
      dataIndex: 'status',
      render: (status: YagtProjectInterfaceStatus) => <StatusTag status={status} />,
      title: '状态',
    },
    {
      fixed: 'right',
      key: 'action',
      render: (_: unknown, record: YagtProjectInterfaceModel) => {
        return (
          <Button className="g-action-link" onClick={() => onShowModal(record.id)} type="link">
            详情
          </Button>
        )
      },
      title: '操作',
      width: 120,
    },
  ]
}

export const useGenerateModal = () => {
  const { hideModal, modalData, modalProps, setModalData, showModal } = useModal<number>('接口详情')

  const generateModalComponent = (
    <GenerateModal {...modalProps} footer={null} id={modalData} onOk={hideModal} />
  )

  const onShowModal = (id: number) => {
    setModalData(id)
    showModal()
  }

  return {
    generateModalComponent,
    hideModal,
    onShowModal,
  }
}
