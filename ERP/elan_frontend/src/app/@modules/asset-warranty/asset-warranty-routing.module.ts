import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetWarrantyComponent } from './asset-warranty/asset-warranty.component';
import { AuthGuard } from 'src/app/@auth/auth-material/auth.guard';

const routes: Routes = [
  {path:'',component:AssetWarrantyComponent,
    children:[
        {path:'',
          canActivate:[AuthGuard],
          loadChildren:()=>import('./asset-warranty-list/asset-warranty-list.module').then(m=>m.AssetWarrantyListModule)
        }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetWarrantyRoutingModule { }
