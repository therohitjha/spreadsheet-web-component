import { Component, h, Listen, State } from '@stencil/core';
import Papa from 'papaparse';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true,
})
export class MyComponent {
  @State() results: any = [];
  @State() fileName: string[] = [];
  @State() activeIndex: number = 0;
  @State() editMode: boolean = false;
  @Listen('change', { capture: true })
  handleFiles(event: any) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      if ((this.fileName.length === 0 && this.results.length === 0) || !this.fileName.some((name: string) => name === files[i].name)) {
        this.fileName = this.fileName.length > 0 ? [...this.fileName, files[i].name] : [files[i].name];
        Papa.parse(files[i], {
          // header: true,
          complete: results => {
            this.results = this.results.length > 0 ? [...this.results, results.data] : [results.data];
          },
        });
      }
    }
  }

  getHeader(length: number): string[] {
    let headerData: string[] = [];
    for (let index = 0; index < length; index++) {
      headerData.push(String.fromCharCode(65 + index));
    }
    return headerData;
  }

  activeTab(index: number) {
    this.activeIndex = index;
  }

  editTableData(e: any, td: string | number, th: string | number, index: number, rowOrColumn: string) {
    if (e.target.textContent !== td) {
      if (rowOrColumn === 'row') {
        if (td === this.results[this.activeIndex].slice(1)[index][th]) {
          this.results[this.activeIndex].slice(1)[index][th] = e.target.textContent;
        }
      } else {
        if (td === this.results[this.activeIndex][0][th]) {
          this.results[this.activeIndex][0][th] = e.target.textContent;
        }
      }
    }
    this.editMode = false;
  }

  activateEditMode() {
    this.editMode = true;
  }

  getTableTd(td: any, th: string | number, index: number, rowOrColumn: string) {
    return (
      <td class="table-data-td" contentEditable={this.editMode} onClick={() => this.activateEditMode()} onBlur={e => this.editTableData(e, td, th, index, rowOrColumn)}>
        {td}
      </td>
    );
  }

  render() {
    return (
      <div class="container">
        <file-upload handleFiles={(e: any) => this.handleFiles(e)} />
        <br />
        <my-table results={this.results} getHeader={this.getHeader} getTableTd={this.getTableTd} activeIndex={this.activeIndex} />
        <my-tab fileName={this.fileName} activeTab={this.activeTab} activeIndex={this.activeIndex} />
      </div>
    );
  }
}
