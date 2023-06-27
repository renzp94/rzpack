import { DragEndEvent } from '@dnd-kit/core'
import { useRequest } from 'ahooks'
import { Table } from 'antd'
import React, { useEffect, useState } from 'react'

import Dnd, { arrayMove, DndRow } from './components/Dnd'
import { useColumns, useEditModal, useTools } from './hooks'
import { fetchProxyList, moveProxy } from '@/api/proxy'
import { ProxyModel } from '@/models/proxy'

const Proxy = () => {
  const { data, loading, refresh } = useRequest(fetchProxyList)
  const [dataSource, setDataSource] = useState<ProxyModel[]>([])
  useEffect(() => setDataSource(data?.data ?? []), [data])

  const { modalComponent, onEdit, showModal } = useEditModal(refresh)
  const columns = useColumns({ onEdit, refresh })
  const tools = useTools({
    refresh,
    showModal,
    status: dataSource.length > 0 && dataSource.every(item => item.enabled),
  })

  const onDragEnd = async ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      let from = -1
      let to = -1
      setDataSource(prev => {
        from = prev.findIndex(i => i.id === active.id)
        to = prev.findIndex(i => i.id === over?.id)
        return arrayMove(prev, from, to)
      })

      if (from > -1 && to > -1) {
        try {
          await moveProxy(from, to)
        } catch {
          setDataSource(data?.data ?? [])
        }
      }
    }
  }

  return (
    <div>
      {tools}
      <Dnd keys={dataSource.map(item => item.id)} onDragEnd={onDragEnd}>
        <Table
          columns={columns}
          components={{
            body: {
              row: DndRow,
            },
          }}
          dataSource={dataSource}
          loading={loading}
          pagination={false}
          rowKey="id"
        />
      </Dnd>
      {modalComponent}
    </div>
  )
}

export default Proxy
