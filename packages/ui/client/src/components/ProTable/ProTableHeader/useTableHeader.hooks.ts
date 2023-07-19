import type { ProTableHeaderColumn } from '.'

import { useCreation } from 'ahooks'
import { useState } from 'react'

export const useExpand = (columns: Array<ProTableHeaderColumn>, colCount: number) => {
  const defaultSpan = 24 / colCount

  const [isExpand, setIsExpand] = useState(false)
  const onExpandChange = () => setIsExpand(status => !status)

  // 默认列显示
  const columnsWithDefaultSpan = useCreation(() => {
    return columns.map(item => {
      const { span = defaultSpan } = item
      return {
        ...item,
        span,
      }
    })
  }, [columns, defaultSpan])

  // 显示两行的列个数
  const twoRowCount = useCreation(() => {
    let span = 0
    return (
      columnsWithDefaultSpan.findIndex(item => {
        span += item.span

        return span >= 48
      }) + 1
    )
  }, [columnsWithDefaultSpan])
  // 显示一行的列个数
  const oneRowCount = useCreation(() => {
    let span = 0
    return (
      columnsWithDefaultSpan.findIndex(item => {
        span += item.span

        return span >= 24
      }) + 1
    )
  }, [columnsWithDefaultSpan])
  // 是否可以展开
  const enableExpand = useCreation(() => twoRowCount > 0, [twoRowCount])
  // 根据是否展开计算的列显示
  const columnsWitchExpand = useCreation(() => {
    const rowCount = Math.ceil(
      columnsWithDefaultSpan.reduce((prev, curr) => prev + curr.span, 0) / 24
    )
    let spans = 0

    return columnsWithDefaultSpan.map((item, index) => {
      spans += item.span
      let isLastRow = false

      if (isExpand) {
        isLastRow = spans > (rowCount - 1) * 24 && spans < rowCount * 24
      } else {
        isLastRow =
          (twoRowCount === 0 && oneRowCount === 0) ||
          (index >= oneRowCount && index < twoRowCount) ||
          spans > 24
      }

      return {
        ...item,
        formItem: {
          ...item.formItemProps,
          hidden: !isExpand && enableExpand && twoRowCount <= index + 1,
          isLastRow,
        },
      }
    })
  }, [columnsWithDefaultSpan, enableExpand, isExpand, oneRowCount, twoRowCount])
  // 按钮组的span
  const btnGroupsSpan = useCreation(() => {
    const spans = columns.reduce((pre, curr) => {
      const { span = defaultSpan } = curr
      return pre + span
    }, 0)

    let span = defaultSpan

    if (enableExpand && !isExpand) {
      const showColumnSpans = columnsWitchExpand.reduce(
        (prev, curr) => (!curr.formItem.hidden ? prev + curr.span : prev),
        0
      )

      span = 48 - showColumnSpans
    } else {
      span = 24 - (spans % 24)
    }

    return span
  }, [columns, defaultSpan, enableExpand, isExpand, columnsWitchExpand])

  return {
    btnGroupsSpan,
    columnsWitchExpand,
    enableExpand,
    isExpand,
    onExpandChange,
  }
}
