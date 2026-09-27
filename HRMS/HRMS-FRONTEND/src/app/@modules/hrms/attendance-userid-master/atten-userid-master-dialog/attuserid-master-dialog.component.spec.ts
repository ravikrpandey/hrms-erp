import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttUseridMasterDialogComponent } from './attuserid-master-dialog.component';

describe('AttUseridMasterDialogComponent', () => {
  let component: AttUseridMasterDialogComponent;
  let fixture: ComponentFixture<AttUseridMasterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttUseridMasterDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttUseridMasterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
