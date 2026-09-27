import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LwfCreateComponent } from './lwf-create.component';

describe('LwfCreateComponent', () => {
  let component: LwfCreateComponent;
  let fixture: ComponentFixture<LwfCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LwfCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LwfCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
