import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { BaseLayout } from "@app/layout";
import { navigationMap } from "@shared/model";
import { AuthPage } from "@pages/auth";
import { ProtectedRoute } from "./ProtectedRoute";
import { PartnerAccountsPage } from "@pages/partnerAccounts";
import { PartnersListPage } from "@pages/partners";
import { PartnersStatisticPage } from "@pages/partnersStatistic";
import { Accounts } from "@pages/accounts";
import { Finance } from "@pages/finances/ui/Finance";
import { PartnerEditing } from "@pages/partnerEditing";
import { PartnerPage } from "@pages/partner/ui/PartnerPage";
//import { PartnerFinances } from "@widgets/partners/partnerFinances";
import { PartnerAccountsListChart } from "@widgets/partners/partnerAccountsListChart";
import { TelegramAuthPage } from "@pages/telegramAuth";
import { AccountPage } from "@pages/account/ui/AccountPage";
import { UsersPage } from "@pages/users";
import { ErrorPage } from "@shared/ui/errorPage";
import { NotFound } from "@pages/notFound";
import { PartnerGroupsStatisticPage } from "@pages/partnerGroupsStatistic";

export const AppRouter = () => {

    return (
        <Routes>
            <Route
                path="/"
                element={<Outlet />}
                errorElement={<ErrorPage />}
            >
                <Route path="/" element={<Navigate to={'/partners'} />} />
                <Route path={navigationMap.login} element={<AuthPage />} />
                <Route
                    path={navigationMap.accounts}
                    element={
                        <ProtectedRoute roles={['Admins', 'Owners', 'Managers', 'Developers']}>
                            {<Accounts/>}
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={navigationMap.partnerById}
                    element={
                        <ProtectedRoute roles={['Admins', 'Owners', 'Managers', 'Partners', 'Developers']}>
                            {<PartnerPage/>}
                        </ProtectedRoute>
                    }
                >
                    <Route
                        path={navigationMap.partnerById + '/table'}
                        element={<PartnerAccountsPage />}
                    />
                    <Route
                        path={navigationMap.partnerGroups}
                        element={<PartnerGroupsStatisticPage/>}
                    />
                    <Route
                        path={navigationMap.partnerById + '/statistic'}
                        element={<PartnerAccountsListChart />}
                    />
                </Route>
                <Route
                    path={navigationMap.fbAccount}
                    element={
                        <ProtectedRoute roles={['Admins', 'Owners', 'Managers', 'Developers']} >
                            <AccountPage/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={navigationMap.users}
                    element={
                        <ProtectedRoute roles={['Admins', 'Owners', 'Managers', 'Developers']} >
                            <UsersPage/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={navigationMap.partners}
                    element={
                        <ProtectedRoute roles={['Admins', 'Owners', 'Managers', 'Developers']} >
                            <PartnersListPage/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={navigationMap.partnersStatistic}
                    element={
                        <ProtectedRoute roles={['Admins', 'Owners', 'Developers']} >
                            <PartnersStatisticPage/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={navigationMap.finances}
                    element={
                        <ProtectedRoute roles={['Admins', 'Owners', 'Managers', 'Partners', 'Developers']} >
                            <Finance/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={navigationMap.partnerEditing}
                    element={
                        <ProtectedRoute roles={['Admins', 'Owners', 'Managers', 'Developers']} >
                            <PartnerEditing/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={navigationMap.telegramAuth}
                    element={
                        <ProtectedRoute roles={['Admins', 'Owners', 'Managers', 'Developers']} >
                            <TelegramAuthPage/>
                        </ProtectedRoute>
                    }
                />
                <Route 
                    path="*" 
                    element={(
                        <BaseLayout>
                            <NotFound/>
                        </BaseLayout>
                    )} />
            </Route>
        </Routes >
    );
};