# ProTable

高级表格，将顶部搜索和表格主体封装在一起。

## 基本使用

```tsx
import type { ProTableHeaderColumn } from './ProTableHeader'
import React from 'react'
import { Button, Input, Select } from 'antd'
import ProTable from '@/pro-components/ProTable'

export default () => {
  const headerColumns: Array<ProTableHeaderColumn> = [
    {
      formItemProps: {
        name: 'order-number',
        label: '订单号',
      },
      content: <Input placeholder="请输入" />,
    },
    {
      formItemProps: {
        name: 'order-no',
        label: '订单编号',
      },
      content: <Input placeholder="请输入" />,
    },
  ]
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
    },
    {
      title: '住址',
      dataIndex: 'address',
    },
    {
      title: '性别',
      dataIndex: 'sex',
    },
    {
      title: '电话',
      dataIndex: 'tel',
    },
  ]
  const dataSource = Array.from({length: 5}).map((v,i) => ({
    key: i,
    name: `用户${i+1}`,
    age: 18,
    address: '中国',
    sex: '男',
    tel: '131****1111',
  }))

  const onSearch = (values: any) => {
    console.log(values)
  }

  return (
    <div style={{ background: '#f6f9fb', padding: 16 }}>
      <ProTable
        header={{
          columns: headerColumns,
          formProps: { onFinish: onSearch },
        }}
        columns={columns}
        dataSource={dataSource}
      />
    </div>
  )
}
```

## 使用序号列和通用分页

`ProTable`提供了一些快捷方法，用于支持快速开发。

- `useTablePagination`: 通用的分页
- `useOrderNumberColumn`: 序号列配置

```tsx
import type { ProTableHeaderColumn } from './ProTableHeader'
import React from 'react'
import { Button, Input, Select } from 'antd'
import ProTable, { useTablePagination, useOrderNumberColumn } from '@/pro-components/ProTable'

export default () => {
  const pagination = useTablePagination()
  const orderNumberColumn = useOrderNumberColumn()

  const headerColumns: Array<ProTableHeaderColumn> = [
    {
      formItemProps: {
        name: 'order-number',
        label: '订单号',
      },
      content: <Input placeholder="请输入" />,
    },
    {
      formItemProps: {
        name: 'order-no',
        label: '订单编号',
      },
      content: <Input placeholder="请输入" />,
    },
  ]
  const columns = [
    orderNumberColumn,
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
    },
    {
      title: '住址',
      dataIndex: 'address',
    },
    {
      title: '性别',
      dataIndex: 'sex',
    },
    {
      title: '电话',
      dataIndex: 'tel',
    },
  ]

  const dataSource = Array.from({length: 5}).map((v,i) => ({
    key: i,
    name: `用户${i+1}`,
    age: 18,
    address: '中国',
    sex: '男',
    tel: '131****1111',
  }))

  const onSearch = (values: any) => {
    console.log(values)
  }

  return (
    <div style={{ background: '#f6f9fb', padding: 16 }}>
      <ProTable
        header={{
          columns: headerColumns,
          formProps: { onFinish: onSearch },
        }}
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
      />
    </div>
  )
}
```

## 工具栏

可通过`tools`属性指定工具栏

```tsx
import type { ProTableHeaderColumn } from './ProTableHeader'
import React from 'react'
import { Button, Input, Select } from 'antd'
import ProTable from '@/pro-components/ProTable'

export default () => {
  const headerColumns: Array<ProTableHeaderColumn> = [
    {
      formItemProps: {
        name: 'order-number',
        label: '订单号',
      },
      content: <Input placeholder="请输入" />,
    },
    {
      formItemProps: {
        name: 'order-no',
        label: '订单编号',
      },
      content: <Input placeholder="请输入" />,
    },
    {
      formItemProps: {
        name: 'status',
        label: '发货状态',
      },
      content: <Select placeholder="请选择" />,
    },
    {
      formItemProps: {
        name: 'status',
        label: '发货状态',
      },
      content: <Select placeholder="请选择" />,
    },
    {
      formItemProps: {
        name: 'status',
        label: '发货状态',
      },
      content: <Select placeholder="请选择" />,
    },
    {
      formItemProps: {
        name: 'status',
        label: '发货状态',
      },
      content: <Select placeholder="请选择" />,
    },
    {
      formItemProps: {
        name: 'status',
        label: '发货状态',
      },
      content: <Select placeholder="请选择" />,
    },
    {
      formItemProps: {
        name: 'status',
        label: '发货状态',
      },
      content: <Select placeholder="请选择" />,
    },
  ]
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
    },
    {
      title: '住址',
      dataIndex: 'address',
    },
    {
      title: '性别',
      dataIndex: 'sex',
    },
    {
      title: '电话',
      dataIndex: 'tel',
    },
  ]
  const dataSource = Array.from({length: 5}).map((v,i) => ({
    key: i,
    name: `用户${i+1}`,
    age: 18,
    address: '中国',
    sex: '男',
    tel: '131****1111',
  }))

  const tools = (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
      <Button type="primary">更新</Button>
      <Button type="ghost">导出</Button>
    </div>
  )

  const onSearch = (values: any) => {
    console.log(values)
  }

  return (
    <div style={{ background: '#f6f9fb', padding: 16 }}>
      <ProTable
        header={{
          columns: headerColumns,
          formProps: { onFinish: onSearch },
        }}
        tools={tools}
        columns={columns}
        dataSource={dataSource}
      />
    </div>
  )
}
```


## 自定义列

如果需要自定义显示列的话，可以使用`ProTableCustomColumn`组件

```tsx
import type { CustomColumn } from '@/pro-components/ProTable/ProTableCustomColumn'
import React, { useState } from 'react'
import { Button, Input, Select } from 'antd'
import ProTable from '@/pro-components/ProTable'
import ProTableCustomColumn from '@/pro-components/ProTable/ProTableCustomColumn'

export default () => {
  const [columns, onChange] = useState<CustomColumn[]>([
    {
      title: '姓名',
      dataIndex: 'name',
      disabled: true,
    },
    {
      title: '年龄',
      dataIndex: 'age',
    },
    {
      title: '住址',
      dataIndex: 'address',
      hidden: true,
    },
    {
      title: '性别',
      dataIndex: 'sex',
    },
    {
      title: '电话',
      dataIndex: 'tel',
    },
  ])

  const dataSource = Array.from({length: 5}).map((v,i) => ({
    key: i,
    name: `用户${i+1}`,
    age: 18,
    address: '中国',
    sex: '男',
    tel: '131****1111',
  }))

  const tools = (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
      <Button type="primary">更新</Button>
      <ProTableCustomColumn columns={columns} onChange={onChange} />
    </div>
  )

  return (
    <div style={{ background: '#f6f9fb', padding: 16 }}>
      <ProTable
        tools={tools}
        columns={columns.filter(item => !item.hidden)}
        dataSource={dataSource}
      />
    </div>
  )
}
```

## 可拖动列

```tsx
import type { ResizableColumn } from '@/pro-components/ProTable/ProTableResizableTitle'
import React, { useState } from 'react'
import { Button, Input, Select } from 'antd'
import ProTable from '@/pro-components/ProTable'
import ProTableResizableTitle, { useColumnResizable } from '@/pro-components/ProTable/ProTableResizableTitle'

export default () => {
  const [columns, onChange] = useState<ResizableColumn[]>([
    {
      title: '姓名',
      dataIndex: 'name',
      width: 200,
      resizable: true,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      width: '100px',
      resizable: true,
    },
    {
      title: '住址',
      dataIndex: 'address',
    },
    {
      title: '性别',
      dataIndex: 'sex',
    },
    {
      title: '电话',
      dataIndex: 'tel',
    },
  ])
  const resizableColumns = useColumnResizable(columns,onChange)

  const dataSource = Array.from({length: 10}).map((v,i) => ({
    key: i,
    name: `用户${i+1}`,
    age: 18,
    address: '中国',
    sex: '男',
    tel: '131****1111',
  }))

  return (
    <div style={{ background: '#f6f9fb', padding: 16 }}>
      <ProTable
        components={{ header: { cell: ProTableResizableTitle } }}
        columns={resizableColumns}
        dataSource={dataSource}
      />
    </div>
  )
}
```

## 自定义列 + 拖动列

```tsx
import type { CustomColumn } from '@/pro-components/ProTable/ProTableCustomColumn'
import type { ResizableColumn } from '@/pro-components/ProTable/ProTableResizableTitle'
import React, { useState } from 'react'
import { Button, Input, Select } from 'antd'
import ProTable from '@/pro-components/ProTable'
import ProTableCustomColumn from '@/pro-components/ProTable/ProTableCustomColumn'
import ProTableResizableTitle, { useColumnResizable } from '@/pro-components/ProTable/ProTableResizableTitle'

export default () => {
  const [columns, onChange] = useState<Array<CustomColumn & ResizableColumn>>([
    {
      title: '姓名',
      dataIndex: 'name',
      disabled: true,
      width: 200,
      resizable: true
    },
    {
      title: '年龄',
      dataIndex: 'age',
    },
    {
      title: '住址',
      dataIndex: 'address',
      hidden: true,
      width: '100px',
      resizable: true
    },
    {
      title: '性别',
      dataIndex: 'sex',
    },
    {
      title: '电话',
      dataIndex: 'tel',
    },
  ])

  const resizableColumns = useColumnResizable(columns,onChange)

  const dataSource = Array.from({length: 10}).map((v,i) => ({
    key: i,
    name: `用户${i+1}`,
    age: 18,
    address: '中国',
    sex: '男',
    tel: '131****1111',
  }))


  const tools = (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
      <Button type="primary">更新</Button>
      <ProTableCustomColumn columns={resizableColumns} onChange={onChange} />
    </div>
  )

  return (
    <div style={{ background: '#f6f9fb', padding: 16 }}>
      <ProTable
        tools={tools}
        components={{ header: { cell: ProTableResizableTitle } }}
        columns={resizableColumns.filter(item => !item.hidden)}
        dataSource={dataSource}
      />
    </div>
  )
}
```

## 合并行

如果需要快速实现合并行，可以使用`useMergeRow`来实现

```tsx
import type { MergeRowColumn } from '@/pro-components/ProTable'
import React, { useState, useEffect } from 'react'
import { Button } from 'antd'
import ProTable, { useMergeRow } from '@/pro-components/ProTable'

export default () => {
  const [columns, onChange] = useState<Array<MergeRowColumn>>([
    {
      title: '用户名',
      dataIndex: 'name',
    },
    {
      title: '个人资产',
      dataIndex: 'money',
    },
    {
      title: '部门总资产',
      dataIndex: 'departMoney',
      mergeRowKey: 'depart',
    },
    {
      title: '部门',
      dataIndex: 'depart',
      mergeRowKey: 'depart',
    },
  ])
  const [dataSource,setDataSource] = useState([])

  useEffect(() => {
    setTimeout(() => {
      setDataSource([
        {
          key: 1,
          name: '用户1',
          money: 1000.1,
          departMoney: 10000000,
          depart: '部门1',
        },
        {
          key: 2,
          name: '用户2',
          money: 1000.1234,
          departMoney: 10000000,
          depart: '部门1',
        },
        {
          key: 3,
          name: '用户3',
          money: 1000.1234,
          departMoney: 10000000,
          depart: '部门1',
        },
        {
          key: 4,
          name: '用户4',
          money: 1000.1234,
          departMoney: 10000000,
          depart: '部门2',
        },
        {
          key: 5,
          name: '用户5',
          money: 1000.1234,
          departMoney: 10000000,
          depart: '部门2',
        },
        {
          key: 6,
          name: '用户6',
          money: 1000.1234,
          departMoney: 10000000,
          depart: '部门3',
        },
      ])
    }, 1000);
  },[])

  const [mergeColumns, mergeDataSource] = useMergeRow(columns,dataSource)

  return (
    <div>
      <ProTable columns={mergeColumns} dataSource={mergeDataSource} />
    </div>
  )
}
```


## 表头分组 + 合并行

如果需要快速实现合并行，可以使用`useMergeRow`来实现

```tsx
import type { MergeRowColumn } from '@/pro-components/ProTable'
import React, { useState, useEffect } from 'react'
import { Button } from 'antd'
import ProTable, { useMergeRow } from '@/pro-components/ProTable'

export default () => {
  const [columns, onChange] = useState<Array<MergeRowColumn>>([
    {
      title: '用户名',
      dataIndex: 'name',
    },
    {
      title: '资产',
      children: [
        {
          title: '个人资产',
          dataIndex: 'money',
        },
        {
          title: '部门总资产',
          dataIndex: 'departMoney',
          mergeRowKey: 'depart',
        },
      ]
    },
    {
      title: '部门',
      dataIndex: 'depart',
      mergeRowKey: 'depart',
    },
  ])
  const [dataSource,setDataSource] = useState([])

  useEffect(() => {
    setTimeout(() => {
      setDataSource([
        {
          key: 1,
          name: '用户1',
          money: 1000.1,
          departMoney: 10000000,
          depart: '部门1',
        },
        {
          key: 2,
          name: '用户2',
          money: 1000.1234,
          departMoney: 10000000,
          depart: '部门1',
        },
        {
          key: 3,
          name: '用户3',
          money: 1000.1234,
          departMoney: 10000000,
          depart: '部门1',
        },
        {
          key: 4,
          name: '用户4',
          money: 1000.1234,
          departMoney: 10000000,
          depart: '部门2',
        },
        {
          key: 5,
          name: '用户5',
          money: 1000.1234,
          departMoney: 10000000,
          depart: '部门2',
        },
        {
          key: 6,
          name: '用户6',
          money: 1000.1234,
          departMoney: 10000000,
          depart: '部门3',
        },
      ])
    }, 1000);
  },[])

  const [mergeColumns, mergeDataSource] = useMergeRow(columns,dataSource)

  return (
    <div>
      <ProTable columns={mergeColumns} dataSource={mergeDataSource} />
    </div>
  )
}
```

## 属性

| 属性   | 说明     | 类型                | 默认 | 是否必填 |
| ------ | -------- | ------------------- | ---- | -------- |
| header | 顶部区域 | ProTableHeaderProps | -    | 否       |

### ProTableHeader 属性

| 属性            | 说明                     | 类型                          | 默认               | 是否必填 |
| --------------- | ------------------------ | ----------------------------- | ------------------ | -------- |
| columns         | 表单列配置数据           | `Array<ProTableHeaderColumn>` | -                  | 是       |
| colCount        | 一行几列                 | number                        | 4                  | 否       |
| formProps       | Form 配置                | FormProps                     | -                  | 否       |
| isResetSearch   | 重置按钮之后是否自动查询 | boolean                       | true               | 否       |
| buttons         | 按钮权限                 | Array<'search' \| 'reset'>    | ['search','reset'] | 否       |
| headerStyle     | 样式表                   | React.CSSProperties           | -                  | 否       |
| headerClassName | className                | string                        | -                  | 否       |
| onReset         | 重置表单回调             | () => void                    | -                  | 否       |

#### 说明

- 控制`label`的宽度可以通过`formProps:{labelCol:{flex:'100px'}}`来全局设置
- `formProps`中的`wrapperCol`默认为`{{ flex: '180px' }}`

### ProTableContent 属性

| 属性             | 说明                 | 类型                              | 默认 | 是否必填 |
| ---------------- | -------------------- | --------------------------------- | ---- | -------- |
| contentRef       | ProTableContent的Ref | `React.RefObject<HTMLDivElement>` | -    | 否       |
| tableRef         | Table的Ref           | `React.Ref<HTMLDivElement>`       | -    | 否       |
| tools            | 工具栏区域           | React.ReactNode                   | -    | 否       |
| contentStyle     | 样式表               | React.CSSProperties               | -    | 否       |
| contentClassName | className            | string                            | -    | 否       |

```ts
export interface ProTableContentColumnProps<T = any> extends ColumnType<T> {
  timeFormat?: string | boolean
  hidden?: boolean
  // 是否可拖动，使用此属性需要制定width
  resizable?: boolean
  // 是否千分位分隔
  isThousandthSeparate?: boolean
  // 合并行key
  mergeRowKey?: string
}
```

> 其他属性参考[Table 组件](https://ant-design.antgroup.com/components/table-cn/#API)


## 自定义hooks

### useOrderNumberColumn

序号列配置，返回序号列配置

#### 参数

| 属性                   | 说明       | 类型              | 默认 | 是否必填 |
| ---------------------- | ---------- | ----------------- | ---- | -------- |
| orderNumberColumnProps | 序号列配置 | `ColumnType<any>` | -    | 否       |

### useTablePagination

分页配置，返回带有默认配置的分页配置

#### 参数

| 属性       | 说明     | 类型                             | 默认 | 是否必填 |
| ---------- | -------- | -------------------------------- | ---- | -------- |
| pagination | 分页配置 | `false \| TablePaginationConfig` | -    | 否       |


### useMergeRow

合并行hooks，返回一个数组：[合并行的列配置,合并行的数据源]

#### 参数

| 属性       | 说明   | 类型             | 默认 | 是否必填 |
| ---------- | ------ | ---------------- | ---- | -------- |
| columns    | 列配置 | MergeRowColumn[] | -    | 是       |
| dataSource | 数据源 | any[]            | -    | 是       |

```ts
export interface MergeRowColumn<T = any> extends ColumnType<T> {
  mergeRowKey?: string
}
```