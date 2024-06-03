'use client'

import SITE_PATH from '@/app/site-path'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { useStyle } from '@/ui/context/StyleContext'
import {
  NavBar,
  NavItem,
} from '@/ui/modules/home-rg-membership-components/nav-bar'

const STYLE_ID = 'page_rg_membership'

export default function Layout({ children }: { children?: ReactNode }) {
  const style = useStyle(STYLE_ID)

  const pathname = usePathname()

  return (
    <main className={`${style.rg_membership} container`}>
      <NavBar>
        <NavItem
          active={pathname.indexOf(SITE_PATH.HOME.MEMBERSHIP_INTRODUCE) != -1}
          href={SITE_PATH.HOME.MEMBERSHIP_INTRODUCE}>
          멤버십 소개
        </NavItem>
        {/* <NavItem active={false}>멤버십 구매</NavItem> */}
        <NavItem
          active={
            pathname.indexOf(SITE_PATH.HOME.MEMBERSHIP_REFUND_POLICY) != -1
          }
          href={SITE_PATH.HOME.MEMBERSHIP_REFUND_POLICY}>
          환불 규정
        </NavItem>
        <NavItem
          active={
            pathname.indexOf(SITE_PATH.HOME.MEMBERSHIP_SERVICE_TERM) != -1
          }
          href={SITE_PATH.HOME.MEMBERSHIP_SERVICE_TERM}>
          이용 약관
        </NavItem>
        <NavItem
          active={
            pathname.indexOf(SITE_PATH.HOME.MEMBERSHIP_PRIVACY_POLICY) != -1
          }
          href={SITE_PATH.HOME.MEMBERSHIP_PRIVACY_POLICY}>
          개인정보 처리방침
        </NavItem>
      </NavBar>
      <div className={style.contents_box}>{children}</div>
    </main>
  )
}
