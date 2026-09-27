import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchSetupCreateComponent } from './branch-setup-create.component';

describe('BranchSetupCreateComponent', () => {
  let component: BranchSetupCreateComponent;
  let fixture: ComponentFixture<BranchSetupCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchSetupCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchSetupCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
