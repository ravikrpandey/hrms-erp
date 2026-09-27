import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './@shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { CKEditorModule } from 'ckeditor4-angular';
import { MatDialogModule } from '@angular/material/dialog';
import { ActionComponent } from './@shared/action/action.component';
import { AppListDialogComponent } from './@shared/app-list-dialog/app-list-dialog.component';
import { TitleCasePipe } from './@shared/pipe/title-case.pipe';
// import { FilterPipe } from './@shared/pipe/filter.pipe';
import { ListPrintPipe } from './@shared/pipe/list-print.pipe';
// import { SearchPipe } from './@shared/pipe/search.pipe';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoaderDirective } from './@shared/directives/loader.directive';
import { AuthInterceptor } from './@auth/auth-material/auth.interceptor';
import { NgChartsModule } from 'ng2-charts';
// import { AnsweringFormComponent } from './answering-form/answering-form.component';
// import { BranchingFormComponent } from './branching-form/branching-form.component';
import { TaskOrderAppListDialogComponent } from './@shared/task-order-app-list-dialog/task-order-app-list-dialog.component';
import { TaskOrderPdfComponent } from './task-order-pdf/task-order-pdf.component';
import { CandidateFormComponent } from './candidate-form/candidate-form.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MediaComponent } from './media/media.component';
import { DateInterceptor } from './@shared/date.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoaderInterceptor } from './@shared/loader-interceptor/loader.interceptor';
import { DomainInterceptor } from './interceptors/domain-interceptor';

// import { DateInterceptor } from './@shared/date.interceptor';

// import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
// import { DropdownSearchablePipe } from './@shared/pipe/dropdown-searchable.pipe';
@NgModule({
  declarations: [
    AppComponent,
    ActionComponent,
    AppListDialogComponent,
    TitleCasePipe,
    // FilterPipe,
    ListPrintPipe,
    LoaderDirective,
    TaskOrderAppListDialogComponent,
    TaskOrderPdfComponent,
    CandidateFormComponent,
    MediaComponent,
    
    // DropdownSearchablePipe,
    // SearchPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    CKEditorModule,
    MaterialModule,
    MatDialogModule,
    MatPaginatorModule,
    // LoadingBarModule,
    // LoadingBarHttpClientModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    NgChartsModule,
    NgxSpinnerModule,
  ],
  exports: [],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: DateInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DomainInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
