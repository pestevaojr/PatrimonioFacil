import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InventariosPage } from './inventarios.page';

describe('Inventarios', () => {
  let component: InventariosPage;
  let fixture: ComponentFixture<InventariosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InventariosPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InventariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
