import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentiveList } from './incentive-list';

describe('IncentiveList', () => {
  let component: IncentiveList;
  let fixture: ComponentFixture<IncentiveList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncentiveList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncentiveList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
