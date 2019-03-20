<p align="center">
    <img alt="dva-boot-admin" src="https://user-images.githubusercontent.com/1697158/49214902-8f888180-f402-11e8-8207-84d5cdf9d9bf.png" width="140">
</p>
<h1 align="center">基于 antd 组件库实现可编辑表格</h1>
<h3 align="center">:lemon: :tangerine: :cherries: :cake: :grapes: :watermelon: :strawberry: :corn: :peach: :melon:</h3>

<p align="center">
  <img src="https://img.shields.io/npm/v/antd-edit-table.svg" />
  <img src="https://img.shields.io/badge/license-MIT-brightgreen.svg">
  <img src="https://img.shields.io/badge/developing%20with-antd%20%3E%20table-brightgreen.svg">
</p>

![](https://raw.githubusercontent.com/ruizhengyun/antd-edit-table/master/assets/screen.png)

该组件基于 Ant Design 的 React 实现，开发和服务于企业级后台产品。

<div><img style="vertical-align: middle;" width="150" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"><span style="font-size: 30px; color: #aaa; margin: 0 20px; vertical-align: middle;">+</span><img style="vertical-align: middle;" width="160" src="https://gw.alipayobjects.com/zos/rmsportal/tXlLQhLvkEelMstLyHiN.svg"></div>


## 特性

1.提炼表格列编辑，目前支持 `input` 和 `Select` 表单类型； 


## 版本
稳定版：v0.0.1

## 安装
使用 npm 或 yarn 安装

**我们推荐使用 npm 或 yarn 的方式进行开发**，不仅可在开发环境轻松调试，也可放心地在生产环境打包部署使用，享受整个生态圈和工具链带来的诸多好处。

```javascript
$ npm install antd-edit-table --save
```

```javascript
$ yarn add antd-edit-table
```

## 何时使用
当表格涉及到内容的新增、删除和修改的时候；

## 示例及代码演示
```javascript
import React from 'react';
import TfEditTable from './components';

const dataSource = [
  { userId: 163, name: '张三', age: 27, position: '功能', jobId: 13496 },
  { userId: 165, name: '李四', age: 22, position: '平台', jobId: 18893 },
];

const Page = () => {
  const handleDel = (record) => {
    console.log('删除', record);
  }

  const handleSave = (record) => {
    console.log('保存', record);
  }

  const handleView = (record) => {
    console.log('查看', record);
  }

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      editable: true,
      formType: 'select',
      formTypeProps: {
        placeholder: '请输入名字',
      },
      formTypeRules: {
        required: true,
        message: '请输入名字'
      }
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 200,
      editable: true,
      formType: 'input',
      formTypeProps: {
        placeholder: '请输入年龄'
      },
      formTypeRules: {
        required: true,
        message: '请输入年龄'
      }
    },
    {
      title: '所在组',
      dataIndex: 'position',
      key: 'position',
      editable: true,
      formType: 'select'
    },
    {
      title: '工号',
      dataIndex: 'jobId',
      key: 'jobId',
      editable: true,
      formType: 'input',
      formTypeProps: {
        placeholder: '请输入工号'
      },
      formTypeRules: {
        required: true,
        message: '请输入工号'
      }
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      actions: [
        { title: '编辑', type: 'edit' },
        { title: '删除', type: 'del', callback: handleDel, delName: 'name' },
        { title: '保存', type: 'save', callback: handleSave },
        { title: '取消', type: 'cancel' },
        { title: '查看', type: 'view', callback: handleView }
      ]
    }
  ];

  const tfEditTableProps = {
    columns,
    dataSource,
    rowKey: 'userId',
    addText: '新增',
    formData: {
      nameLoading: false,
      nameDataSource: [
        { "key": 1001, "label": "丰雨桥" },
        { "key": 1009, "label": "查柳" }
      ],
      positionDataSource: [
        {
          groupKey: '业务组', groupLabel: 'busiTeam', list: [
            { key: '2001', label: '功能' },
            { key: '2002', label: '平台' },
            { key: '2003', label: '项目' },
          ]
        },
      ]
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <TfEditTable {...tfEditTableProps} />
    </div>
  )
}

export default Page;
```


## API

Table

|参数|说明|类型|默认值|
|:-|:-|:-|:-|
| ... | antd table 的已有属性 | | |
| rowKey | 表格行 key 的取值，字符串 | string | - |
| addText | 新增一组数据的按钮文案，不传或空值不显示 | string | '新增' |
| formData | 字段编辑时提供筛选的数据，介于此类数据来源是网络请求或固定数据。所以有 `xxxLoading` 和 `xxxDataDource`, `xxx` 是该字的 `dataIndex`, `xxxDataSource`中的每项只有 `key` 和 `label`，回调返回是 `label`, 这块数据需要开发人员手动梳理下格式 | object | - |


Column

列描述数据对象，是 columns 中的一项，Column 使用相同的 API。

|参数|说明|类型|默认值|
|:-|:-|:-|:-|
| editable | 点击编辑时，该字段是否可更改 | boolean | |
| formType | 该字段编辑时属于什么类型，目前支持 `input` 和 `select` | string | |
| formTypeProps | 提供编辑字段的类型(`formType`)自身含有的属性和方法的唯一入口 | object | |
| formTypeRules | 提供编辑字段的类型(`formType`)的一些校验规则 | object | - |

> 注意：
> 1.目前编辑表格不支持分页
> 2.支持类型有 select 和 input