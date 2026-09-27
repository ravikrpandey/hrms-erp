import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelfareAction } from './welfare-action';

describe('WelfareAction', () => {
  let component: WelfareAction;
  let fixture: ComponentFixture<WelfareAction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelfareAction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelfareAction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
