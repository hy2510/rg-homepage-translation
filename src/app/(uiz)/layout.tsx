'use client'

import { useEffect } from 'react'
import {
  registRejectRefreshToken,
  unregistRejectRefreshToken,
} from '@/repository/client/utils'
import Gfooter from '@/ui/common/global-footer/global-footer'
import { useThemeColor } from '@/ui/context/StyleContext'
import useLogout from '../_function/use-logout'
import Gheader from './_header/Gheader'

export default function Layout({ children }: { children?: React.ReactNode }) {
  const themeColor = useThemeColor()

  const onLogout = useLogout()
  useEffect(() => {
    registRejectRefreshToken(() => {
      onLogout()
    })
    return () => unregistRejectRefreshToken()
  }, [onLogout])

  return (
    <>
      <meta name="theme-color" content={themeColor} />
      <Gheader />
      {children}
      <Gfooter />
    </>
  )
}
