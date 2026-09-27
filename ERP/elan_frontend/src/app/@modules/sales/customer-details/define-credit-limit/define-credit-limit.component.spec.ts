import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefineCreditLimitComponent } from './define-credit-limit.component';

describe('DefineCreditLimitComponent', () => {
  let component: DefineCreditLimitComponent;
  let fixture: ComponentFixture<DefineCreditLimitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefineCreditLimitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefineCreditLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
