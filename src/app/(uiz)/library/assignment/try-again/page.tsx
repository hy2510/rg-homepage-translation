'use client'

import { useState } from 'react'
import {
  useFetchLibraryTryAgain,
  useOnLoadLibraryTryAgain,
} from '@/client/store/library/try-again/hook'
import { useLibraryTryAgain } from '@/client/store/library/try-again/selector'
import {
  useStudentHistory,
  useStudentHistoryAction,
} from '@/client/store/student/history/selector'
import PaginationBar from '@/ui/common/PaginationBar'
import { AlertBar, Dropdown } from '@/ui/common/common-components'
import { useStyle } from '@/ui/context/StyleContext'
import LoadingScreen from '@/ui/modules/LoadingScreen'
import { BookCover } from '@/ui/modules/library-book-cover/book-cover'
import {
  ExportItem,
  ExportModePanel,
} from '@/ui/modules/library-export-mode-panel/export-mode-panel'
import StudentHistorySelectModal from '../../_cpnt/StudentHistorySelectModal'
import {
  ExportMode,
  useSearchExportMode,
  useSupportSearchExportMode,
} from '../../_fn/use-search-export-mode'
import AssignmentNavBar from '../_component/AssignmentNavBar'

const STYLE_ID = 'page_try_again'

export default function Page() {
  const { loading, error } = useOnLoadLibraryTryAgain()
  if (loading) {
    return <LoadingScreen />
  }
  return <TryAgain />
}

function TryAgain() {
  const style = useStyle(STYLE_ID)

  const { fetch } = useFetchLibraryTryAgain()
  const { option, payload: books } = useLibraryTryAgain()

  const currentPage = books.page.page
  const maxPage = books.page.totalPages
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

  const activeExportMode: { name: ExportMode; label: string }[] = []
  supportExportmode?.forEach((mode) => {
    switch (mode) {
      case 'vocabulary':
        activeExportMode.push({
          name: mode,
          label: 'Vocabulary',
        })
        break
      case 'list':
        activeExportMode.push({
          name: mode,
          label: 'Book List',
        })
        break
      case 'todo':
        activeExportMode.push({
          name: mode,
          label: 'To-Do',
        })
        break
      case 'favorite':
        activeExportMode.push({
          name: mode,
          label: 'Favorite',
        })
        break
    }
  })
  const [exportSelected, setExportSelected] = useState(
    activeExportMode.length > 0 && activeExportMode[0].name,
  )
  return (
    <>
      <AssignmentNavBar active={'try-again'} />
      <main className={style.try_again}>
        <AlertBar>
          이곳에서 학습을 완료했지만, 점수가 낮아 ‘통과하지 못한 도서’들을 볼 수
          있어요. (통과 점수 70점)
        </AlertBar>
        {false && (
          <>
            {/* Try-Again은 일괄작업 없어서 숨김처리함 */}
            <div>
              <Dropdown title={`총 ${books.page.totalRecords}권`}>
                {/* 
              * FIXME : 다운로드 기능, 전체 삭제 구현 전까지 숨김 처리 (2024. 04. 15)
              <DropdownItem>목록 다운로드</DropdownItem>
              <DropdownItem>
                <span className="color-red">과제 전체삭제</span>
              </DropdownItem> */}
              </Dropdown>
            </div>
            <div
              className={style.edit}
              onClick={() => {
                if (isExportMode) {
                  onResetSelectedExportItem()
                  setExportMode(false)
                } else {
                  setExportMode(true)
                }
              }}>
              {isExportMode ? '작업 취소' : '내보내기'}
            </div>
          </>
        )}
        <div className={style.try_again_list}>
          {books.book.map((book, i) => {
            const isExportChecked =
              isExportMode && selectedExportItem.has(book.levelRoundId)

            return (
              <BookCover
                key={`book-cover-${i}-${book.surfaceImagePath}`}
                target={`library`}
                bookImgSrc={book.surfaceImagePath}
                bookCode={book.levelName}
                earnPoint={undefined}
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
        </div>
        <PaginationBar
          page={currentPage}
          maxPage={maxPage}
          onPageClick={onPageClick}
        />
        {/* 내보내기 모드 실행시 */}
        {isExportMode && (
          <ExportModePanel
            count={selectedExportItem.size}
            onExportClick={() => {
              if (exportSelected) {
                onExportClick && onExportClick(exportSelected)
              }
            }}>
            {activeExportMode.map((mode) => {
              return (
                <ExportItem
                  key={mode.name}
                  active={exportSelected === mode.name}
                  onClick={() => {
                    if (exportSelected !== mode.name) {
                      setExportSelected(mode.name)
                    }
                  }}>
                  {mode.label}
                </ExportItem>
              )
            })}
          </ExportModePanel>
        )}
        {isSelectableStudentHistoryId && (
          <StudentHistorySelectModal
            studentHistoryList={studentHistoryList}
            defaultStudentHistoryId={studentHistoryId}
            onCloseModal={onDismissSelectableHistoryId}
            onSelectStudentHistoryId={onExportSelectStudentHistoryId}
          />
        )}
      </main>
    </>
  )
}
