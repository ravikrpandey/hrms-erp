import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-priority-renderer',

  templateUrl: './priority-renderer.component.html',
  styleUrls: ['./priority-renderer.component.scss']
})
export class PriorityRendererComponent {
  @Input() priority: any;


  agInit(params: any): void {
    const getPriorityData = params?.getPriorityData;
    this.priority = getPriorityData ? getPriorityData(params.value) : null;
  }
}
