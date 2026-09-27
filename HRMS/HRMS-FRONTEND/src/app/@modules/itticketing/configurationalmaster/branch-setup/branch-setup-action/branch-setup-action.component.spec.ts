import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchSetupActionComponent } from './branch-setup-action.component';

describe('BranchSetupActionComponent', () => {
  let component: BranchSetupActionComponent;
  let fixture: ComponentFixture<BranchSetupActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchSetupActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchSetupActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
