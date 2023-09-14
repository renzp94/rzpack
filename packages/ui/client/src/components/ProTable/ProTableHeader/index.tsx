import type { ReactNode } from 'react'

import { Button, Col, FormItemProps, FormProps, Row, Space } from 'antd'
import { Form } from 'antd'
import React from 'react'

import expandImage from './expand.png'
import { useExpand } from './useTableHeader.hooks'
import { classNames } from '@/utils/tools'

import './index.less'

export interface ProTableHeaderColumn {
  // 列内容元素
  content: ReactNode
  formItemProps?: FormItemProps<any>
  // 包含列的数量
  span?: number
}

export interface ProTableHeaderProps {
  // 按钮权限
  buttons?: ['reset' | 'search']
  className?: string
  // 一行几列
  colCount?: number
  // 表单列
  columns: Array<ProTableHeaderColumn>
  // 是否展开
  formProps?: FormProps
  // 重置按钮之后是否自动查询
  isResetSearch?: boolean
  // 重置表单
  onReset?: (values: any) => void
  style?: React.CSSProperties
}

const ProTableHeader = (props: ProTableHeaderProps) => {
  const {
    buttons = ['search', 'reset'],
    className,
    colCount = 4,
    columns,
    formProps,
    isResetSearch = true,
    style,
  } = props
  const { btnGroupsSpan, columnsWitchExpand, enableExpand, isExpand, onExpandChange } = useExpand(
    columns,
    colCount
  )

  const onReset = (e: any) => {
    e.preventDefault()

    formProps?.form?.resetFields()
    if (isResetSearch) {
      formProps?.form?.submit()
    }
    props?.onReset?.(formProps?.form?.getFieldsValue(true))
  }

  return (
    <div className={classNames(['pro-table-header', className])} style={style}>
      <Form {...formProps}>
        <Row gutter={24}>
          {columnsWitchExpand.map((column, index) => {
            const { hidden, isLastRow, ...formItemProps } = column.formItem ?? {}
            return (
              <Col hidden={hidden} key={index} span={column.span}>
                <Form.Item {...formItemProps} style={isLastRow ? { marginBottom: '0' } : undefined}>
                  {column.content}
                </Form.Item>
              </Col>
            )
          })}
          <Col className="pro-table-header__btn-group" span={btnGroupsSpan}>
            <Space>
              {buttons.includes('search') ? (
                <Button htmlType="submit" type="primary">
                  查询
                </Button>
              ) : null}
              {buttons.includes('reset') ? (
                <Button ghost htmlType="reset" onClick={onReset} type="primary">
                  重置
                </Button>
              ) : null}
              {enableExpand && (
                <Button className="pro-table-header__expand" onClick={onExpandChange} type="text">
                  {isExpand ? (
                    <div className="expand-item">
                      收起{' '}
                      <img alt="" className="expand-icon expand-icon--close" src={expandImage} />
                    </div>
                  ) : (
                    <div className="expand-item">
                      展开 <img alt="" className="expand-icon" src={expandImage} />
                    </div>
                  )}
                </Button>
              )}
            </Space>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default ProTableHeader
