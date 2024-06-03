'use client'

import Image from 'next/image'
import { ReactNode } from 'react'
import {
  useFetchReadkingkingRanking,
  useOnLoadReadkingkingRanking,
} from '@/client/store/ranking/readingking/hook'
import { useReadingkingRanking } from '@/client/store/ranking/readingking/selector'
import { useReadingkingEvent } from '@/client/store/readingking/event/selector'
import { useStudentAvatar } from '@/client/store/student/avatar/selector'
import { Dropdown, DropdownItem } from '@/ui/common/common-components'
import { useStyle } from '@/ui/context/StyleContext'
import LoadingScreen from '@/ui/modules/LoadingScreen'

const STYLE_ID = 'page_challenge_rank'

export default function Page() {
  const { loading } = useOnLoadReadkingkingRanking()

  if (loading) {
    return <LoadingScreen />
  }
  return (
    <main>
      <ChallengeRank />
    </main>
  )
}

function ChallengeRank() {
  const style = useStyle(STYLE_ID)

  const eventList = useReadingkingEvent().payload
  const rank = useReadingkingRanking().payload

  const rankList = rank.list
  const rankUser = rank.user

  const { fetch } = useFetchReadkingkingRanking()

  const onEventChange = (eventId: string) => {
    fetch({ eventId })
  }

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
    userAvatar = '',
    userRank = 0,
    studentName = '',
    completed = 0,
    earnPoints = 0,
    studyDay = 0,
    wordCount = 0,
  }: {
    userAvatar: string
    userRank: number
    studentName?: string
    completed?: number
    earnPoints?: number
    studyDay?: number
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
          {0 < userRank && userRank < 1000 && (
            <div className={style.user_rank}>
              <div className={style.txt_rank}>{userRank}</div>
            </div>
          )}
          <div className={style.user_avatar}>
            <Image alt="" src={userAvatar} width={100} height={100} />
          </div>
        </div>
        <ColumnBox label={'학생 이름'} contents={studentName} />
        <ColumnBox label={'학습 참여일 수'} contents={`${studyDay}`} />
        <ColumnBox label={'획득한 포인트'} contents={`${earnPoints}`} />
        <ColumnBox label={'학습 권수'} contents={`${completed}`} />
        {/* <ColumnBox label={'시상 목표'} contents={`2222`} />
        <ColumnBox label={'목표 달성율'} contents={`3333`} /> */}
      </div>
    )
  }

  const Leaderboard = () => {
    const TableRow = ({
      rank = 0,
      studentAvatar,
      studentName,
      studyDay,
      earnPoints,
      completed,
      present,
    }: {
      rank?: number
      studentAvatar?: string
      studentName?: string
      studyDay?: number
      earnPoints?: number
      completed?: number
      present?: number
    }) => {
      return (
        <div
          className={`
          ${style.table_row} 
          ${rank >= 1 && rank < 4 ? style.top_ranker : ''}`}>
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
          <div className={style.txt_present}>{studyDay}</div>
          <div className={style.txt_earn_points}>
            {earnPoints} / {completed}
          </div>
        </div>
      )
    }

    return (
      <div className={style.leaderboard}>
        <div className={style.table_header}>
          <div className={style.th_item}>순위</div>
          <div className={style.th_item}>학생 이름</div>
          <div className={style.th_item}>학습 참여일 수</div>
          <div className={style.th_item}>획득한 포인트 / 학습 권수</div>{' '}
        </div>
        {rankList.map((a) => {
          return (
            <TableRow
              key={`Rank_${a.num}_${a.studentId}`}
              rank={a.num}
              studentAvatar={a.imgAvatarRankingList}
              studyDay={a.studyDay}
              studentName={a.studentName}
              earnPoints={a.rgPoint}
              completed={a.bookCount}
              present={0}
            />
          )
        })}
      </div>
    )
  }

  const eventTitle =
    eventList && eventList.length > 0 ? eventList[0].eventTitle : ''

  const avatar = useStudentAvatar().payload
  const filteredAvatar = avatar.avatars.filter(
    (item) => item.avatarId === avatar.avatarId,
  )
  const avatarImage =
    filteredAvatar.length > 0
      ? filteredAvatar[0].imgRankingList1
      : 'https://wcfresource.a1edu.com/newsystem/image/character/maincharacter/dodo_03.png'

  return (
    <main className={style.challenge_rank}>
      <Dropdown title={eventTitle}>
        {eventList.map((evt, i) => {
          return (
            <DropdownItem
              key={`a_${evt.eventId}_${i}`}
              onClick={() => {
                onEventChange(evt.eventId)
              }}>
              {evt.eventTitle}
            </DropdownItem>
          )
        })}
      </Dropdown>

      {rankUser && (
        <>
          <SubTitle>나의 참여현황</SubTitle>
          <UserEngagementStatus
            userAvatar={rankUser.imgAvatarRankingList || avatarImage}
            userRank={rankUser.totalRank}
            studentName={rankUser.studentName}
            earnPoints={rankUser.rgPoint}
            completed={rankUser.bookCount}
            studyDay={rankUser.studyDay}
            wordCount={0}
          />
        </>
      )}
      <SubTitle
        message={
          false ? '마지막 업데이트  : 2023.05.23 화요일 오전 12:04' : ''
        }>
        리더보드
      </SubTitle>
      <Leaderboard />
    </main>
  )
}
