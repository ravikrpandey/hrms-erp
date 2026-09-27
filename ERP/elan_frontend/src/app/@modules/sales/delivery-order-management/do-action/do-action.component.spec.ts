import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoAction } from './do-action.component';

describe('DoAction', () => {
  let component: DoAction;
  let fixture: ComponentFixture<DoAction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoAction ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoAction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
