'use client'

import Image from 'next/image'
import { ReactNode, useState } from 'react'
import {
  useOnLoadPointRankingMonthly,
  useOnLoadPointRankingTotal,
} from '@/client/store/ranking/point/hook'
import { usePointRanking } from '@/client/store/ranking/point/selector'
import { Dropdown, DropdownItem, Modal } from '@/ui/common/common-components'
import { useScreenMode, useStyle } from '@/ui/context/StyleContext'
import LoadingScreen from '@/ui/modules/LoadingScreen'

const STYLE_ID = 'page_points_rank'

export default function Page() {
  const { loading } = useOnLoadPointRankingMonthly()
  const { loading: loading2 } = useOnLoadPointRankingTotal()

  if (loading || loading2) {
    return <LoadingScreen />
  }
  return (
    <main>
      <PointRank />
    </main>
  )
}

function PointRank() {
  const style = useStyle(STYLE_ID)

  const [tab, setTab] = useState('monthly')

  const monthRank = usePointRanking().monthly.payload
  const totalRank = usePointRanking().total.payload

  const rank = tab === 'monthly' ? monthRank : totalRank
  const rankList = rank.list
  const rankUser = rank.user

  const SubTitle = ({
    children,
    message,
  }: {
    children?: ReactNode
    message?: string
  }) => {
    return (
      <div className={style.sub_title}>
        {children}
        <span>{message}</span>
      </div>
    )
  }

  const UserEngagementStatus = ({
    userAvatar,
    userRank,
    studentName = '',
    completed = 0,
    earnPoints = 0.0,
    wordCount = 0,
  }: {
    userAvatar: string
    userRank: number
    studentName?: string
    completed?: number
    earnPoints?: number
    wordCount?: number
  }) => {
    const ColumnBox = ({
      label,
      contents,
    }: {
      label: string
      contents: string
    }) => {
      return (
        <div className={style.column_box}>
          <div className={style.label}>{label}</div>
          <div className={style.contents}>{contents}</div>
        </div>
      )
    }

    return (
      <div className={style.user_engagement_status}>
        <div className={style.user_symbol}>
          {userRank >= 1 && userRank < 1000 && (
            <div className={style.user_rank}>
              <div className={style.txt_rank}>{userRank}</div>
            </div>
          )}
          <div className={style.user_avatar}>
            <Image alt="" src={userAvatar} width={100} height={100} />
          </div>
        </div>
        <ColumnBox label={'학생 이름'} contents={studentName} />
        <ColumnBox label={'학습 권수'} contents={completed.toString()} />
        <ColumnBox label={'획득한 포인트'} contents={earnPoints.toString()} />
        <ColumnBox label={'학습한 단어수'} contents={wordCount.toString()} />
      </div>
    )
  }

  const Leaderboard = () => {
    const TableRow = ({
      rank,
      studentAvatar,
      studentName,
      earnPoints,
      completed,
    }: {
      rank?: number
      studentAvatar?: string
      studentName?: string
      earnPoints?: number
      completed?: number
    }) => {
      return (
        <div
          className={`
          ${style.table_row} 
          ${rank && rank < 4 ? style.top_ranker : ''}`}>
          <div
            className={`
            ${style.rank} 
            ${
              rank == 3
                ? style.rank3
                : rank == 2
                  ? style.rank2
                  : rank == 1
                    ? style.rank1
                    : ''
            }`}>
            {rank}
          </div>
          <div
            className={`${style.student_name} ${
              rank == 3
                ? style.rank3
                : rank == 2
                  ? style.rank2
                  : rank == 1
                    ? style.rank1
                    : ''
            }`}>
            <Image alt="" src={studentAvatar || ''} width={60} height={60} />
            <div className={style.txt_student_name}>{studentName}</div>
          </div>
          <div className={style.txt_earn_points}>{earnPoints}</div>
          <div className={style.txt_completed}>{completed}</div>
        </div>
      )
    }

    return (
      <div className={style.leaderboard}>
        <div className={style.table_header}>
          <div className={style.th_item}>순위</div>
          <div className={style.th_item}>학생 이름</div>
          <div className={style.th_item}>획득한 포인트</div>
          <div className={style.th_item}>학습 권수</div>
        </div>
        {rankList.map((a) => {
          return (
            <TableRow
              key={`Rank_${a.no}`}
              rank={a.no}
              studentAvatar={a.imgRankingList2}
              studentName={a.name}
              earnPoints={a.rgPoint}
              completed={a.bookCount}
            />
          )
        })}
      </div>
    )
  }

  const isMobile = useScreenMode() === 'mobile'
  const [viewModal, _viewModal] = useState(false)

  return (
    <main className={style.point_rank}>
      <Dropdown
        title={
          tab === 'monthly'
            ? `월간 랭킹 - ${new Date().getMonth() + 1}월`
            : `전체 랭킹`
        }>
        <DropdownItem onClick={() => setTab('monthly')}>월간 랭킹</DropdownItem>
        <DropdownItem onClick={() => setTab('total')}>전체 랭킹</DropdownItem>
      </Dropdown>

      {rankUser && (
        <>
          <SubTitle>나의 학습현황</SubTitle>
          <UserEngagementStatus
            userAvatar={rankUser.imgRankingList2}
            userRank={rankUser.no}
            studentName={rankUser.name}
            earnPoints={rankUser.bookCount}
            completed={rankUser.bookCount}
            wordCount={0}
          />
        </>
      )}
      <div className={style.group_sub_title}>
        <SubTitle
          message={
            false ? '마지막 업데이트  : 2023.05.23 화요일 오전 12:04' : ''
          }>
          리더보드
        </SubTitle>
        <div
          className={style.txt_link}
          onClick={() => {
            _viewModal(true)
          }}>
          포인트 안내
        </div>
        {viewModal && (
          <Modal
            compact
            header
            title={'포인트란?'}
            onClickDelete={() => {
              _viewModal(false)
            }}
            onClickLightbox={() => {
              _viewModal(false)
            }}>
            <iframe
              width={'100%'}
              frameBorder="0"
              scrolling="no"
              src={
                isMobile
                  ? '/src/html/page-contents/mobile/ranking/ranking_01_point_pop.html'
                  : '/src/html/page-contents/pc/ranking/ranking_01_point_pop.html'
              }
              style={{
                height: isMobile ? '1065px' : '867px',
                backgroundColor: 'transparent',
                overflow: 'hidden',
              }}
            />
          </Modal>
        )}
      </div>
      <Leaderboard />
    </main>
  )
}
