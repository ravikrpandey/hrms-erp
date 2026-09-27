import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesRegisterListComponent } from './sales-register-list.component';

describe('SalesRegisterListComponent', () => {
  let component: SalesRegisterListComponent;
  let fixture: ComponentFixture<SalesRegisterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesRegisterListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesRegisterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
