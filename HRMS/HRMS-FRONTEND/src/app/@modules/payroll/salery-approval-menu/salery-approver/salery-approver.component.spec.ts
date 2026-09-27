import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleryApproverComponent } from './salery-approver.component';

describe('SaleryApproverComponent', () => {
  let component: SaleryApproverComponent;
  let fixture: ComponentFixture<SaleryApproverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleryApproverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleryApproverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
