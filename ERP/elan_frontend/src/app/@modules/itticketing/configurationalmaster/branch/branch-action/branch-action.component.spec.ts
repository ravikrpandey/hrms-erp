import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchActionComponent } from './branch-action.component';

describe('BranchActionComponent', () => {
  let component: BranchActionComponent;
  let fixture: ComponentFixture<BranchActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
