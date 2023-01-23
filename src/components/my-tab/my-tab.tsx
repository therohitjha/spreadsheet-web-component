import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'my-tab',
  styleUrl: 'my-tab.css',
  shadow: true,
})
export class MyTab {
  @Prop() fileName: string[];
  @Prop() activeIndex: number;
  @Prop() activeTab: (index: number) => void;
  render() {
    return (
      <div class="tab-container">
        {this.fileName.map((name: string, index: number) => (
          <button style={this.activeIndex === index && { backgroundColor: 'white' }} onClick={() => this.activeTab(index)}>
            {name}
          </button>
        ))}
      </div>
    );
  }
}
