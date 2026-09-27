import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryTemplateViewComponent } from './salary-template-view.component';

describe('SalaryTemplateViewComponent', () => {
  let component: SalaryTemplateViewComponent;
  let fixture: ComponentFixture<SalaryTemplateViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryTemplateViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryTemplateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
