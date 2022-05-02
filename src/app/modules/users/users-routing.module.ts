import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailUserComponent } from './detail-user/detail-user.component';
import { EditUsersComponent } from './edit-users/edit-users.component';
import { UsersComponent } from './list/users.component';
import { EditUserRoleComponent } from './user-role/edit-user-role/edit-user-role.component';
import { UserRoleComponent } from './user-role/list/user-role.component';

const routes: Routes = [
  {
    path: 'users',
    children: [
      {
        path: 'list',
        component: UsersComponent
      },
      {
        path: 'add',
        component: EditUsersComponent,
        data: { isMasterDataAdd: true }
      },
      {
        path: 'edit/:id',
        component: EditUsersComponent,
        data: { isMasterDataUpdate: true }
      },
      {
        path: 'detail/:id',
        component: DetailUserComponent,
        data: { isMasterDataView: true }
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: '**', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
  {
    path: 'user-role',
    children: [
      {
        path: 'list',
        component: UserRoleComponent
      },
      {
        path: 'edit/:id',
        component: EditUserRoleComponent,
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: '**', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule { }
