import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryTemplateCreateComponent } from './salary-template-create.component';

describe('SalaryTemplateCreateComponent', () => {
  let component: SalaryTemplateCreateComponent;
  let fixture: ComponentFixture<SalaryTemplateCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryTemplateCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryTemplateCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
