import { APP_INITIALIZER, NgModule } from '@angular/core';
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
import { ListPrintPipe } from './@shared/pipe/list-print.pipe';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoaderDirective } from './@shared/directives/loader.directive';
import { AuthInterceptor } from './@auth/auth-material/auth.interceptor';
import { NgChartsModule } from 'ng2-charts';
import { TaskOrderAppListDialogComponent } from './@shared/task-order-app-list-dialog/task-order-app-list-dialog.component';
import { TaskOrderPdfComponent } from './task-order-pdf/task-order-pdf.component';
import { CandidateFormComponent } from './candidate-form/candidate-form.component';
import { AppliedLeaveActionComponent } from './applied-leave-action/applied-leave-action.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DateInterceptor } from './@auth/auth-material/date.interceptor';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { AccessControlService } from './@shared/services/access-control.service';

export function loadModules(auth: AccessControlService) {
  return () =>
    new Promise<void>((resolve) => {
      const user = JSON.parse(localStorage.getItem('signInUser') || '{}');
      const entity_id = localStorage.getItem('selectedEntityId');

      if (!user?.employee_id) {
        resolve();
        return;
      }

      auth
        .initializeAccess(user.employee_id, user.role_master_id, entity_id)
        .subscribe({
          next: () => resolve(),
          error: () => resolve(),
        });
    });
}

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
    AppliedLeaveActionComponent,
    // SendPiLinkComponent,
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
    LoadingBarModule,
    LoadingBarHttpClientModule,
    NgxMatSelectSearchModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    NgChartsModule,
    NgxSpinnerModule,
    NgxIntlTelInputModule,
  ],
  exports: [],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: DateInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    {
      provide: APP_INITIALIZER,
      useFactory: loadModules,
      deps: [AccessControlService],
      multi: true,
    },
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
