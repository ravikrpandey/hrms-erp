import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticePeriodList } from './notice-period-list';

describe('NoticePeriodList', () => {
  let component: NoticePeriodList;
  let fixture: ComponentFixture<NoticePeriodList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticePeriodList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticePeriodList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
