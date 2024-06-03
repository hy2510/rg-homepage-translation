'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { BackLink, Margin, Nav, NavItem } from '@/ui/common/common-components'
import { useStyle } from '@/ui/context/StyleContext'

const STYLE_ID = 'page_rg_news'

export default function Layout({ children }: { children?: ReactNode }) {
  const style = useStyle(STYLE_ID)

  const pathname = usePathname()
  const connectNotice = pathname.indexOf('notice') != -1
  const connectNewsletter = pathname.indexOf('newsletter') != -1
  const connectNewContents = pathname.indexOf('new-contents') != -1
  const connectInfographic = pathname.indexOf('infographic') != -1
  const connectChallenge = pathname.indexOf('challenge') != -1
  const connectSuperstar = pathname.indexOf('superstar') != -1
  const connectCampaign = pathname.indexOf('campaign') != -1

  return (
    <main className="container compact">
      <BackLink href="/home/main" largeFont colorWhite>
        RG 소식
      </BackLink>
      <Margin height={30} />
      <div className={style.rg_news}>
        <Nav>
          <Link href="notice">
            <NavItem active={connectNotice}>공지</NavItem>
          </Link>
          <Link href="newsletter">
            <NavItem active={connectNewsletter}>뉴스레터</NavItem>
          </Link>
          <Link href="new-contents">
            <NavItem active={connectNewContents}>신규콘텐츠</NavItem>
          </Link>
          <Link href="infographic">
            <NavItem active={connectInfographic}>인포그래픽</NavItem>
          </Link>
          <Link href="challenge">
            <NavItem active={connectChallenge}>영어독서왕</NavItem>
          </Link>
          <Link href="superstar">
            <NavItem active={connectSuperstar}>슈퍼스타</NavItem>
          </Link>
          <Link href="campaign">
            <NavItem active={connectCampaign}>기부캠페인</NavItem>
          </Link>
        </Nav>
        {children}
      </div>
    </main>
  )
}
