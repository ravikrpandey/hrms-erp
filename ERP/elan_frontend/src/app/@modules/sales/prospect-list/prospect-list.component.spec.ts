import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectListComponent } from './prospect-list.component';

describe('ProspectListComponent', () => {
  let component: ProspectListComponent;
  let fixture: ComponentFixture<ProspectListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProspectListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProspectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
