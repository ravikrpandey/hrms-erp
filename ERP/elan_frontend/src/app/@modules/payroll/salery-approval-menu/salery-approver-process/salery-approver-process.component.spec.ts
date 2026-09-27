import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleryApproverProcessComponent } from './salery-approver-process.component';

describe('SaleryApproverProcessComponent', () => {
  let component: SaleryApproverProcessComponent;
  let fixture: ComponentFixture<SaleryApproverProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleryApproverProcessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleryApproverProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
