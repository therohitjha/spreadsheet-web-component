import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'file-upload',
  styleUrl: 'file-upload.css',
  shadow: true,
})
export class FileUpload {
  @Prop() handleFiles: any;
  render() {
    return (
      <div class="file-upload-button-container">
        <label htmlFor="file-upload" class="file-upload-button">
          Upload
        </label>
        <span>Please select one or more csv file to continue.</span>
        <input type="file" id="file-upload" multiple onChange={this.handleFiles.bind(this)} />
      </div>
    );
  }
}
