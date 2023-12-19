import type { SelectProps } from 'antd'

import { Select } from 'antd'
import React from 'react'

import { DEFAULT_SELECT_PROPS } from '@/utils/constants'

import './index.less'

const ProSelect = (props: SelectProps) => {
  return (
    <Select
      {...DEFAULT_SELECT_PROPS}
      maxTagCount="responsive"
      maxTagPlaceholder={omittedValues => {
        const tag = omittedValues.length > 0 ? omittedValues[0]?.label : ''

        return (
          <div className="pro-select__max-tag">
            <div className="pro-select__max-tag-text">{tag}</div>
            <div>+ {omittedValues.length}</div>
          </div>
        )
      }}
      {...props}
      className={`pro-select ${props.className ?? ''}`}
    />
  )
}

export default ProSelect
