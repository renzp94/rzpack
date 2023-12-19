import { Data, Params } from 'ahooks/lib/useAntdTable/types'
import { Service } from 'ahooks/lib/usePagination/types'
import { Form } from 'antd'
import React from 'react'

import { useColumns, useGenerateModal, useHeaderColumns, useTools } from './hooks'
import { fetchYagtProjectInterface } from '@/api/yagt'
import ProTable, { useProTable } from '@/components/ProTable'

const Yagt = () => {
  const [form] = Form.useForm()

  const getList: Service<Data, Params> = async ({ current, pageSize }, formData) => {
    const {
      data: { list, total },
    } = await fetchYagtProjectInterface({ limit: pageSize, page: current, ...formData })
    return {
      list,
      total,
    }
  }
  const { search, tableProps } = useProTable(getList, { form })

  const headerColumns = useHeaderColumns()
  const tools = useTools()

  const { generateModalComponent, onShowModal } = useGenerateModal()
  const columns = useColumns(onShowModal)

  return (
    <>
      <ProTable
        columns={columns}
        header={{
          className: 'g-card',
          columns: headerColumns,
          formProps: { form, onFinish: search.submit },
        }}
        rowKey="id"
        scroll={{ x: 'max-content' }}
        tools={tools}
        {...tableProps}
      />
      {generateModalComponent}
    </>
  )
}

export default Yagt
