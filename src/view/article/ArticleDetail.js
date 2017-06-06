import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Spin, Button, Input, Select, message} from 'antd';

import InputImage from '../../component/InputImage';
import InputHtml from '../../component/InputHtml';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';
import style from '../style.css';

class ArticleDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_load: false,
      is_show: false,
      action: '',
      article_id: ''
    }
  }

  componentDidMount() {
    notification.on('notification_article_detail_save', this, function (data) {
      this.setState({
        is_show: true,
        action: 'save'
      });
    });

    notification.on('notification_article_detail_update', this, function (data) {
      this.setState({
        is_show: true,
        action: 'update',
        article_id: data.article_id
      });

      setTimeout(function () {
        this.handleLoad(data.article_id);
      }.bind(this), 200);
    });
  }

  componentWillUnmount() {
    notification.remove('notification_article_detail_save', this);

    notification.remove('notification_article_detail_update', this);
  }

  handleLoad(article_id) {
    this.setState({
      is_load: true
    });

    http.request({
      url: '/article/admin/find',
      data: {
        article_id: article_id
      },
      success: function (json) {
        this.props.form.setFieldsValue({
          category_id: json.data.category_id,
          article_name: json.data.article_name,
          article_summary: json.data.article_summary
        });

        var article_image = [];
        if (json.data.article_image_file != '') {
          article_image.push(json.data.article_image_file);
        }
        this.refs.article_image.handleSetValue(article_image);

        this.refs.article_content.handleSetValue(json.data.article_content);
      }.bind(this),
      complete: function () {
        this.setState({
          is_load: false
        });

      }.bind(this)
    });
  }

  handleSubmit() {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return;
      }

      values.article_id = this.state.article_id;

      var article_image_file = this.refs.article_image.handleGetValue();
      if (article_image_file.length == 0) {
        values.article_image = '';
      } else {
        values.article_image = article_image_file[0].file_id;
      }

      values.article_content = this.refs.article_content.handleGetValue();

      this.setState({
        is_load: true
      });

      http.request({
        url: '/article/' + this.state.action,
        data: values,
        success: function (json) {
          message.success(constant.success);

          this.handleCancel();

          notification.emit('notification_article_index_load', {});
        }.bind(this),
        complete: function () {
          this.setState({
            is_load: false
          });
        }.bind(this)
      });
    });
  }

  handleCancel() {
    this.setState({
      is_show: false
    });

    this.props.form.resetFields();

    this.refs.article_image.handleReset();

    this.refs.article_content.handleReset();
  }

  render() {
    const FormItem = Form.Item;
    const Option = Select.Option;
    const {getFieldDecorator} = this.props.form;

    return (
      <Modal title={'表单'} maskClosable={false} width={constant.detail_width}
             visible={this.state.is_show} onCancel={this.handleCancel.bind(this)}
             footer={[
               <Button key="back" type="ghost" size="default" icon="cross-circle"
                       onClick={this.handleCancel.bind(this)}>关闭</Button>,
               <Button key="submit" type="primary" size="default" icon="check-circle"
                       loading={this.state.is_load}
                       onClick={this.handleSubmit.bind(this)}>确定</Button>
             ]}
      >
        <Spin spinning={this.state.is_load}>
          <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_width}} label="分类编号">
            {
              getFieldDecorator('category_id', {
                rules: [{
                  required: true,
                  message: constant.required
                }],
                initialValue: ''
              })(
                <Select style={{
                  width: '100%'
                }} placeholder="请选择分类">
                  {
                    this.props.article.category_list.map(function (item) {
                      return (
                        <Option key={item.category_id} value={item.category_id}>{item.category_name}</Option>
                      )
                    })
                  }
                </Select>
              )
            }
          </FormItem>
          <FormItem hasFeedback {...constant.formItemLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_width}} label="文章名称">
            {
              getFieldDecorator('article_name', {
                rules: [{
                  required: true,
                  message: constant.required
                }],
                initialValue: ''
              })(
                <Input type="text" placeholder={constant.placeholder + '文章名称'}/>
              )
            }
          </FormItem>
          <FormItem hasFeedback {...constant.formItemFullLayoutDetail} className={style.formItemInputImageMarginBottom}
                    style={{width: constant.detail_form_item_full_width}} label="文章图片">
            <InputImage name="article_image" limit={1} ref="article_image"/>
          </FormItem>
          <FormItem hasFeedback {...constant.formItemFullLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_full_width}} label="文章摘要">
            {
              getFieldDecorator('article_summary', {
                rules: [{
                  required: true,
                  message: constant.required
                }],
                initialValue: ''
              })(
                <Input type="textarea" rows={4} placeholder={constant.placeholder + '文章摘要'}/>
              )
            }
          </FormItem>
          <FormItem hasFeedback {...constant.formItemFullLayoutDetail} className={style.formItem}
                    style={{width: constant.detail_form_item_full_width}} label="文章内容">
            <InputHtml name="article_content" ref="article_content"/>
          </FormItem>
        </Spin>
      </Modal>
    );
  }
}

ArticleDetail.propTypes = {

};

ArticleDetail = Form.create({})(ArticleDetail);

export default connect(({article}) => ({
  article
}))(ArticleDetail);
