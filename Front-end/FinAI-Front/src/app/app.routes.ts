import { Routes } from '@angular/router';
import { LandingPage } from './components/main/landing-page/not-shared/landing-page/landing-page';
import { SignUp } from './components/main/landing-page/not-shared/user/sign-up/sign-up';
import { SignIn } from './components/main/landing-page/not-shared/user/sign-in/sign-in';
import { Pricing } from './components/main/landing-page/not-shared/user/pricing/pricing';
import { UserPage } from './components/main/user-page/not-shared/user-page/user-page';
import { authGuard } from './guards/user-guards/auth-guard';
import { landingGuard } from './guards/landing-guards/landing-guard';
import { AddTransaction } from './components/main/user-page/shared/add-transaction/add-transaction';
import { CategoryPicker } from './components/main/user-page/shared/category-picker/category-picker';
import { AddCategory } from './components/main/user-page/shared/add-category/add-category';
import { Dashboard } from './components/main/user-page/shared/dashboard/dashboard';

export const routes: Routes = [
    {
        path: '',
        component: LandingPage,
        pathMatch: 'full',
        canActivate: [landingGuard]
    },
    {
        path: 'sign-up',
        component: SignUp,
        canActivate: [landingGuard]
    },
    {
        path: 'pricing',
        component: Pricing
    },
    {
        path: 'sign-in',
        component: SignIn,
        canActivate: [landingGuard]
    },
    {
        path: 'user-page',
        component: UserPage,
        canActivate: [authGuard]
    },
    {
        path: 'dashboard',
        component: Dashboard
    }
];
