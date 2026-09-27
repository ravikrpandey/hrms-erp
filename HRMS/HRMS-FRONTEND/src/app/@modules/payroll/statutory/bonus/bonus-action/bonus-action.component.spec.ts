import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusActionComponent } from './bonus-action.component';

describe('BonusActionComponent', () => {
  let component: BonusActionComponent;
  let fixture: ComponentFixture<BonusActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BonusActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BonusActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
