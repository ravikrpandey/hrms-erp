import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalFgComponent } from './total-fg.component';

describe('TotalFgComponent', () => {
  let component: TotalFgComponent;
  let fixture: ComponentFixture<TotalFgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalFgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalFgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
