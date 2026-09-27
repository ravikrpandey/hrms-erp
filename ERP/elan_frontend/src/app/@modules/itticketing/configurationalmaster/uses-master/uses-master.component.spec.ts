import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsesMasterComponent } from './uses-master.component';

describe('UsesMasterComponent', () => {
  let component: UsesMasterComponent;
  let fixture: ComponentFixture<UsesMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsesMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsesMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
