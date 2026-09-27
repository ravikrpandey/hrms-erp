import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchSetupStatusComponent } from './branch-setup-status.component';

describe('BranchSetupStatusComponent', () => {
  let component: BranchSetupStatusComponent;
  let fixture: ComponentFixture<BranchSetupStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchSetupStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchSetupStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
