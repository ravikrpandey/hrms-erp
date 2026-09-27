import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrItemViewComponent } from './pr-item-view.component';

describe('PrItemViewComponent', () => {
  let component: PrItemViewComponent;
  let fixture: ComponentFixture<PrItemViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrItemViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrItemViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
