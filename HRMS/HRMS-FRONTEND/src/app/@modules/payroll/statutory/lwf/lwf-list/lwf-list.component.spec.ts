import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LwfListComponent } from './lwf-list.component';

describe('LwfListComponent', () => {
  let component: LwfListComponent;
  let fixture: ComponentFixture<LwfListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LwfListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LwfListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
