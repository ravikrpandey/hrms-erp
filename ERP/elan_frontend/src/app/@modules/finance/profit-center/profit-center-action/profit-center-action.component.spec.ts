import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitCenterActionComponent } from './profit-center-action.component';

describe('ProfitCenterActionComponent', () => {
  let component: ProfitCenterActionComponent;
  let fixture: ComponentFixture<ProfitCenterActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfitCenterActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfitCenterActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
