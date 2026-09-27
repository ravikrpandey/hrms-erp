import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTabs } from './all-tabs';

describe('AllTabs', () => {
  let component: AllTabs;
  let fixture: ComponentFixture<AllTabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllTabs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllTabs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
