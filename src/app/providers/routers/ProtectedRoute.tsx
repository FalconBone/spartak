import { BaseLayout } from "@app/layout";
import { useAppSelector } from "@shared/hooks/redux";
import type { Role } from "@shared/model/types";
import { Navigate,  } from "react-router-dom";

type Props = {
    roles: Role[],
    children: React.ReactNode
}

type UserTeam = {
    abilities : string[],
    id: number,
    name: Role
}

export const ProtectedRoute: React.FC<Props> = ({ roles, children }) => {
  const authObject = localStorage.getItem('roles');
  if (!authObject) return <Navigate to="/login" />;

  const user: UserTeam[] = JSON.parse(authObject);

  const hasAccess = user.some((userTeam) => roles.includes(userTeam.name));

  if (!hasAccess) return <Navigate to="/login" />;

  return (
    <BaseLayout>
      {children}
    </BaseLayout>
  );
};
