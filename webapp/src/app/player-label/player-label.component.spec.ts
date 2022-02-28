import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerLabelComponent } from './player-label.component';

describe('PlayerLabelComponent', () => {
  let component: PlayerLabelComponent;
  let fixture: ComponentFixture<PlayerLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerLabelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
