import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { BaseLayout } from "@app/layout";
import { navigationMap } from "@shared/model";
import { ProtectedRoute } from "./ProtectedRoute";
import { ErrorPage } from "@shared/ui/errorPage";
import { NotFound } from "@pages/notFound";
import { CharacterPage } from "@pages/userAvatar";

export const AppRouter = () => {

    return (
        <Routes>
            <Route
                path="/"
                element={<Outlet />}
                errorElement={<ErrorPage />}
            >
                <Route path="/" element={<Navigate to={navigationMap.userAvatar} />} />
                <Route
                    path={navigationMap.userAvatar}
                    element={
                        <ProtectedRoute roles={['Admins', 'Owners', 'Managers', 'Developers']}>
                            {<CharacterPage/>}
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