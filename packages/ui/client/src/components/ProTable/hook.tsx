import type {
  AntdTableOptions,
  AntdTableResult,
  Data,
  Params,
  Service,
} from 'ahooks/lib/useAntdTable/types'
import type { ColumnType } from 'antd/lib/table'

import { useAntdTable } from 'ahooks'
import { TablePaginationConfig } from 'antd'

import { DEFAULT_PAGE_SIZE } from '@/utils/constants'
import { isUndef } from '@/utils/tools'

/**
 * 序号列配置hooks
 * @param orderNumberColumnProps 序号列配置
 * @returns 返回序号列配置
 */
export const useOrderNumberColumn = (orderNumberColumnProps?: ColumnType<any>) => {
  return {
    hidden: false,
    key: 'table_row_index',
    render: (_t: unknown, _r: unknown, index: number) => index + 1,
    title: '序号',
    width: 65,
    ...(orderNumberColumnProps ?? {}),
  }
}
/**
 * 分页hooks
 * @param pagination 分页配置
 * @returns 返回分页配置
 */
export const useTablePagination = (pagination?: false | TablePaginationConfig) => {
  const defaultPagination = {
    pageSize: (pagination as TablePaginationConfig)?.pageSize ?? DEFAULT_PAGE_SIZE,
    showQuickJumper: true,
    showSizeChanger: true,
    showTotal: (total: number) =>
      `共 ${total} 条记录  第 ${(pagination as TablePaginationConfig)?.current ?? 1} / ${Math.ceil(
        total / ((pagination as TablePaginationConfig)?.pageSize ?? DEFAULT_PAGE_SIZE)
      )} 页`,
  }

  let tablePagination = pagination === false ? false : pagination
  if (tablePagination !== false) {
    tablePagination = isUndef(tablePagination)
      ? defaultPagination
      : {
          ...defaultPagination,
          ...tablePagination,
        }
  }

  return tablePagination
}

export type UseProTable = <TData extends Data, TParams extends Params>(
  service: Service<TData, TParams>,
  options?: AntdTableOptions<TData, TParams>
) => AntdTableResult<TData, TParams>
/**
 * ahooks的useAntdTable二次封装
 * @param service 请求函数
 * @param options 配置项
 * @returns 返回表格配置项
 */
export const useProTable: UseProTable = (service, options) => {
  const { ...useAntdTableOptions } = options ?? {}
  const tableOptions = useAntdTable(service, {
    defaultPageSize: DEFAULT_PAGE_SIZE,
    ...useAntdTableOptions,
    defaultType: 'advance',
  })
  tableOptions.tableProps.pagination = useTablePagination(tableOptions.tableProps.pagination)

  return tableOptions
}
