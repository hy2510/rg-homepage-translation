'use client'

import SITE_PATH from '@/app/site-path'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { useStyle } from '@/ui/context/StyleContext'
import { AlertBar } from '@/ui/common/common-components'
import { useStudentInfo } from '@/client/store/student/info/selector'

const STYLE_ID = 'page_home'

export default function Layout({ children }: { children?: ReactNode }) {
  const style = useStyle(STYLE_ID)

  const pathname = usePathname()
  const connectMainRgNews = pathname.indexOf('/rg-news') != -1

  const HomeNavItem = ({
    name,
    href,
    target,
    active,
    onClick,
  }: {
    name: string
    href: string
    target?: string
    active?: boolean
    onClick?: () => void
  }) => {
    return (
      <Link href={href} target={target ? target : '_self'} onClick={onClick}>
        <div className={`${style.home_nav_item} ${active ? style.active : ''}`}>
          {name}
        </div>
      </Link>
    )
  }

  const HomeNavBar = () => {
    return (
      <div className={`${style.home_nav_bar}`}>
        <HomeNavItem
          name={'메인'}
          href={SITE_PATH.HOME.MAIN}
          active={pathname.indexOf(SITE_PATH.HOME.MAIN) !== -1}
        />
        {/* <HomeNavItem
          name={'명예의 전당'}
          href={'hall-of-fame'}
          active={connectHallOfFame}
        /> */}
        <HomeNavItem
          name={'활용수기'}
          href={SITE_PATH.HOME.CUSTOMER_INTERVIEW}
          active={pathname.indexOf('/customer-review') !== -1}
        />
        <HomeNavItem
          name={'RG 멤버십'}
          href={SITE_PATH.HOME.MEMBERSHIP_INTRODUCE}
          active={pathname.indexOf('/rg-membership') !== -1}
        />
        <HomeNavItem
          name={'고객센터'}
          href={
            'https://ossified-smell-f52.notion.site/RG-f84a3437f61748afb4f050afa39a480c'
          }
          active={false}
          target={'_blank'}
        />
      </div>
    )
  }

  const student = useStudentInfo().payload
  const endDateLimit = 0
  const endMessage = '학습 기간이 종료되었습니다.'

  return (
    <div className={style.home}>
      <div className='container' style={{paddingBottom: 0}}>
        {student.studyEndDay < 8 ? 
          student.studyEndDay <= 0 ? 
          <AlertBar>
            <div style={{width: '100%', display: 'flex', flexDirection: 'row', gap: '20px', color: 'red'}}>
              <div>{endMessage}</div>
              <div style={{cursor: 'pointer'}}><b>결제하기</b></div>
            </div>
          </AlertBar> :
          <AlertBar>
            <div style={{width: '100%', display: 'flex', flexDirection: 'row', gap: '20px', color: 'red'}}>
              <div>학습 기간이 {student.studyEndDay}일 남았습니다.</div>
              <div style={{cursor: 'pointer'}}><b>결제하기</b></div>
            </div>
          </AlertBar> :
          <></>
        }
      </div>
      {connectMainRgNews ? <></> : <HomeNavBar />}
      {children}
    </div>
  )
}
