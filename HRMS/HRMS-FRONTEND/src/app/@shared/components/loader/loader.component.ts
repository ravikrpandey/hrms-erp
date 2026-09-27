import { CommonModule} from '@angular/common';
import { ChangeDetectionStrategy, Component,  Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- <div *ngIf="loader" class="spinner-overlay fading-bars-loader">
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
    </div>  --> 
  `,
  styles: [`
    .spinner-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(255, 255, 255, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1050;
    }

    .fading-bars-loader {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 7px;
    }

    .bar {
      width: 15px;
      height: 50px;
      background-color: #427eb3;
      animation: fade 1.5s infinite ease-in-out;
    }

    .bar:nth-child(1) { animation-delay: 0s; }
    .bar:nth-child(2) { animation-delay: 0.2s; }
    .bar:nth-child(3) { animation-delay: 0.4s; }
    .bar:nth-child(4) { animation-delay: 0.6s; }

    @keyframes fade {
      0%, 100% { opacity: 0.2; }
      50% { opacity: 1; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LoaderComponent implements OnInit{
    @Input() loadingTime?: number = 2500;
    @Input () loader:any;

    ngOnInit(){
        if(this.loadingTime){
            setTimeout(()=>{
                this.loader = false
            }, this.loadingTime || 2500)
        }
    }
}
