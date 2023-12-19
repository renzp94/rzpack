import type { YagtInterfaceModel } from '@/models/yagt'

import { useRequest } from 'ahooks'
import { Collapse, Divider, Modal, ModalProps, Space, Spin } from 'antd'
import React, { useEffect } from 'react'

import { useBaseInfo, useBodyCollapseItems, useQueryCollapseItems } from './hooks'
import { fetchYagtInterfaceInfo } from '@/api/yagt'

export interface GenerateModalProps extends ModalProps {
  id?: number
}

const GenerateModal = ({ id, ...modalProps }: GenerateModalProps) => {
  const { data, loading, refresh } = useRequest(() => fetchYagtInterfaceInfo(id as number), {
    manual: true,
  })

  useEffect(() => {
    if (modalProps?.open) {
      refresh()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalProps?.open])

  const baseInfo = useBaseInfo(data?.data as YagtInterfaceModel)
  const queryItems = useQueryCollapseItems(data?.data as YagtInterfaceModel)
  const bodyItems = useBodyCollapseItems(data?.data as YagtInterfaceModel)

  return (
    <Modal {...modalProps} title={data?.data?.title} width={1200}>
      <Spin spinning={loading}>
        <Block child={baseInfo} title="基本信息" />
        <Block
          child={
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {queryItems?.length ? (
                <Collapse
                  bordered={false}
                  collapsible="icon"
                  defaultActiveKey={queryItems?.map(item => item.key as string)}
                  items={queryItems}
                />
              ) : null}
              {bodyItems?.length ? (
                <Collapse bordered={false} collapsible="icon" items={bodyItems} />
              ) : null}
            </Space>
          }
          title="参数信息"
        />
      </Spin>
    </Modal>
  )
}

const Block = (props: { child: React.ReactNode; title: string }) => {
  return (
    <div style={{ marginBottom: 12 }}>
      <Divider orientation="left">{props?.title}</Divider>
      {props?.child}
    </div>
  )
}

export default GenerateModal
