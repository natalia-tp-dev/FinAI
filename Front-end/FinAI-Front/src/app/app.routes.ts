import { Routes } from '@angular/router';
import { LandingPage } from './components/main/landing-page/not-shared/landing-page/landing-page';
import { SignUp } from './components/main/landing-page/not-shared/user/sign-up/sign-up';
import { SignIn } from './components/main/landing-page/not-shared/user/sign-in/sign-in';
import { Pricing } from './components/main/landing-page/not-shared/user/pricing/pricing';
import { UserPage } from './components/main/user-page/not-shared/user-page/user-page';
import { authGuard } from './guards/user-guards/auth-guard';
import { landingGuard } from './guards/landing-guards/landing-guard';
import { Dashboard } from './components/main/user-page/shared/dashboard/dashboard';
import { Transactions } from './components/main/user-page/shared/transactions/transactions';
import { SavingGoals } from './components/main/user-page/shared/saving-goals/saving-goals';
import { AddGoal } from './components/main/user-page/shared/add-goal/add-goal';
import { Predictions } from './components/main/user-page/shared/predictions/predictions';
import { aiGuard } from './guards/ai/ai-guard';

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
        component: Pricing,
        canActivate: [authGuard]
    },
    {
        path: 'sign-in',
        component: SignIn,
        canActivate: [landingGuard]
    },
    {
        path: 'add-goal',
        component: AddGoal
    },
    {
        path: 'user-page',
        component: UserPage,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                component: Dashboard
            },
            {
                path: 'transactions',
                component: Transactions
            },
            {
                path: 'saving-goals',
                component: SavingGoals
            },
            {
                path: 'predictions',
                canActivate: [aiGuard],
                component: Predictions
            }
        ]
    }
];
