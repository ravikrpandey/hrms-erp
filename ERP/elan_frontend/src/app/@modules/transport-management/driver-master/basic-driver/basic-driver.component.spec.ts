import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicDriverComponent } from './basic-driver.component';

describe('BasicDriverComponent', () => {
  let component: BasicDriverComponent;
  let fixture: ComponentFixture<BasicDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicDriverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
