import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/@shared/services/common.service';
// import { openai } from '/src/assets/openai.jpg' 
@Component({
  selector: 'ai-integration',
  templateUrl: './ai-integration.component.html',
  styleUrls: ['./ai-integration.scss']
})
export class aiIntegrationComponent {
  aiEngines: any = [{name:"Gemini",id:1,imageSrc:"../../../../../../assets/gemini.png"},{name:"Groq",id:2,imageSrc:"../../../../../../assets/groq.png"},{name:"OpenAi",id:3,imageSrc:"../../../../../../assets/openai.jpg"}];
  activeEngine: any;
  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    private route: Router,
    private toaster: ToastrService,
    private activeRoute: ActivatedRoute,
    private _commonService: CommonService,
  ) {
  }
  ngOnInit(): void {
    this.activeEngine = localStorage.getItem('activeEngine') || "Gemini"; 
  }
  enable(id:any) {
    this.activeEngine = this.aiEngines.find((engine:any) => engine.id == id).name;
    localStorage.setItem('activeEngine', this.activeEngine);
    this.activeEngine = localStorage.getItem('activeEngine'); 
  }
}
