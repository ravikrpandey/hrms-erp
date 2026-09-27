import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppliedLeavesComponent } from './applied-leaves.component';

describe('AppliedLeavesComponent', () => {
  let component: AppliedLeavesComponent;
  let fixture: ComponentFixture<AppliedLeavesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppliedLeavesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppliedLeavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
