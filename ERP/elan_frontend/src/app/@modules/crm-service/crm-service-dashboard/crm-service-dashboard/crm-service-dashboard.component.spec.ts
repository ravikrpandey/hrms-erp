import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmServiceDashboardComponent } from './crm-service-dashboard.component';

describe('CrmServiceDashboardComponent', () => {
  let component: CrmServiceDashboardComponent;
  let fixture: ComponentFixture<CrmServiceDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrmServiceDashboardComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CrmServiceDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
