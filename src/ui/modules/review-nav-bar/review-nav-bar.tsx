'use client'

import SITE_PATH from '@/app/site-path'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Nav, NavItem } from '@/ui/common/common-components'
import { useStyle } from '@/ui/context/StyleContext'

const STYLE_ID = 'review_nav_bar'

// ReviewNavBar : 간편보기, 상세보기 네브바
export function ReviewNavBar() {
  const style = useStyle(STYLE_ID)

  const pathname = usePathname()
  const connectQuickView = pathname.indexOf('quick-view') != -1
  const connectDetailedView = pathname.indexOf('detailed-view') != -1

  return (
    <div className={style.review_nav_bar}>
      <div className={style.txt_h}>학습 결과</div>
      <Nav>
        <Link href={SITE_PATH.REVIEW.SIMPLE}>
          <NavItem active={!connectDetailedView}>간편보기</NavItem>
        </Link>
        <Link href={SITE_PATH.REVIEW.DETAIL}>
          <NavItem active={connectDetailedView}>상세보기</NavItem>
        </Link>
      </Nav>
    </div>
  )
}
