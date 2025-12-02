import { useGetMeMutation } from "@entities/user"
import { constantsMap, navigationMap } from "@shared/model";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import '@shared/lib/i18n';
import { Spin } from "antd";

type Props = {
  children: React.ReactNode
}

export const InitializationProvider = ({ children }: Props) => {

  const location = useLocation()
  //const [getMe, { isLoading, isError, error, status }] = useGetMeMutation();
  const navigate = useNavigate()

  // useEffect(() => {

  //   const checkAuth = async () => {
  //     await getMe()
  //     const statusCode = Number(status)
  //     if (isError || statusCode === 401) {
  //       navigate('/login')
  //     }
  //   }

  //   if (location.pathname !== navigationMap.login) {
  //     checkAuth()
  //   }
  // }, [])

  return (
    <>
      {/* { isLoading ? (
        <Spin size="large" fullscreen/>
        ) : children} */}
    </>
  )

}