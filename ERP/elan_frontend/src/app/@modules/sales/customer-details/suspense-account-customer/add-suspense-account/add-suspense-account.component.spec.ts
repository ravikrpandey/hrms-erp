import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSuspenseAccountComponent } from './add-suspense-account.component';

describe('AddSuspenseAccountComponent', () => {
  let component: AddSuspenseAccountComponent;
  let fixture: ComponentFixture<AddSuspenseAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSuspenseAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSuspenseAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
