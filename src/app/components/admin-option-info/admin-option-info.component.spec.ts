import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOptionInfoComponent } from './admin-option-info.component';

describe('AdminOptionInfoComponent', () => {
  let component: AdminOptionInfoComponent;
  let fixture: ComponentFixture<AdminOptionInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminOptionInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOptionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
