import {
  Component,
  Input,
  Output,
  EventEmitter,
  ContentChild,
  TemplateRef,
  HostListener,
  OnInit,
} from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';


@Component({
  selector: 'app-dialog',
  templateUrl: './app-dialogue.component.html',
  styleUrls: ['./app-dialogue.component.scss'],
  animations: [
    trigger('dialogAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' }))
      ])
    ])
  ]
})
export class AppDialogueComponent implements OnInit{
  @Input() visible:boolean = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() animationDuration: string = '200ms';
  @Input() style: any;

  @Input() width: string = '500px';
  @Input() closable: boolean = true;
  @Input() closeOnBackdropClick = true;

  @ContentChild('dialogHeader') headerTemplate!: TemplateRef<any>;
  @ContentChild('dialogBody') bodyTemplate!: TemplateRef<any>;
  @ContentChild('dialogFooter') footerTemplate!: TemplateRef<any>;

  @HostListener('document:keydown.escape', ['$event'])
    onEscKey(event: KeyboardEvent) {
      if (this.visible && this.closable) this.close();
  }

  constructor() { }

  ngOnInit(): void {
    this.style = { ...this.style, width: this.width };
  }
  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
