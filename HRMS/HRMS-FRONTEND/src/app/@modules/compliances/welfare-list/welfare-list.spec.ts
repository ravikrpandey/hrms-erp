import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelfareList } from './welfare-list';

describe('WelfareList', () => {
  let component: WelfareList;
  let fixture: ComponentFixture<WelfareList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelfareList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelfareList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
