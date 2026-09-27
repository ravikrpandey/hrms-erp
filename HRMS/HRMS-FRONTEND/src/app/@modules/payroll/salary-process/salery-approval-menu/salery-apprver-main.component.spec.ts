import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleryApprverMainComponent } from './salery-apprver-main.component';

describe('SaleryApprverMainComponent', () => {
  let component: SaleryApprverMainComponent;
  let fixture: ComponentFixture<SaleryApprverMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleryApprverMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleryApprverMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
