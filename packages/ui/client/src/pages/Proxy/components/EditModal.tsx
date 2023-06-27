import { Form, Input, message, Modal, ModalProps, Switch } from 'antd'
import React, { useEffect, useState } from 'react'

import { addProxy, updateProxy } from '@/api/proxy'
import { ProxyModel } from '@/models/proxy'

export interface EditModalProps extends ModalProps {
  data?: ProxyModel
}

enum TYPE {
  EDIT,
  ADD,
}

const EditModal = ({ data, ...modalProps }: EditModalProps) => {
  const [form] = Form.useForm()
  const type = data ? TYPE.EDIT : TYPE.ADD
  const title = data ? '编辑' : '添加'

  useEffect(() => {
    form.setFieldsValue({
      ...data,
      options: data?.options ? JSON.stringify(data?.options, null, 2) : undefined,
    })
  }, [data, form])

  const [confirmLoading, setConfirmLoading] = useState(false)
  const onSave = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    try {
      const values = await form.validateFields()
      setConfirmLoading(true)
      const api = type === TYPE.ADD ? addProxy : updateProxy
      await api({ id: data?.id, ...values })
      message.success('操作成功')
      modalProps?.onOk?.(e)
    } finally {
      setConfirmLoading(false)
    }
  }

  return (
    <Modal
      {...modalProps}
      confirmLoading={confirmLoading}
      destroyOnClose
      onOk={onSave}
      title={title}
      width={1000}
    >
      <Form form={form} labelCol={{ span: 3 }} preserve={false}>
        <Form.Item
          label="接口地址"
          name="path"
          rules={[{ message: '请输入接口地址', required: true, validateTrigger: 'submit' }]}
        >
          <Input placeholder="请输入接口地址" />
        </Form.Item>
        <Form.Item
          label="代理地址"
          name="target"
          required
          rules={[
            {
              validator: (_: unknown, value: string) => {
                if (!value) {
                  return Promise.reject('请输入代理地址')
                }
                if (/^(http:\/\/|https:\/\/)/.test(value)) {
                  return Promise.resolve()
                }

                return Promise.reject('请输入正确的代理地址')
              },
            },
          ]}
        >
          <Input placeholder="请输入代理地址" />
        </Form.Item>
        <Form.Item label="描述" name="description">
          <Input.TextArea placeholder="请输入描述" />
        </Form.Item>
        <Form.Item label="参数" name="options">
          <Input.TextArea placeholder="请输入JSON字符串格式的参数" />
        </Form.Item>
        <Form.Item initialValue={true} label="是否开启" name="enabled" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditModal
