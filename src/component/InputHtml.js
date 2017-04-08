import React, {Component, PropTypes} from 'react';
import TinyMCE from 'react-tinymce';

import ImageHelp from './ImageHelp'
import constant from '../util/constant';

let editor;

class InputHtml extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ''
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    this.editor.remove();
  }

  handleSetContent(content) {
    this.setState({
      content: content
    });

    this.editor.setContent(content);
  }

  handleGetContent() {
    return this.editor.getContent();
  }

  handleReset() {
    this.handleSetContent("");
  }

  handleSubmitReturn(list) {
    let html = '';

    for (let i = 0; i < list.length; i++) {
      html += '<img src="' + constant.host + list[i].url + '" />';
    }

    this.editor.insertContent(html);
  }

  render() {

    return (
      <div>
        <TinyMCE
          config={{
            height: 1000,
            menubar: false,
            resize: false,
            border_width: 1,
            convert_urls: false,
            statusbar: false,
            elementpath: false,
            visual: false,
            keep_values: false,
            show_system_default_font: false,
            forced_root_block: 'div',
            plugins: 'code image imagetools',
            toolbar: 'fontselect fontsizeselect | bold italic underline strikethrough removeformat | alignleft aligncenter alignright | mybutton image | code',
            setup: function (editor) {
              this.editor = editor;

              editor.addButton('mybutton', {
                icon: 'mce-ico mce-i-browse',
                tooltip: 'Insert image',
                onclick: function () {
                  this.refs.image.handleOpen();
                }.bind(this)
              });
            }.bind(this)
          }}
        />
        <ImageHelp is_visible={false} type={'original'} limit={0} handleSubmitReturn={this.handleSubmitReturn.bind(this)} ref="image"/>
      </div>
    );
  }
}

InputHtml.propTypes = {};

export default InputHtml;
