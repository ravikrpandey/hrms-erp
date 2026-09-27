import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TdsActionComponent } from './tds-action.component';

describe('TdsActionComponent', () => {
  let component: TdsActionComponent;
  let fixture: ComponentFixture<TdsActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TdsActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TdsActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
