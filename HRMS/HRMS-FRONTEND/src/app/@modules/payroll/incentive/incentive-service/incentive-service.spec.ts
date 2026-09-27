import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentiveService } from './incentive-service';

describe('IncentiveService', () => {
  let component: IncentiveService;
  let fixture: ComponentFixture<IncentiveService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncentiveService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncentiveService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
