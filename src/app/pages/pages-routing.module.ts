import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LayoutComponent } from "./_layout/layout.component";

const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "document",
        loadChildren: () =>
          import("../modules/document/document.module").then(
            (m) => m.DocumentModule
          ),
      },
      {
        path: 'system-admin',
        loadChildren: () => import('../modules/users/users.module').then((m) => m.UsersModule)
      },
      {
        path: "user-profile",
        loadChildren: () =>
          import("../modules/user-profile/user-profile.module").then(
            (m) => m.UserProfileModule
          ),
      },
      {
        path: "warehouse",
        loadChildren: () =>
          import("../modules/warehouse/warehouse.module").then(
            (m) => m.WarehouseModule
          ),
      },
      {
        path: "farm-management",
        loadChildren:  () =>
        import("../modules/farm-management/farm-management.module").then((m) => m.FarmManagementModule )
      },
      {
        path: "land",
        loadChildren: () =>
          import("../modules/land/land.module").then((m) => m.LandModule),
      },
      {
        path: "acc",
        loadChildren: () =>
          import("../modules/acc/acc.module").then((m) => m.ACCModule),
      },
      {
        path: "dashboard",
        loadChildren: () =>
          import("../modules/dashboard/dashboard.module").then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: "",
        redirectTo: "/dashboard",
        pathMatch: "full",
      },
      {
        path: "**",
        redirectTo: "error/404",
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
