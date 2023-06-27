import type { DragEndEvent, UniqueIdentifier } from '@dnd-kit/core'

import { DndContext, MouseSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import React from 'react'

export interface DndProps {
  children?: React.ReactElement
  keys?: UniqueIdentifier[]
  onDragEnd?(event: DragEndEvent): void
}

const Dnd = ({ children, keys = [], onDragEnd }: DndProps) => {
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  )
  return (
    <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd} sensors={sensors}>
      <SortableContext items={keys} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  )
}

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string
}

export const DndRow = (props: RowProps) => {
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
    id: props['data-row-key'],
  })

  const style: React.CSSProperties = {
    ...props.style,
    cursor: 'move',
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 99 } : {}),
  }

  return <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />
}
export { arrayMove } from '@dnd-kit/sortable'

export default Dnd
