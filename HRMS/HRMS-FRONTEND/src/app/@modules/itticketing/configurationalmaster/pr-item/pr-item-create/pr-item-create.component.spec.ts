import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrItemCreateComponent } from './pr-item-create.component';

describe('PrItemCreateComponent', () => {
  let component: PrItemCreateComponent;
  let fixture: ComponentFixture<PrItemCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrItemCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrItemCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
