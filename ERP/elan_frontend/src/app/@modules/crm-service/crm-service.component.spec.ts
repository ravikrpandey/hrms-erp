import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmServiceComponent } from './crm-service.component';

describe('CrmServiceComponent', () => {
  let component: CrmServiceComponent;
  let fixture: ComponentFixture<CrmServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrmServiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrmServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
