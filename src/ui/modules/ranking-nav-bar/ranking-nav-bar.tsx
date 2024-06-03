'use client'

import SITE_PATH from '@/app/site-path'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Nav, NavItem } from '@/ui/common/common-components'
import { useStyle } from '@/ui/context/StyleContext'

const STYLE_ID = 'ranking_nav_bar'

export const RankingNavBar = () => {
  const style = useStyle(STYLE_ID)

  const pathname = usePathname()
  const connectPointsRank = pathname.indexOf('points-rank') != -1
  const connectChallengeRank = pathname.indexOf('challenge-rank') != -1
  const connectHallOfFameRank = pathname.indexOf('hall-of-fame-rank') != -1
  const connectLevelMasterBoard = pathname.indexOf('level-master-board') != -1

  return (
    <div className={style.ranking_nav_bar}>
      <div className={style.txt_h}>학생 랭킹</div>
      <Nav>
        <Link href={SITE_PATH.RANKING.POINT}>
          <NavItem active={connectPointsRank}>다독(포인트)</NavItem>
        </Link>
        <Link href={SITE_PATH.RANKING.CAHLLENGE}>
          <NavItem active={connectChallengeRank}>영어독서왕</NavItem>
        </Link>
        {/* <Link href="/ranking/hall-of-fame-rank">
          <NavItem active={connectHallOfFameRank}>명예의전당</NavItem>
        </Link> */}
      </Nav>
    </div>
  )
}
