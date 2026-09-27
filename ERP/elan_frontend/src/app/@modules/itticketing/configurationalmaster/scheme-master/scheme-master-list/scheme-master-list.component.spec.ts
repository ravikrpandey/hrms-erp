import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeMasterListComponent } from './scheme-master-list.component';

describe('SchemeMasterListComponent', () => {
  let component: SchemeMasterListComponent;
  let fixture: ComponentFixture<SchemeMasterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemeMasterListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchemeMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
