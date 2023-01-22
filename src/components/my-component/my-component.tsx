import { Component, h, Listen, State } from '@stencil/core';
import Papa from 'papaparse';
// import { data } from '../../utils/sample';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true,
})
export class MyComponent {
  @State() results: any[] = [];
  @State() fileName: string[] = [];
  @State() activeIndex: number = 0;
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
    if (rowOrColumn === 'row') {
      this.results[this.activeIndex].slice(1)[index].forEach(() => {
        if (td === this.results[this.activeIndex].slice(1)[index][th]) {
          this.results[this.activeIndex].slice(1)[index][th] = e.target.innerText;
        }
      });
    } else {
      this.results[this.activeIndex][0].forEach(() => {
        if (td === this.results[this.activeIndex][0][th]) {
          this.results[this.activeIndex][0][th] = e.target.innerText;
        }
      });
    }
  }

  getTableTd(td: any, th: string | number, index: number, rowOrColumn: string) {
    return (
      <td class="table-data-td" contentEditable={true} onBlur={e => this.editTableData(e, td, th, index, rowOrColumn)}>
        {td}
      </td>
    );
  }

  render() {
    return (
      <div class="container">
        <div class="file-upload-button-container">
          <label htmlFor="file-upload" class="file-upload-button">
            Upload
          </label>
          <span>Please select one or more csv file to continue.</span>
          <input type="file" id="file-upload" multiple onChange={e => this.handleFiles(e)} />
        </div>
        <br />
        {this.results.length ? (
          <table>
            <thead>
              <tr>
                <th></th>
                {this.getHeader(this.results[this.activeIndex][0].length).map((header: string) => (
                  <th>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="table-data-index">{1}</td>
                {this.results[this.activeIndex][0].map((keys: string | number, index: number) => this.getTableTd(keys, index, index, 'column'))}
              </tr>
              {this.results[this.activeIndex].slice(1).map((e: any, i: number) => (
                <tr class="table-data-container">
                  <td class="table-data-index">{i + 2}</td>
                  {Object.entries(e).map(([keys, values]) => this.getTableTd(values, keys, i, 'row'))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <h2>No Data</h2>
        )}
        <div class="tab-container">
          {this.fileName.map((name: string, index: number) => (
            <button style={this.activeIndex === index && { backgroundColor: 'white' }} onClick={() => this.activeTab(index)}>
              {name}
            </button>
          ))}
        </div>
      </div>
    );
  }
}