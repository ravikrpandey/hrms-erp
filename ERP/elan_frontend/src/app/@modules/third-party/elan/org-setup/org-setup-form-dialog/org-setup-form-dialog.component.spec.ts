import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgSetupFormDialogComponent } from './org-setup-form-dialog.component';

describe('OrgSetupFormDialogComponent', () => {
  let component: OrgSetupFormDialogComponent;
  let fixture: ComponentFixture<OrgSetupFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrgSetupFormDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrgSetupFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
