import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateProfileRoutingModule } from './candidate-profile-routing.module';
import { BvgListComponent } from './bvg-list/bvg-list.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { CandidateProfileComponent } from './candidate-profile.component';
import { CandidateProfileCreateComponent } from './candidate-profile-create/candidate-profile-create.component';
import { CandidateProfileListComponent } from './candidate-profile-list/candidate-profile-list.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CKEditorModule } from 'ckeditor4-angular';
import { ProfileActionsComponent } from './actions/actions.component';
import { ProfileDialogComponent } from './profile-dialog/profile-dialog.component';
import { PdfDownloadComponent } from './pdf-download/pdf-download.component';
import { MatIconModule } from '@angular/material/icon';
import { CandidateProfileComponent1 } from './varification-list/varification-list.component';
import { SearchPipe } from 'src/app/@shared/pipe/recruitment_Module_pipe/search.pipe';
import { MatSelectFilterModule } from 'mat-select-filter';



@NgModule({
  declarations: [
    SearchPipe,
    CandidateProfileComponent,
    BvgListComponent,
    CandidateProfileListComponent,
    CandidateProfileComponent1,
    ProfileActionsComponent,
    ProfileDialogComponent,
    PdfDownloadComponent,
    CandidateProfileCreateComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    MatIconModule,
    CandidateProfileRoutingModule,
    AgGridModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    CKEditorModule,
    MatSelectFilterModule
  ]
})

export class CandidateProfileModule { }
