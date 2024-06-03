'use client'

import SITE_PATH from '@/app/site-path'
import { useState } from 'react'
import {
  useFetchLibrarySeries,
  useOnLoadLibrarySeries,
} from '@/client/store/library/series/hook'
import { useLibrarySeries } from '@/client/store/library/series/selector'
import {
  useStudentHistory,
  useStudentHistoryAction,
} from '@/client/store/student/history/selector'
import PaginationBar from '@/ui/common/PaginationBar'
import { BackLink } from '@/ui/common/common-components'
import { useStyle } from '@/ui/context/StyleContext'
import LoadingScreen from '@/ui/modules/LoadingScreen'
import { BookCover } from '@/ui/modules/library-book-cover/book-cover'
import { BookList } from '@/ui/modules/library-find-book-list/book-list'
import { LibraryFindTop } from '@/ui/modules/library-find-top/library-find-top'
import StudentHistorySelectModal from '../_cpnt/StudentHistorySelectModal'
import {
  useSearchExportMode,
  useSupportSearchExportMode,
} from '../_fn/use-search-export-mode'

const STYLE_ID = 'page_series'

export default function Page() {
  const { option } = useLibrarySeries()
  const { loading, error } = useOnLoadLibrarySeries()

  if (!option || !option.title) {
    return <div>Not found series.</div>
  }
  if (loading) {
    return <LoadingScreen />
  }
  return <SeriesLayout />
}

function SeriesLayout() {
  const style = useStyle(STYLE_ID)

  const { option, payload: books } = useLibrarySeries()

  const { fetch } = useFetchLibrarySeries()

  const onChangePage = (delta: number) => {
    const page = books.page.page + delta
    fetch({ page })
  }

  const currentPage = books.page.page
  const maxPage = books.page.totalPages
  const recordSize = books.page.totalRecords
  const onPageClick = (page: number) => {
    fetch({ page: page })
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
    <main className={style.series}>
      <BackLink href={SITE_PATH.LIBRARY.HOME} largeFont>
        시리즈
      </BackLink>
      <LibraryFindTop title={option.title} />
      <BookList
        count={recordSize}
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
          const earnPoint = isLabelRgPoint ? book.bookPoint : undefined
          const bookCode = isLabelRgPoint ? undefined : book.levelName

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
