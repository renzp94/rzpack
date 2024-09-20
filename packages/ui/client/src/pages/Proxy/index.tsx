import { useRequest } from 'ahooks'
import React, { useCallback, useEffect, useState } from 'react'

import Dnd, { DraggableBodyRow } from './components/Dnd'
import { useColumns, useTools } from './hooks'
import { fetchProxyList, moveProxy } from '@/api/proxy'
import { ProTable } from '@/components'
import { ProxyModel } from '@/models/proxy'

import classes from './index.module.less'

const Proxy = () => {
  const { data, loading, refresh } = useRequest(fetchProxyList)
  const [dataSource, setDataSource] = useState<ProxyModel[]>([])
  useEffect(() => setDataSource(data?.data ?? []), [data])

  const { onEdit, tools } = useTools({
    refresh,
    status: dataSource.length > 0 && dataSource.every(item => item.enabled),
  })
  const columns = useColumns({ onEdit, refresh })

  const components = {
    body: {
      row: DraggableBodyRow,
    },
  }

  const moveRow = useCallback(
    async (dragIndex: number, hoverIndex: number) => {
      if (dragIndex === hoverIndex) {
        return
      }

      setDataSource(val => {
        const list = [...val]
        list.splice(hoverIndex, 1, ...list.splice(dragIndex, 1, list[hoverIndex]))
        return list
      })
      try {
        await moveProxy(dragIndex, hoverIndex)
      } catch {
        setDataSource(data?.data ?? [])
      }
    },
    [data?.data]
  )

  return (
    <div className={classes.page}>
      <Dnd>
        <ProTable
          columns={columns}
          components={components}
          dataSource={dataSource}
          loading={loading}
          onRow={(_: unknown, index?: number) => {
            return {
              index,
              moveRow,
            } as any
          }}
          pagination={false}
          rowKey="id"
          tools={tools}
        />
      </Dnd>
    </div>
  )
}

export default Proxy
