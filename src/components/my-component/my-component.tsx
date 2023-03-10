import { Component, h, State } from '@stencil/core';
import Papa from 'papaparse';
import { applyPolyfills, defineCustomElements } from '@revolist/revogrid/loader';
applyPolyfills();
defineCustomElements();

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
  @State() loader: boolean = false;
  @State() selectedColumnIndex: number = -1;
  // @State() startIndex: number = 0;
  // @State() endIndex: number = 30;
  copiedData: any[] = [];
  // tableDivRef: HTMLDivElement;
  // rowContainerRef: HTMLDivElement;

  handleFiles(event: any) {
    const files = event.target.files;
    if (files.length) {
      for (let i = 0; i < files.length; i++) {
        if ((this.fileName.length === 0 && this.results.length === 0) || !this.fileName.some((name: string) => name === files[i].name)) {
          this.fileName = this.fileName.length > 0 ? [...this.fileName, files[i].name] : [files[i].name];
          Papa.parse(files[i], {
            header: true,
            complete: results => {
              this.results = this.results.length > 0 ? [...this.results, results.data] : [results.data];
            },
          });
        }
      }
    }
  }

  // getHeader(length: number): string[] {
  //   let headerData: string[] = [];
  //   for (let index = 0; index < length; index++) {
  //     headerData.push(String.fromCharCode(65 + index));
  //   }
  //   return headerData;
  // }

  activeTab(index: number) {
    this.activeIndex = index;
  }

  // editTableData(e: any, td: string | number, th: string | number, index: number, rowOrColumn: string) {
  //   if (e.target.textContent !== td) {
  //     if (rowOrColumn === 'row') {
  //       if (td === this.results[this.activeIndex].slice(1)[index][th]) {
  //         this.results[this.activeIndex].slice(1)[index][th] = e.target.textContent;
  //       }
  //     } else {
  //       if (td === this.results[this.activeIndex][0][th]) {
  //         this.results[this.activeIndex][0][th] = e.target.textContent;
  //       }
  //     }
  //   }
  //   this.editMode = false;
  // }

  // activateEditMode() {
  //   this.editMode = true;
  // }

  // componentDidUpdate() {
  //   if (this.selectedColumnIndex !== -1) {
  //     this.copyToClipboard();
  //   }
  // }

  // copyToClipboard() {
  //   const blob = new Blob(this.copiedData, { type: 'text/plain' });
  //   const clipboardItem = new ClipboardItem({ 'text/plain': blob });
  //   navigator.clipboard.write([clipboardItem]);
  //   this.selectedColumnIndex = -1;
  //   this.copiedData = [];
  // }

  // getTableTd(td: any, th: string | number, index: number, indexSelection: number, rowOrColumn: string) {
  //   if (this.selectedColumnIndex !== -1 && this.selectedColumnIndex === indexSelection) {
  //     this.copiedData.push(`${td}'\n'`);
  //   }
  //   return (
  //     <div
  //       class={`table-data-td ${this.selectedColumnIndex === indexSelection ? 'selected-column' : ''}`}
  //       contentEditable={this.editMode}
  //       onClick={() => this.activateEditMode()}
  //       onBlur={e => this.editTableData(e, td, th, index, rowOrColumn)}
  //     >
  //       {td}
  //     </div>
  //   );
  // }

  setColumnIndex(index: number) {
    this.selectedColumnIndex = index;
  }

  forceRender() {
    this.loader = !this.loader;
  }

  componentDidRender() {
    if (this.results.length && !this.loader) this.forceRender();
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
          //   <div class="table-container" ref={el => (this.tableDivRef = el)} onScroll={e => this.handleScroll(e)}>
          //   <div class="table-default-header-container">
          //     <div class="table-data-index">#</div>
          //     {this.getHeader(this.results[this.activeIndex][0].length).map((header: string, index: number) => (
          //       <div onClick={() => this.setColumnIndex(index)} class="table-default-header">
          //         {header}
          //       </div>
          //     ))}
          //   </div>
          //   <div class="table-row-container" ref={el => (this.rowContainerRef = el)}>
          //     {this.results[this.activeIndex].slice(this.startIndex, this.endIndex).map((e: any, i: number) => (
          //       <div class="">
          //         <div class="table-data-container">
          //           <div class="table-data-index">{i + 1}</div>
          //           {Object.entries(e).map(([keys, values], index: number) => this.getTableTd(values, keys, i, index, 'row'))}
          //         </div>
          //       </div>
          //     ))}
          //   </div>
          // </div>
          <div class="table-container">
            <revo-grid
              style={{ minHeight: '300px' }}
              columns={Object.keys(this.results[this.activeIndex][0]).map(key => {
                return { prop: key, name: key };
              })}
              source={this.results[this.activeIndex]}
              resize={true}
              rowHeaders={true}
              range={true}
              colSize={200}
              // @ts-ignore
              // columnTypes={columnTypes}
            />
          </div>
        ) : (
          <div>No Data</div>
        )}
        <div class="tab-container">
          {this.fileName.map((name: string, index: number) => (
            <button class={this.activeIndex === index && 'active-tab'} onClick={() => this.activeTab(index)}>
              {name}
            </button>
          ))}
        </div>
      </div>
    );
  }
}
