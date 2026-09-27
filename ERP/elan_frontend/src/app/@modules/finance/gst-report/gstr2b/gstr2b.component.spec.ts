import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gstr2bComponent } from './gstr2b.component';

describe('Gstr2bComponent', () => {
  let component: Gstr2bComponent;
  let fixture: ComponentFixture<Gstr2bComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Gstr2bComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Gstr2bComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
