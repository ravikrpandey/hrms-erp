import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthAction } from './health-action';

describe('HealthAction', () => {
  let component: HealthAction;
  let fixture: ComponentFixture<HealthAction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthAction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HealthAction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
