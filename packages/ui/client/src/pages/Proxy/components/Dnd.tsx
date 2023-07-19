import React, { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { classNames } from '@/utils/tools'

export interface DndProps {
  children?: React.ReactElement
}

const Dnd = ({ children }: DndProps) => {
  return <DndProvider backend={HTML5Backend}>{children}</DndProvider>
}

export default Dnd

export const ItemTypes = {
  TYPE: 'DraggableBodyRow',
}

export interface DraggableBodyRowProps {
  className?: string
  index: number
}

export const DraggableBodyRow = ({ className, index, moveRow, style, ...restProps }: any) => {
  const ref = useRef()
  const [{ dropClassName, isOver }, drop] = useDrop({
    accept: ItemTypes.TYPE,
    collect: monitor => {
      const { index: dragIndex } = monitor.getItem() || {}
      if (dragIndex === index) {
        return {}
      }
      return {
        dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
        isOver: monitor.isOver(),
      }
    },
    drop: (item: any) => {
      moveRow(item.index, index)
    },
  })
  const [, drag] = useDrag({
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    item: { index },
    type: ItemTypes.TYPE,
  })
  drop(drag(ref))

  return (
    <tr
      className={classNames([className, { [dropClassName as string]: isOver }])}
      ref={ref}
      style={{ cursor: 'move', ...style }}
      {...restProps}
    />
  )
}
