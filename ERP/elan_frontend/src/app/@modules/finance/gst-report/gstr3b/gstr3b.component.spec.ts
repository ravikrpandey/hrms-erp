import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gstr3bComponent } from './gstr3b.component';

describe('Gstr3bComponent', () => {
  let component: Gstr3bComponent;
  let fixture: ComponentFixture<Gstr3bComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Gstr3bComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Gstr3bComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
