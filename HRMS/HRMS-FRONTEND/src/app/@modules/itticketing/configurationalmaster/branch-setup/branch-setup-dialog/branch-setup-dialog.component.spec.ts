import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchSetupDialogComponent } from './branch-setup-dialog.component';

describe('BranchSetupDialogComponent', () => {
  let component: BranchSetupDialogComponent;
  let fixture: ComponentFixture<BranchSetupDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchSetupDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchSetupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
