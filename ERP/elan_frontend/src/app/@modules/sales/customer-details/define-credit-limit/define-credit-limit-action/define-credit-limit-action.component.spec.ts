import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefineCreditLimitActionComponent } from './define-credit-limit-action.component';

describe('DefineCreditLimitActionComponent', () => {
  let component: DefineCreditLimitActionComponent;
  let fixture: ComponentFixture<DefineCreditLimitActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefineCreditLimitActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefineCreditLimitActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
