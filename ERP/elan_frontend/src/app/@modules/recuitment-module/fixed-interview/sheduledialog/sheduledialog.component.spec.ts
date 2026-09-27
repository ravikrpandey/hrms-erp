import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheduledialogComponent } from './sheduledialog.component';

describe('SheduledialogComponent', () => {
  let component: SheduledialogComponent;
  let fixture: ComponentFixture<SheduledialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheduledialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SheduledialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
