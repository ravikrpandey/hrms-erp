import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityManagementComponent } from './quality-management.component';

describe('QualityManagementComponent', () => {
  let component: QualityManagementComponent;
  let fixture: ComponentFixture<QualityManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QualityManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QualityManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
