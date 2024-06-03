'use client'

import SITE_PATH from '@/app/site-path'
import { useState } from 'react'
import { useAchieveLevelBooks } from '@/client/store/achieve/level-books/selector'
import { useLibraryEbPbFilter } from '@/client/store/library/filter/selector'
import { useLibraryHome } from '@/client/store/library/home/selector'
import {
  useFetchLibraryLevel,
  useOnLoadLibraryLevel,
} from '@/client/store/library/level/hook'
import { useLibraryLevel } from '@/client/store/library/level/selector'
import { useSelectStudyLevel } from '@/client/store/student/daily-learning/selector'
import {
  useStudentHistory,
  useStudentHistoryAction,
} from '@/client/store/student/history/selector'
import PaginationBar from '@/ui/common/PaginationBar'
import { BackLink } from '@/ui/common/common-components'
import { useStyle } from '@/ui/context/StyleContext'
import LoadingScreen from '@/ui/modules/LoadingScreen'
import { BookCover } from '@/ui/modules/library-book-cover/book-cover'
import LevelSelector from '@/ui/modules/library-explore-level-selector/level-selector'
import { BookList } from '@/ui/modules/library-find-book-list/book-list'
import StudyLevelBox from '@/ui/modules/library-find-study-level-selector/StudyLevelBox'
import StudyLevelTitle from '@/ui/modules/library-find-study-level-selector/StudyLevelTitle'
import LibrarySearchFilter, {
  LibraryFilterOption,
} from '@/ui/modules/library-set-fliter/LibrarySearchFilter'
import StudentHistorySelectModal from '../_cpnt/StudentHistorySelectModal'
import {
  useSearchExportMode,
  useSupportSearchExportMode,
} from '../_fn/use-search-export-mode'

const STYLE_ID = 'page_e_book'

export default function Page() {
  const home = useLibraryHome()
  const settingLevel = useSelectStudyLevel()

  let levelFinder = undefined
  if (home.level && home.level !== 'PK' && home.level !== '6C') {
    levelFinder = home.level
  } else if (home.level === '6C') {
    levelFinder = '6B'
  }
  if (!levelFinder && settingLevel) {
    if (settingLevel !== 'PK' && settingLevel !== '6C') {
      levelFinder = settingLevel
    } else if (settingLevel === '6C') {
      levelFinder = '6B'
    }
  }

  const level = levelFinder || 'KA'
  const bookType = 'EB'
  const { sort, status, genre } = useLibraryEbPbFilter('EB')

  const { loading } = useOnLoadLibraryLevel({
    level,
    bookType,
    sort,
    genre,
    status,
  })
  if (loading) {
    return <LoadingScreen />
  }
  return <EBookLayout />
}

function EBookLayout() {
  const style = useStyle(STYLE_ID)

  const [viewLevelSelector, _viewLevelSelector] = useState(false)

  const levelBooks = useAchieveLevelBooks().payload.EB

  const { option, payload: books } = useLibraryLevel()
  const filter = useLibraryEbPbFilter('EB')
  const studyLevel = option.level

  const { fetch: updateBook } = useFetchLibraryLevel()

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
    onResetSelectedExportItem()
    setExportMode(false)
    updateBook({ page: 1, sort, genre, status })
  }

  const onChangeLevel = (level: string) => {
    onResetSelectedExportItem()
    setExportMode(false)
    updateBook({ level })
  }

  const currentPage = books.page.page
  const maxPage = books.page.totalPages
  const totalCount = books.page.totalRecords
  const onPageClick = (page: number) => {
    updateBook({ page: page })
  }

  const studentHistoryAction = useStudentHistoryAction()
  const studentHistoryList = useStudentHistory().payload.map((history) => ({
    studentHistoryId: history.studentHistoryId,
    classId: history.classId,
    className: history.className,
  }))
  const studentHistoryId = useStudentHistory().defaultHistoryId
  const onSelectStudentHistoryId = (studentHistoryId: string) => {
    studentHistoryAction.setDefaultHistoryId(studentHistoryId)
  }

  const [bookInfo, setBookInfo] = useState<string | undefined>(undefined)

  const [isExportMode, setExportMode] = useState(false)
  const {
    selectedExportItem,
    isSelectableStudentHistoryId,
    onExportClick,
    onResetSelectedExportItem,
    onExportCheckedChange,
    onDismissSelectableHistoryId,
    onExportSelectStudentHistoryId,
  } = useSearchExportMode({ studentHistoryList, studentHistoryId })
  const supportExportmode = useSupportSearchExportMode()

  return (
    <main className={style.ebook}>
      <BackLink href={SITE_PATH.LIBRARY.HOME} largeFont>
        eBook
      </BackLink>
      <StudyLevelBox>
        <StudyLevelTitle
          level={studyLevel}
          onClick={() => {
            _viewLevelSelector(true)
          }}
        />
        <LibrarySearchFilter
          optionList={bookFilter}
          onOptionChange={onFilterChanged}
        />
        {viewLevelSelector && (
          <LevelSelector
            _viewLevelSelector={_viewLevelSelector}
            bookType={'EB'}
            level={studyLevel}
            ebLevelList={levelBooks}
            onLevelClick={({ level }) => {
              onChangeLevel(level)
              _viewLevelSelector(false)
            }}
          />
        )}
      </StudyLevelBox>
      <BookList
        count={totalCount}
        isExportMode={isExportMode}
        toggleExportMode={() => {
          if (isExportMode) {
            onResetSelectedExportItem()
          }
          setExportMode(!isExportMode)
        }}
        supportExportMode={supportExportmode}
        exportCount={selectedExportItem.size}
        onExportClick={onExportClick}>
        {books.book.map((book, i) => {
          const isLabelRgPoint = false
          // const earnPoint = isLabelRgPoint ? book.bookPoint : undefined
          // const bookCode = isLabelRgPoint ? undefined : book.levelName
          const earnPoint = book.bookPoint
          const bookCode = book.levelName

          const isExportChecked =
            isExportMode && selectedExportItem.has(book.levelRoundId)

          return (
            <BookCover
              key={`book-cover-${i}-${book.surfaceImagePath}`}
              target={`library`}
              bookImgSrc={book.surfaceImagePath}
              bookCode={bookCode}
              earnPoint={earnPoint}
              title={book.topicTitle}
              author={book.author}
              isBookInfo={bookInfo === book.levelRoundId}
              passedCount={book.rgPointCount}
              isMovieBook={!!book.animationPath}
              isAssignedTodo={!book.addYn}
              onClickBookDetail={() => {
                setBookInfo(bookInfo ? undefined : book.levelRoundId)
              }}
              levelRoundId={book.levelRoundId}
              studentHistoryId={studentHistoryId}
              studentHistoryList={studentHistoryList}
              onSelectStudentHistoryId={onSelectStudentHistoryId}
              isExportMode={isExportMode}
              isExportChecked={isExportChecked}
              onExportCheckedChange={onExportCheckedChange}
            />
          )
        })}
      </BookList>
      <PaginationBar
        page={currentPage}
        maxPage={maxPage}
        onPageClick={onPageClick}
      />
      {isSelectableStudentHistoryId && (
        <StudentHistorySelectModal
          studentHistoryList={studentHistoryList}
          defaultStudentHistoryId={studentHistoryId}
          onCloseModal={onDismissSelectableHistoryId}
          onSelectStudentHistoryId={onExportSelectStudentHistoryId}
        />
      )}
    </main>
  )
}
