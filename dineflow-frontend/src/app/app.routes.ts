import { Routes } from '@angular/router';

import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Unauthorized } from './features/unauthorized/unauthorized';

import { MainLayout } from './layout/main-layout/main-layout';
import { Dashboard } from './features/admin/dashboard/dashboard';
import { Menu } from './features/customer/menu/menu';
import { Orders } from './features/kitchen/orders/orders';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { ROLES } from './core/models/roles';

import { MenuCategories } from './features/admin/menu-categories/menu-categories';
import { MenuItems } from './features/admin/menu-items/menu-items';

import { Tables } from './features/admin/tables/tables';

import { AdminOrders } from './features/admin/admin-orders/admin-orders';

import { MyOrders } from './features/customer/my-orders/my-orders';

import { Payments } from './features/admin/payments/payments';

import { CreateStaff } from './features/admin/create-staff/create-staff';

import { Profile } from './features/profile/profile';

import { ForgotPassword } from './features/auth/forgot-password/forgot-password';
import { ResetPassword } from './features/auth/reset-password/reset-password';

import { BookReservation } from './features/customer/book-reservation/book-reservation';
import { MyReservations } from './features/customer/my-reservations/my-reservations';
import { Reservations } from './features/admin/reservations/reservations';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },
  {
  path: 'forgot-password',
  component: ForgotPassword
},
{
  path: 'reset-password',
  component: ResetPassword
},
  {
    path: 'unauthorized',
    component: Unauthorized
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'admin/dashboard',
        component: Dashboard,
        canActivate: [roleGuard],
        data: { roles: [ROLES.ADMIN] }
      },
      {
        path: 'admin/menu-categories',
        component: MenuCategories,
        canActivate: [roleGuard],
        data: { roles: [ROLES.ADMIN] }
      },
      {
        path: 'admin/menu-items',
        component: MenuItems,
        canActivate: [roleGuard],
        data: { roles: [ROLES.ADMIN] }
      },
      {
        path: 'admin/tables',
        component: Tables,
        canActivate: [roleGuard],
        data: { roles: [ROLES.ADMIN] }
      },
      {
        path: 'admin/orders',
        component: AdminOrders,
        canActivate: [roleGuard],
        data: { roles: [ROLES.ADMIN] }
      },
      {
        path: 'admin/payments',
        component: Payments,
        canActivate: [roleGuard],
        data: { roles: [ROLES.ADMIN] }
      },
      {
        path: 'admin/create-staff',
        component: CreateStaff,
        canActivate: [roleGuard],
        data: { roles: [ROLES.ADMIN] }
      },
      {
  path: 'admin/reservations',
  component: Reservations,
  canActivate: [roleGuard],
  data: { roles: [ROLES.ADMIN] }
},
      {
        path: 'customer/menu',
        component: Menu,
        canActivate: [roleGuard],
        data: { roles: [ROLES.CUSTOMER] }
      },
      {
        path: 'customer/my-orders',
        component: MyOrders,
        canActivate: [roleGuard],
        data: { roles: [ROLES.CUSTOMER] }
      },
      {
  path: 'customer/book-reservation',
  component: BookReservation,
  canActivate: [roleGuard],
  data: { roles: [ROLES.CUSTOMER] }
},
{
  path: 'customer/my-reservations',
  component: MyReservations,
  canActivate: [roleGuard],
  data: { roles: [ROLES.CUSTOMER] }
},
      {
        path: 'kitchen/orders',
        component: Orders,
        canActivate: [roleGuard],
        data: { roles: [ROLES.KITCHEN] }
      },
      {
        path: 'profile',
        component: Profile,
        canActivate: [authGuard]
      },
      
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];