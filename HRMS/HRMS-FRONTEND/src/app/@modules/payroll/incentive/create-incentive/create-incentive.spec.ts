import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIncentive } from './create-incentive';

describe('CreateIncentive', () => {
  let component: CreateIncentive;
  let fixture: ComponentFixture<CreateIncentive>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateIncentive]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateIncentive);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
