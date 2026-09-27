import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryTemplateActionComponent } from './salary-template-action.component';

describe('SalaryTemplateActionComponent', () => {
  let component: SalaryTemplateActionComponent;
  let fixture: ComponentFixture<SalaryTemplateActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryTemplateActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryTemplateActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
