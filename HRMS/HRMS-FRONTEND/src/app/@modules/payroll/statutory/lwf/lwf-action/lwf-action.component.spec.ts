import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LwfActionComponent } from './lwf-action.component';

describe('LwfActionComponent', () => {
  let component: LwfActionComponent;
  let fixture: ComponentFixture<LwfActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LwfActionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LwfActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
