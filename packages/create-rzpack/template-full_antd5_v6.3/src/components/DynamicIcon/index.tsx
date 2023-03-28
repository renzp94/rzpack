import React, { useEffect, useRef, useState } from 'react'
import { Spin } from 'antd'
import './index.less'

export interface IconProps {
  name: string
  className?: string
  style?: React.CSSProperties
  fill?: string
  width?: string
  height?: string
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
  width: '1em',
  height: '1em',
}

export default DynamicIcon
