import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Modal, Form, Spin, Button, Input, Select} from 'antd';

import constant from '../../util/constant';
import style from '../style.css';

class MemberTreeDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user_avatar: '',
      isChange: false
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  handleSetFieldsValue(values) {
    this.setState({
      user_avatar: values.user_avatar
    });

    this.props.form.setFieldsValue(values);
  }

  handleSubmit() {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return;
      }

      this.props.handleSubmit(values);
    });
  }

  handleChange(e) {
    this.setState({
      isChange: e.target.checked
    });
  }

  handleCancel() {
    this.props.handleCancel();
  }

  handleReset() {
    this.props.form.resetFields();

    this.setState({
      user_avatar: '',
      isChange: false
    });
  }

  render() {
    const FormItem = Form.Item;
    const Option = Select.Option;
    const {getFieldDecorator} = this.props.form;

    return (
      <Modal title={'会员表单'} maskClosable={false} width={constant.detail_width}
             visible={this.props.is_detail} onCancel={this.handleCancel.bind(this)}
             footer={[
               <Button key="back" type="ghost" size="default" icon="cross-circle"
                       onClick={this.handleCancel.bind(this)}>关闭</Button>,
               <Button key="submit" type="primary" size="default" icon="check-circle"
                       loading={this.props.is_load}
                       onClick={this.handleSubmit.bind(this)}>确定</Button>
             ]}
      >
        <Spin spinning={this.props.is_load}>

          <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_width}} label="会员等级">
            {
              getFieldDecorator('member_level_id', {
                rules: [{
                  required: true,
                  message: constant.required
                }],
                initialValue: ''
              })(
                <Select style={{
                  width: '100%'
                }} placeholder="请选择会员等级">
                  {
                    this.props.member_level_list.map(function (item) {
                      return (
                        <Option key={item.member_level_id}
                                value={item.member_level_id}>{item.member_level_name}</Option>
                      )
                    })
                  }
                </Select>
              )
            }
          </FormItem>

          <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_width}} label="会员名称">
            {
              getFieldDecorator('member_name', {
                rules: [{
                  required: true,
                  message: constant.required
                }],
                initialValue: ''
              })(
                <Input type="text" placeholder={constant.placeholder + '会员名称'}/>
              )
            }
          </FormItem>
          <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_width}} label="会员头像">
            {
              this.state.user_avatar == '' ?
                ''
                :
                <img src={this.state.user_avatar} style={{
                  width: '120px'
                }}/>
            }
          </FormItem>

        </Spin>
      </Modal>
    );
  }
}

MemberTreeDetail.propTypes = {
  is_load: PropTypes.bool.isRequired,
  is_detail: PropTypes.bool.isRequired,
  action: PropTypes.string.isRequired,
  member_level_list: PropTypes.array.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired
};

MemberTreeDetail = Form.create({
  withRef: true
})(MemberTreeDetail);

export default MemberTreeDetail;
