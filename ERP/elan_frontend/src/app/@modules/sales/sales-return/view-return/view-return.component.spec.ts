import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReturnComponent } from './view-return.component';

describe('ViewReturnComponent', () => {
  let component: ViewReturnComponent;
  let fixture: ComponentFixture<ViewReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewReturnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
