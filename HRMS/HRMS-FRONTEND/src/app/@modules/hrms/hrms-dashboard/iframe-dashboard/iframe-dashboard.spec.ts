import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IframeDashboard } from './iframe-dashboard';

describe('IframeDashboard', () => {
  let component: IframeDashboard;
  let fixture: ComponentFixture<IframeDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IframeDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IframeDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
