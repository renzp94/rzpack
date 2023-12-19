import type { InputProps } from 'antd'

import { Input } from 'antd'
import React from 'react'

import { DEFAULT_INPUT_PROPS } from '@/utils/constants'

const ProInput = (props: InputProps) => {
  return <Input {...DEFAULT_INPUT_PROPS} {...props} />
}

export default ProInput
