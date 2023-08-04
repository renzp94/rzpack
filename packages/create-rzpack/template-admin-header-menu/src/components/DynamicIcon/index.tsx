import { Spin } from 'antd'
import React from 'react'
import { useEffect, useRef, useState } from 'react'

import './index.less'

export interface IconProps {
  className?: string
  fill?: string
  height?: string
  name: string
  style?: React.CSSProperties
  width?: string
}

const DynamicIcon = (props: IconProps) => {
  const icon = useRef(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const dynamicImport = async (name: string) => {
      setLoading(true)
      const Icon = await import(`@/assets/svg/${name}.svg`)
      const { default: Component } = Icon

      icon.current = Component
      setLoading(false)
    }
    dynamicImport(props.name)
  }, [props.name, setLoading])

  if (!loading) {
    const Component = icon.current as any
    return <Component {...props} />
  }

  return <Spin className="dynamic-icon-spin" size="small" />
}

DynamicIcon.defaultProps = {
  height: '1em',
  width: '1em',
}

export default DynamicIcon
