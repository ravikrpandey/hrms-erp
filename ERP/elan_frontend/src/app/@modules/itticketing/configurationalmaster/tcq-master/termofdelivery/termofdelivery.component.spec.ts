import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermofdeliveryComponent } from './termofdelivery.component';

describe('TermofdeliveryComponent', () => {
  let component: TermofdeliveryComponent;
  let fixture: ComponentFixture<TermofdeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermofdeliveryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermofdeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
