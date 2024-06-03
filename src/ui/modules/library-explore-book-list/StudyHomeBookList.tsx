import { useState } from 'react'
import {
  useStudentHistory,
  useStudentHistoryAction,
} from '@/client/store/student/history/selector'
import { SearchLevelBookResponse } from '@/repository/client/library/search/search-level'
import { BookCover } from '../library-book-cover/book-cover'
import { LibraryFilterOption } from '../library-set-fliter/LibrarySearchFilter'
import { BookList } from './book-list'

// 학습메인 > 사용자의 학습레벨의 도서 리스트
export function StudyHomeBookList({
  completeCount = 0,
  totalCount = 0,
  books,
  isLabelRgPoint,
  filterOption,
  bookType,
  onChangeFilterOption,
}: {
  completeCount?: number
  totalCount?: number
  books: SearchLevelBookResponse
  isLabelRgPoint?: boolean
  filterOption: LibraryFilterOption[]
  bookType?: string
  onChangeFilterOption?: (filterOption: LibraryFilterOption[]) => void
}) {
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

  return (
    <>
      <BookList
        value={completeCount}
        max={totalCount}
        title={'학습 도서 목록'}
        alertMessage={
          bookType === 'EB' ? '마음에 드는 책을 골라 읽고 학습해 보세요!' : 'pBook은 퀴즈만 제공해요. 종이책을 먼저 읽고 학습하세요!'
        }
        filterOption={filterOption}
        onChangeFilterOption={onChangeFilterOption}
        bookCount={books.page.totalRecords}>
        {books.book.map((book, i) => {
          // const earnPoint = isLabelRgPoint ? book.bookPoint : undefined
          // const bookCode = isLabelRgPoint ? undefined : book.levelName
          const earnPoint = book.bookPoint
          const bookCode = book.levelName
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
            />
          )
        })}
      </BookList>
    </>
  )
}
