import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { BaseLayout } from "@app/layout";
import { navigationMap } from "@shared/model";
import { ProtectedRoute } from "./ProtectedRoute";
import { ErrorPage } from "@shared/ui/errorPage";
import { NotFound } from "@pages/notFound";
import { CharacterPage } from "@pages/userAvatar";
import { UserStatsPage } from "@pages/stats";
import { QuestsPage } from "@pages/quests";
import { QuestExercisePage } from "@pages/exercise";
import { QuestMapPage } from "@pages/questMap";
import { AuthPage } from "@pages/auth";


export const AppRouter = () => {

    return (
        <Routes>
            <Route
                path="/"
                element={<Outlet />}
                errorElement={<ErrorPage />}
            >
                <Route path="/" element={<Navigate to={navigationMap.userAvatar} />} />
                <Route path="/auth" element={<AuthPage />}/>
                <Route
                    path={navigationMap.stats}
                    element={
                        <ProtectedRoute roles={['Admins', 'Owners', 'Managers', 'Developers', null]}>
                            {<UserStatsPage/>}
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={navigationMap.userAvatar}
                    element={
                        <ProtectedRoute roles={['Admins', 'Owners', 'Managers', 'Developers']}>
                            {<CharacterPage/>}
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={navigationMap.quests}
                    element={
                        <ProtectedRoute roles={['Admins', 'Owners', 'Managers', 'Developers']}>
                            {<QuestsPage/>}
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={navigationMap.tasks}
                    element={
                        <ProtectedRoute roles={['Admins', 'Owners', 'Managers', 'Developers']}>
                            {<QuestExercisePage/>}
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={navigationMap.map}
                    element={
                        <ProtectedRoute roles={['Admins', 'Owners', 'Managers', 'Developers']}>
                            {<QuestMapPage/>}
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