import type {
  YagtInterfaceBodyModel,
  YagtInterfaceModel,
  YagtInterfaceReqQueryModel,
} from '@/models/yagt'
import type { ColumnType } from 'antd/es/table'

import { EllipsisOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { Descriptions, Dropdown, Modal, Tag, Tooltip, Typography } from 'antd'
import React from 'react'

import { message, modal } from '@/App'
import { CodeEditor, MethodTag, ProTable, StatusTag } from '@/components'
import { copyText, timeFormat } from '@/utils/tools'
import useModal from '@/utils/useModal'

import classes from './index.module.less'

export const useBaseInfo = (data: YagtInterfaceModel) => {
  return (
    <Descriptions bordered labelStyle={{ width: 130 }}>
      <Descriptions.Item label="接口名称" span={2}>
        {data?.title}
      </Descriptions.Item>
      <Descriptions.Item label="创建人" span={2}>
        {data?.username}
      </Descriptions.Item>
      <Descriptions.Item label="状态" span={2}>
        <StatusTag status={data?.status} />
      </Descriptions.Item>
      <Descriptions.Item label="更新时间" span={2}>
        {timeFormat(data?.up_time)}
      </Descriptions.Item>
      <Descriptions.Item label="接口路径" span={3}>
        <MethodTag method={data?.method} />
        <Typography.Text copyable>{data?.path}</Typography.Text>
      </Descriptions.Item>
    </Descriptions>
  )
}

export const useQueryCollapseItems = (data: YagtInterfaceModel) => {
  const { reqBody, reqQuery } = data ?? {}

  const items: Array<any> = []

  const reqQueryTools = useDropdownTools(reqQuery, renderQueryTsJson)

  if (reqQuery?.length) {
    const columns: ColumnType<any>[] = [
      {
        dataIndex: 'name',
        title: '参数名称',
        width: 120,
      },
      {
        dataIndex: 'required',
        render: (required: string) => {
          const isRequired = required === '1'
          return <Tag color={isRequired ? 'error' : 'default'}>{isRequired ? '是' : '否'}</Tag>
        },
        title: '是否必填',
        width: 100,
      },
      {
        dataIndex: 'desc',
        title: '备注',
      },
      {
        dataIndex: 'example',
        title: '示例',
      },
    ]

    items.push({
      children: (
        <ProTable columns={columns} dataSource={reqQuery} pagination={false} rowKey="_id" />
      ),
      extra: reqQueryTools,
      key: 'reqQuery',
      label: (
        <div className="g-card-title">
          <div className={classes.queryTitle}>
            请求参数 - Query
            <Tooltip
              placement="topLeft"
              title="Yapi的Query没有类型指定, 所以只能默认生成string|number类型, 如果不适用请手动修改"
            >
              <QuestionCircleOutlined className={classes.tooltip} />
            </Tooltip>
          </div>
        </div>
      ),
    })
  }

  const reqBodyTools = useDropdownTools(reqBody)
  if (reqBody) {
    const dataSource = getBodyDataSource(reqBody)
    const columns: ColumnType<any>[] = [
      {
        dataIndex: 'name',
        title: '参数名称',
        width: 120,
      },
      {
        dataIndex: 'type',
        title: '参数类型',
        width: 100,
      },
      {
        dataIndex: 'required',
        render: (required: boolean) => {
          return <Tag color={required ? 'error' : 'default'}>{required ? '是' : '否'}</Tag>
        },
        title: '是否必填',
        width: 100,
      },
      {
        dataIndex: 'description',
        title: '备注',
      },
    ]

    items.push({
      children: <ProTable columns={columns} dataSource={dataSource} pagination={false} />,
      extra: reqBodyTools,
      key: 'reqBody',
      label: <div className="g-card-title">请求参数 - Body</div>,
    })
  }

  return items
}

const baseTypes = ['string', 'integer', 'number', 'boolean']
const getBodyDataSource = (data?: YagtInterfaceBodyModel) => {
  let dataSource: any[] = []

  if (data?.type) {
    if (['array', 'object'].includes(data.type)) {
      const { properties, required } = data
      if (properties) {
        dataSource = Object.keys(properties).map(key => {
          const target = (properties as any)[key]

          let children = undefined
          let type = target.type
          if (target.type === 'object') {
            children = getBodyDataSource(target)
          } else if (target.type === 'array') {
            const list = getBodyDataSource(target.items)
            if (list.length === 1) {
              children = undefined
              type = `Array<${list[0].type}>`
            } else {
              children = getBodyDataSource(target.items)
            }
          }

          return {
            children,
            description: target.description,
            key,
            name: key,
            required: required?.includes?.(key),
            type,
          }
        })
      }
    } else {
      dataSource = [
        {
          type: data.type,
        },
      ]
    }
  }

  return dataSource
}

const renderBodyTsJson = (data?: YagtInterfaceBodyModel, gap = '  ') => {
  let json = ''
  if (data?.type) {
    if (['array', 'object'].includes(data.type)) {
      const { properties, required } = data
      if (properties) {
        json = Object.keys(properties).reduce((prev, key) => {
          const target = (properties as any)[key]

          const isRequired = required?.includes?.(key)

          let children = undefined
          if (target.type === 'object') {
            const childGap = `${gap}  `
            const json = renderBodyTsJson(target, childGap)
            children = json.replace(/\s*/g, '') ? `{${json}\n${gap}}` : 'Record<string,any>'
          } else if (target.type === 'array') {
            const childGap = `${gap}  `
            let json = renderBodyTsJson(target.items, childGap)
            json = json === 'integer' ? 'number' : json
            if (baseTypes.includes(json)) {
              children = `${json}[]`
            } else {
              children = json.replace(/\s*/g, '') ? `Array<{${json}\n${gap}}>` : 'any[]'
            }
          }

          const note = target.description ? `${gap}/** ${target.description} */\n` : ''
          const filed = `${key}${isRequired ? '' : '?'}`
          const type = children ?? (target.type === 'integer' ? 'number' : target.type)

          return `${prev}\n${note}${gap}${filed}: ${type}`
        }, '')
      }
    } else {
      return data.type
    }
  }

  return json
}

const renderQueryTsJson = (data?: YagtInterfaceReqQueryModel[], gap = '  ') => {
  let json = ''
  if (data?.length) {
    json = data.reduce((prev, item) => {
      const isRequired = item.required === '1'
      const note = item.desc ? `${gap}/** ${item.desc} */\n` : ''
      const filed = `${item.name}${isRequired ? '' : '?'}`
      const type = 'string | number'

      return `${prev}\n${note}${gap}${filed}: ${type}`
    }, '')
  }

  return json
}

const useDropdownTools = (
  data?: YagtInterfaceBodyModel | YagtInterfaceReqQueryModel[],
  render: any = renderBodyTsJson
) => {
  const { modalData, modalProps, setModalData, showModal } = useModal<string>('类型数据')

  const menus = [
    {
      key: 'data',
      label: '生成类型数据',
    },
    {
      key: 'file',
      label: '生成类型文件',
    },
  ]
  const onClick = ({ key }: { key: string }) => {
    if (key === 'file') {
      modal.warning({ content: '功能建设中...' })
      return
    }
    const json = render(data)
    const interfaceJson = `export interface Model {${json.replace(/"/g, '').replace(/,/g, '')}\n}`
    setModalData(interfaceJson)
    showModal()
  }

  const onOk = async () => {
    await copyText(modalData ?? '')
    message.success('复制成功')
  }

  return (
    <>
      <Dropdown menu={{ items: menus, onClick }}>
        <EllipsisOutlined className={classes.tools} />
      </Dropdown>
      <Modal {...modalProps} cancelText="关闭" okText="复制" onOk={onOk} width={800}>
        <CodeEditor
          defaultLanguage="typescript"
          height="60vh"
          onChange={val => setModalData(val ?? '')}
          value={modalData}
        />
      </Modal>
    </>
  )
}

export const useBodyCollapseItems = (data: YagtInterfaceModel) => {
  const { resBody } = data ?? {}

  const dataSource = getBodyDataSource(resBody)

  const columns: ColumnType<any>[] = [
    {
      dataIndex: 'name',
      title: '参数名称',
    },
    {
      dataIndex: 'type',
      title: '参数类型',
      width: 100,
    },
    {
      dataIndex: 'required',
      render: (required: boolean) => {
        return <Tag color={required ? 'error' : 'default'}>{required ? '是' : '否'}</Tag>
      },
      title: '是否必填',
      width: 100,
    },
    {
      dataIndex: 'description',
      title: '备注',
    },
  ]

  const tools = useDropdownTools(resBody)

  return [
    {
      children: <ProTable columns={columns} dataSource={dataSource} pagination={false} />,
      extra: tools,
      key: 'reqBody',
      label: <div className="g-card-title">返回数据</div>,
    },
  ]
}
