'use client'

import SITE_PATH from '@/app/site-path'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useStyle } from '@/ui/context/StyleContext'
import {
  NavBar,
  NavItem,
} from '@/ui/modules/home-customer-review-components/nav-bar'

const STYLE_ID = 'page_customer_review'

export default function Layout({ children }: { children?: React.ReactNode }) {
  const style = useStyle(STYLE_ID)
  const pathname = usePathname()

  return (
    <main className={`${style.customer_review} container`}>
      <NavBar>
        {/* <NavItem
          active={pathname.indexOf(SITE_PATH.HOME.CUSTOMER_INTERVIEW) != -1}
          href={SITE_PATH.HOME.CUSTOMER_INTERVIEW}>
          학생 수기
        </NavItem>
        <NavItem
          active={pathname.indexOf(SITE_PATH.HOME.CUSTOMER_INTERVIEW) != -1}
          href={SITE_PATH.HOME.CUSTOMER_INTERVIEW}>
          학부모 수기
        </NavItem> */}
        <NavItem
          active={pathname.indexOf(SITE_PATH.HOME.CUSTOMER_INTERVIEW) != -1}
          href={SITE_PATH.HOME.CUSTOMER_INTERVIEW}>
          RG인 인터뷰
        </NavItem>
        <NavItem
          active={pathname.indexOf(SITE_PATH.HOME.SNS_REVIEW) != -1}
          href={SITE_PATH.HOME.SNS_REVIEW}>
          SNS 후기
        </NavItem>
      </NavBar>
      <div className={style.contents_box}>{children}</div>
    </main>
  )
}
