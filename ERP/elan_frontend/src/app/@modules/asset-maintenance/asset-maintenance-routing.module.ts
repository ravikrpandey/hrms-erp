import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetMaintenanceComponent } from './asset-maintenance/asset-maintenance.component';
import { AuthGuard } from 'src/app/@auth/auth-material/auth.guard';

const routes: Routes = [
  {path:'',component:AssetMaintenanceComponent,
    children:[
        {path:'',
          canActivate:[AuthGuard],
          loadChildren:()=>import('./maintenance/maintenance.module').then(m=>m.MaintenanceModule)
        }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetMaintenanceRoutingModule { }
