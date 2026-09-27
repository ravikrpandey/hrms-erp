import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleryApproverMainComponent } from './salery-approver-main.component';

describe('SaleryApproverMainComponent', () => {
  let component: SaleryApproverMainComponent;
  let fixture: ComponentFixture<SaleryApproverMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleryApproverMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleryApproverMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
