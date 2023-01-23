import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'my-table',
  styleUrl: 'my-table.css',
  shadow: true,
})
export class MyTable {
  @Prop() getHeader: (length: number) => string[];
  @Prop() getTableTd: (td: any, th: string | number, index: number, rowOrColumn: string) => any;
  @Prop() results: any;
  @Prop() activeIndex: number;

  render() {
    return this.results.length ? (
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
    );
  }
}
