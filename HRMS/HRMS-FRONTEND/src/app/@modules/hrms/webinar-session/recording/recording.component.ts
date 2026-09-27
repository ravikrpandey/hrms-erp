import { Component } from '@angular/core';
import { MatInputModule } from "@angular/material/input";
import { ButtonComponent } from 'src/app/@shared/button/button.component';

// import { WebinarSessionComponent } from "../webinar-session.component";

@Component({
  selector: 'app-recording',
  standalone:true,
  imports: [MatInputModule, ButtonComponent],
  templateUrl: './recording.component.html',
  styleUrls: ['./recording.component.css']
})
export class RecordingComponent {

}
