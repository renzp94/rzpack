import { useRequest } from 'ahooks'
import { Descriptions, Modal, ModalProps, Spin, Typography } from 'antd'
import React, { useEffect } from 'react'

import { fetchYagtProjectInfo } from '@/api/yagt'
import { timeFormat } from '@/utils/tools'

const DetailsModal = (props: ModalProps) => {
  const { data: projectInfo, loading, refresh } = useRequest(fetchYagtProjectInfo, { manual: true })

  useEffect(() => {
    if (props?.open) {
      refresh()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.open])

  return (
    <Modal {...props} width={1200}>
      <Spin spinning={loading}>
        <Descriptions bordered labelStyle={{ width: 130 }}>
          <Descriptions.Item label="项目ID" span={1}>
            {projectInfo?.data?.id}
          </Descriptions.Item>
          <Descriptions.Item label="项目名称" span={2}>
            {projectInfo?.data?.name}
          </Descriptions.Item>
          <Descriptions.Item label="YAPI地址" span={1}>
            {projectInfo?.data?.yapiUrl}
          </Descriptions.Item>
          <Descriptions.Item label="文档地址" span={2}>
            <Typography.Link href={projectInfo?.data?.webUrl} target="_blank">
              {projectInfo?.data?.webUrl}
            </Typography.Link>
          </Descriptions.Item>
          <Descriptions.Item label="项目TOKEN" span={3}>
            <Typography.Text copyable>{projectInfo?.data?.token}</Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {timeFormat(projectInfo?.data?.add_time)}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {timeFormat(projectInfo?.data?.up_time)}
          </Descriptions.Item>
        </Descriptions>
      </Spin>
    </Modal>
  )
}

export default DetailsModal
