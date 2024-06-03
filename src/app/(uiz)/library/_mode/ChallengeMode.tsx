'use client'

import { useState } from 'react'
import { useAchieveLevelBooks } from '@/client/store/achieve/level-books/selector'
import { useAchieveLevelPoint } from '@/client/store/achieve/level-point/selector'
import { useLibraryEbPbFilter } from '@/client/store/library/filter/selector'
import {
  useFetchLibraryHomeBooks,
  useFetchLibraryHomeChangeBookType,
  useFetchLibraryHomeChangeBookTypeAndLevel,
  useFetchLibraryHomeChangeLevel,
} from '@/client/store/library/home/hook'
import { useLibraryHome } from '@/client/store/library/home/selector'
import { useLibraryTodo } from '@/client/store/library/todos/selector'
import { useFetchReadingkingPrize } from '@/client/store/readingking/info/hook'
import { useReadingkingInfo } from '@/client/store/readingking/info/selector'
import PaginationBar from '@/ui/common/PaginationBar'
import TabNavBar from '@/ui/common/TabNavBar'
import { AlertBar } from '@/ui/common/common-components'
import { StudyHomeBookList } from '@/ui/modules/library-explore-book-list/StudyHomeBookList'
import { ChallengeBoard } from '@/ui/modules/library-explore-challenge-board/ChallengeBoard'
import LevelSelector from '@/ui/modules/library-explore-level-selector/level-selector'
import { LevelUpStatus } from '@/ui/modules/library-explore-level-up-status/level-up-status'
import LatestTodoListView from '@/ui/modules/library-explore-todo-list/LatestTodoListView'
import { LibraryFilterOption } from '@/ui/modules/library-set-fliter/LibrarySearchFilter'
import { SetStudyModeModal } from '../../_header/SetStudyMode'

export default function ChallengeMode() {
  const [viewLevelSelector, _viewLevelSelector] = useState(false)

  const readingkingInfo = useReadingkingInfo().user.payload
  const readingkingPrize = useReadingkingInfo().prizes.payload

  const { level, bookType: propBookType } = useLibraryHome()
  const bookType = propBookType === 'EB' ? 'EB' : 'PB'
  const { option: epbOption, payload: books } = useLibraryHome().EBPB
  const { fetch: updateBookList } = useFetchLibraryHomeBooks()
  const levelBooks = useAchieveLevelBooks().payload
  const levelPoints = useAchieveLevelPoint().payload

  let pointProgress = 0
  const currentLevelPoint = levelPoints.filter(
    (item) => item.levelName === level,
  )
  if (currentLevelPoint && currentLevelPoint.length === 1) {
    const point = currentLevelPoint[0]
    if (point.remainingRgPoint > 0) {
      pointProgress = Number(
        ((point.myRgPoint / point.requiredRgPoint) * 100).toFixed(2),
      )
    } else {
      pointProgress = 100
    }
  }

  const { payload: todos } = useLibraryTodo()

  const { fetch: updateBookType, loading: isUpdateBookTypeLoading } =
    useFetchLibraryHomeChangeBookType()
  const { fetch: updateBookLevel, loading: isUpdateBookLevelLoading } =
    useFetchLibraryHomeChangeLevel()
  const {
    fetch: updateBookTypeAndLevel,
    loading: isUpdateBookTypeAndLevelLoading,
  } = useFetchLibraryHomeChangeBookTypeAndLevel()
  const { fetch: updateReadingKingPrize } = useFetchReadingkingPrize()

  const navBookType = ['eBook', 'pBookQuiz']
  let selectedNavBookType = 0
  const uiBookTypeList: string[] = []
  if (bookType === 'EB') {
    uiBookTypeList.push('eBook')
    if (level !== 'KA' && level !== 'KB') {
      uiBookTypeList.push('pBookQuiz')
    }
  } else if (bookType === 'PB') {
    if (level !== '6C') {
      selectedNavBookType = 1
      uiBookTypeList.push('eBook')
    }
    uiBookTypeList.push('pBookQuiz')
  }
  const onSelectNavBookType = (index: number, label: string) => {
    if (label === 'eBook') {
      updateBookType({ bookType: 'EB' })
    } else if (label === 'pBookQuiz') {
      updateBookType({ bookType: 'PB' })
    }
  }

  let bookCount = 0
  let totalBookCount = 0
  if (!isUpdateBookTypeLoading) {
    if (bookType === 'EB') {
      const item = levelBooks.EB.filter((item) => item.levelName === level)
      if (item.length === 1) {
        bookCount = item[0].completedBooks
      }
    } else if (bookType === 'PB') {
      const item = levelBooks.PB.filter((item) => item.levelName === level)
      if (item.length === 1) {
        bookCount = item[0].completedBooks
      }
    }
    totalBookCount = books.page.totalRecords
  }
  const ebOption = useLibraryEbPbFilter('EB')
  const pbOption = useLibraryEbPbFilter('PB')
  const filter = bookType === 'EB' ? ebOption : pbOption

  const bookFilter = [
    {
      group: 'status',
      title: '학습 상태',
      option: [
        { id: 'All', label: '모든 학습', enabled: filter.status === 'All' },
        {
          id: 'Before',
          label: '미완료 학습',
          enabled: filter.status === 'Before',
        },
        {
          id: 'Complete',
          label: '완료한 학습',
          enabled: filter.status === 'Complete',
        },
      ],
    },
    // {
    //   group: 'd2',
    //   title: '부가 설정',
    //   option: [
    //     { id: '11', label: '설정 안함', enabled: false },
    //     { id: '21', label: '학습 1회차를 Full모드로 완료함', enabled: false },
    //     { id: '31', label: '학습 1회차를 Easy모드로 완료함', enabled: false },
    //   ],
    // },
    {
      group: 'sort',
      title: '정렬 방법',
      option: [
        { id: 'Round', label: '기본 정렬', enabled: filter.sort === 'Round' },
        {
          id: 'Preference',
          label: '선호도순',
          enabled: filter.sort === 'Preference',
        },
        {
          id: 'ReadCount',
          label: '인기순',
          enabled: filter.sort === 'ReadCount',
        },
        {
          id: 'RegistDate',
          label: '업데이트순',
          enabled: filter.sort === 'RegistDate',
        },
        {
          id: 'RgPoint',
          label: '포인트순',
          enabled: filter.sort === 'RgPoint',
        },
      ],
    },
    {
      group: 'genre',
      title: '장르별',
      option: [
        { id: 'All', label: '모든 장르', enabled: filter.genre === 'All' },
        {
          id: 'Fiction',
          label: 'Fiction',
          enabled: filter.genre === 'Fiction',
        },
        {
          id: 'Nonfiction',
          label: 'Non-Fiction',
          enabled: filter.genre === 'Nonfiction',
        },
      ],
    },
  ]

  const onFilterChanged = (filterOption: LibraryFilterOption[]) => {
    const findOptionId = (group: LibraryFilterOption) => {
      let value: string | undefined = undefined
      const option = group.option.filter((opt) => opt.enabled)
      if (option.length > 0) {
        value = option[0].id
      }
      return value
    }
    let sort: string | undefined = undefined
    let genre: string | undefined = undefined
    let status: string | undefined = undefined
    filterOption.forEach((group) => {
      if (group.group === 'status') {
        status = findOptionId(group)
      } else if (group.group === 'genre') {
        genre = findOptionId(group)
      } else if (group.group === 'sort') {
        sort = findOptionId(group)
      }
    })
    updateBookList({ page: 1, sort, genre, status })
  }

  const currentPage = books.page.page
  const maxPage = books.page.totalPages
  const onPageClick = (page: number) => {
    updateBookList({ page })
  }

  const levelList = levelBooks[bookType as 'EB' | 'PB'].map((lv) => {
    return lv.levelName
  })
  const onLevelChanged = (level: string) => {
    updateBookLevel({ level })
  }

  const onPrizeChange = (prizeId: string) => {
    updateReadingKingPrize({
      eventId: readingkingInfo.eventId,
      eventPrizeId: prizeId,
    })
  }

  const eventSymbolImage = '/src/images/@challenge-board/challenge_symbol.png'
  const eventDate = `${Number(readingkingInfo.startDate.substring(0, 4))}. ${Number(readingkingInfo.startDate.substring(4, 6))}. ${Number(readingkingInfo.endDate.substring(6, 8))} ~ ${Number(readingkingInfo.endDate.substring(0, 4))}. ${Number(readingkingInfo.endDate.substring(4, 6))}. ${Number(readingkingInfo.startDate.substring(6, 8))}`

  const [isShowStudyModal, setShowStudyModal] = useState(false)

  return (
    <>
      <AlertBar>
        영어독서왕에 도전해 보세요! 나의 목표를 설정하고 대회 기간 안에 목표를
        달성하세요! (하루 최대 얻을 수 있는 포인트는 150P입니다.)
      </AlertBar>
      <ChallengeBoard
        challengeTitle={readingkingInfo.eventTitle}
        symbolImgSrc={eventSymbolImage}
        challengePeriod={eventDate}
        prize={readingkingInfo.eventPrizeId}
        prizeList={readingkingPrize}
        targetDate={readingkingInfo.totalDays}
        date={Math.min(
          readingkingInfo.totalDays - readingkingInfo.remainingDays,
          readingkingInfo.totalDays,
        )}
        targetDay={readingkingInfo.aimDays}
        userDay={readingkingInfo.totalReadingDays}
        targetPoint={readingkingInfo.aimPoint}
        userPoint={readingkingInfo.totalPoint}
        onPrizeChange={onPrizeChange}
      />
      {todos.count > 0 && (
        <LatestTodoListView todos={todos} isLabelRgPoint={true} />
      )}
      {viewLevelSelector && (
        <LevelSelector
          _viewLevelSelector={_viewLevelSelector}
          bookType={bookType}
          isChangeBookType={true}
          level={level}
          ebLevelList={levelBooks.EB}
          pbLevelList={levelBooks.PB}
          onLevelClick={(params) => {
            if (bookType !== params.bookType) {
              updateBookTypeAndLevel({
                bookType: params.bookType,
                level: params.level,
              })
            } else if (level !== params.level) {
              updateBookLevel({ level: params.level })
            }
            _viewLevelSelector(false)
          }}
        />
      )}
      <LevelUpStatus
        studyLevel={level}
        progress={`${pointProgress}%`}
        onClick={() => _viewLevelSelector(true)}
        onClickStudyMode={() => setShowStudyModal(true)}
      />
      <TabNavBar
        items={uiBookTypeList.map((name, i) => {
          return {
            label: name,
            active: i === selectedNavBookType,
          }
        })}
        onItemClick={onSelectNavBookType}
      />
      <StudyHomeBookList
        books={books}
        completeCount={bookCount}
        totalCount={totalBookCount}
        filterOption={bookFilter}
        onChangeFilterOption={onFilterChanged}
        isLabelRgPoint={true}
      />
      <PaginationBar
        page={currentPage}
        maxPage={maxPage}
        onPageClick={onPageClick}
      />
      {isShowStudyModal && (
        <SetStudyModeModal onCloseClick={() => setShowStudyModal(false)} />
      )}
    </>
  )
}
