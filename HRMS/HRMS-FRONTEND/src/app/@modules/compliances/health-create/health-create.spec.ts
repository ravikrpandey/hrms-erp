import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthCreate } from './health-create';

describe('HealthCreate', () => {
  let component: HealthCreate;
  let fixture: ComponentFixture<HealthCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HealthCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
