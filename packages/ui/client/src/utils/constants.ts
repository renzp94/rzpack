export const DEFAULT_PAGE_SIZE = 10
export enum PLACEHOLDER {
  // 单行输入
  INPUT = '请输入',
  // 选择(所有通过选择得到的值都使用此值)
  SELECT = '请选择',
}
// 下拉选择的默认配置
export const DEFAULT_SELECT_PROPS = {
  allowClear: true,
  // 下拉搜索使用label搜索
  optionFilterProp: 'label',
  placeholder: PLACEHOLDER.SELECT,
  showArrow: true,
  showSearch: true,
  // 取消虚拟滚动，为了实现左右滚动
  virtual: false,
}

// 单行输入的默认配置
export const DEFAULT_INPUT_PROPS = {
  allowClear: true,
  placeholder: PLACEHOLDER.INPUT,
}
