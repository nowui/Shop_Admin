import React, {Component, PropTypes} from 'react';
import TinyMCE from 'react-tinymce';

import ModalImage from './ModalImage'

let editor;

class InputHtml extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    this.editor.remove();
  }

  handleSetContent(content) {
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
      html += '<img src="' + list[i].url + '" />';
    }

    this.editor.insertContent(html);
  }

  render() {

    return (
      <div>
        <TinyMCE
          config={{
            height: 500,
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
            plugins: 'code image imagetools code',
            toolbar: 'fontselect fontsizeselect | bold italic underline strikethrough removeformat | alignleft aligncenter alignright | mybutton | code',
            setup: function (editor) {
              this.editor = editor;

              editor.addButton('mybutton', {
                icon: 'image',
                tooltip: 'Insert image',
                onclick: function () {
                  this.refs.image.handleOpen();
                }.bind(this)
              });
            }.bind(this)
          }}
        />
        <ModalImage is_visible={false} handleSubmitReturn={this.handleSubmitReturn.bind(this)} ref="image"/>
      </div>
    );
  }
}

InputHtml.propTypes = {};

export default InputHtml;
