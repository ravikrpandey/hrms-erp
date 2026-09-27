import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSoDateComponent } from './update-so-date.component';

describe('UpdateSoDateComponent', () => {
  let component: UpdateSoDateComponent;
  let fixture: ComponentFixture<UpdateSoDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateSoDateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateSoDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
