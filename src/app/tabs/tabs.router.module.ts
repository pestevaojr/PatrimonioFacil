import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'inventarios',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../inventarios/inventarios.module').then(m => m.InventariosPageModule)
          }
        ]
      },
      {
        path: 'leitura',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../leitura/leitura.module').then(m => m.LeituraPageModule)
          }
        ]
      },
      {
        path: 'sobre',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../sobre/sobre.module').then(m => m.SobrePageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/inventarios',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/inventarios',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
