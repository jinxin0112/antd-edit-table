import React from 'react';
import { message, Table, Input, Button, InputNumber, Select, Popconfirm, Form, Divider } from 'antd';
const FormItem = Form.Item;
const { OptGroup, Option } = Select;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  getInput = () => {
    const { formtype, formtypeprops, dataIndex, formdata = {} } = this.props;
    if (formtype === 'select') {
      const arr = formdata[`${dataIndex}DataSource`] && Array.isArray(formdata[`${dataIndex}DataSource`]) ? formdata[`${dataIndex}DataSource`] : [];
      const loading = formdata[`${dataIndex}Loading`] || false;
      return (
        <Select showSearch disabled={loading} style={{ width: '100%' }}>
          {[...arr].map(item => {
            if (item.groupLabel) {
              return (
                <OptGroup key={item.groupKey} lable={item.groupLabel}>
                  {item.list.map(option => (<Option key={option.key} value={option.label}>{option.label}</Option>))}
                </OptGroup>
              )
            }
            return (
              <Option key={item.key} value={item.label}>{item.label}</Option>
            )
          })}
        </Select>
      )
    }
    if (formtype === 'inputNumber') {
      return <InputNumber {...formtypeprops} />
    }
    return <Input {...formtypeprops} />;
  };

  render() {
    const {
      editing,
      dataIndex,
      title,
      record,
      index,
      formtype,
      formtyperules,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    initialValue: record[dataIndex] || '',
                    rules: [{
                      required: formtyperules.required,
                      message: formtyperules.message || `请${formtype === 'select' ? '选择' : '输入'}${title}` || '',
                    }]
                  })(this.getInput())}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: props.dataSource,
      editingKey: ''
    };
    this.columns = props.columns.map(column => {
      if (column.key === 'action') {
        const { actions, ...restProps } = column;
        const saves = [];
        const others = [];
        actions.forEach(item => {
          if (['save', 'cancel'].indexOf(item.type) > -1) {
            saves.push(item);
          } else {
            others.push(item);
          }
        });

        return {
          ...restProps,
          render: (text, record, index) => {
            const editable = this.isEditing(record);
            return (
              <div>
                {editable ? (
                  <span>
                    {saves.map((save, ind) => {
                      if (save.type === 'cancel') {
                        return (
                          <span key={save.type}>
                            <Popconfirm
                              title="确定取消?"
                              okText="确定"
                              cancelText="取消"
                              onConfirm={this.cancel}>
                              <span style={{color: '#40a9ff'}}>{save.title}</span>
                            </Popconfirm>
                            {(saves.length - 1) !== ind && <Divider type="vertical" />}
                          </span>
                        )
                      }
                      return (
                        <span key={save.type}>
                          <EditableContext.Consumer>
                            {form => (
                              <span style={{color: '#40a9ff'}} onClick={this.save.bind(this, form, record)}>{save.title}</span>
                            )}
                          </EditableContext.Consumer>
                          {(saves.length - 1) !== ind && <Divider type="vertical" />}
                        </span>
                      )
                    })}
                  </span>
                ) : (
                    <span>
                      {others.map((other, ind) => {
                        if (other.type === 'del') {
                          return (
                            <span key={other.type}>
                              <Popconfirm
                                title={`确定删除${other.delName ? ('【' + record[other.delName] + '】') : ''}?`}
                                okText="确定"
                                cancelText="取消"
                                onConfirm={this.del.bind(this, record, index, other.callback)}>
                                <span style={{color: '#40a9ff'}}>{other.title}</span>
                              </Popconfirm>
                              {(others.length - 1) !== ind && <Divider type="vertical" />}
                            </span>
                          )
                        }
                        return (
                          <span key={other.type}>
                            <span style={{color: '#40a9ff'}} onClick={other.type === 'edit' ? this.edit.bind(this, record[props.rowKey]) : other.callback.bind(this, record)}>{other.title}</span>
                            {(others.length - 1) !== ind && <Divider type="vertical" />}
                          </span>
                        )
                      })}
                    </span>
                  )
                }
              </div>
            )
          }
        }
      }
      return column;
    });
  }

  isEditing = record => record[this.props.rowKey] === this.state.editingKey;

  del = (record, index, fn) => {
    const { rowKey } = this.props;
    const newData = [...this.state.dataSource];
    newData.splice(index, 1);
    this.setState({ dataSource: newData, editingKey: '' });
    record[rowKey] !== -1 && fn(record);
  }

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form, record) {
    const actions = this.props.columns[this.props.columns.length - 1].actions;
    const key = this.props.rowKey;
    const handleSave = actions.filter(item => item.type === 'save');
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.dataSource];
      const index = newData.findIndex(item => {
        return record[key] === item[key]
      });
      const item = newData[index];
      item[key] = item[key] !== -1 ? item[key] : -new Date().getTime();
      row = {...item, ...row};
      newData.splice(index, 1, {
        ...item,
        ...row
      });
      this.setState({ dataSource: newData, editingKey: '' });
      handleSave.length && handleSave[0] && handleSave[0].callback(row);
    });
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  add = () => {
    const { rowKey } = this.props;
    const newData = [...this.state.dataSource];
    if(newData.length && newData[0][rowKey] === -1) {
      message.warn('请先填写完新增的记录并保存，然后再新增');
      return;
    }
    const tmp = {};
    tmp[rowKey] = -1;
    newData.unshift(tmp);
    this.setState({ dataSource: newData, editingKey: -1 })
  }

  render() {
    const { dataSource } = this.state;
    const { rowKey, formData, ...restProps } = this.props;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: record => ({
          record,
          formtype: col.formType,
          formtypeprops: col.formTypeProps || {},
          formtyperules: col.formTypeRules || {},
          dataIndex: col.dataIndex,
          formdata: formData,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    const tableProps = {
      components,
      columns,
      dataSource,
      rowKey: record => record[rowKey],
      pagination: false
    }

    return (
      <div>
        <Table {...tableProps} />
        {restProps.addText && restProps.addText.toString().trim() && <Button type="primary" style={{ marginTop: 12 }} onClick={this.add}>{restProps.addText}</Button>}
      </div>
    );
  }
}

export default EditableTable;
