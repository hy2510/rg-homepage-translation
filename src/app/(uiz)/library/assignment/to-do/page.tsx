'use client'

import { useState } from 'react'
import {
  useFetchLibraryDeleteTodo,
  useFetchLibraryTodos,
} from '@/client/store/library/todos/hook'
import { useLibraryTodo } from '@/client/store/library/todos/selector'
import { useStudentHistory } from '@/client/store/student/history/selector'
import PaginationBar from '@/ui/common/PaginationBar'
import {
  AlertBar,
  Dropdown,
  DropdownItem,
  EmptyMessage,
} from '@/ui/common/common-components'
import { useStyle } from '@/ui/context/StyleContext'
import { BookCover } from '@/ui/modules/library-book-cover/book-cover'
import {
  ExportItem,
  ExportModePanel,
} from '@/ui/modules/library-export-mode-panel/export-mode-panel'
import StudentHistorySelectModal from '../../_cpnt/StudentHistorySelectModal'
import {
  ExportMode,
  useSearchExportMode,
  useSupportTodoExportMode,
} from '../../_fn/use-search-export-mode'
import AssignmentNavBar from '../_component/AssignmentNavBar'

const STYLE_ID = 'page_to_do'

const PAGE_PER_RECORD = 12
export default function Page() {
  const style = useStyle(STYLE_ID)

  const SORT_OPTIONS = [
    {
      id: 'RegistDate',
      label: '최신순',
    },
    {
      id: 'RegistDateASC',
      label: '오래된순',
    },
    {
      id: 'OngoingStudy',
      label: '학습중 우선',
    },
    {
      id: 'BeforeStudy',
      label: '학습전 우선',
    },
  ]

  const { fetch, loading } = useFetchLibraryTodos()
  const { option, payload: todos } = useLibraryTodo()

  const onChangeSort = (sort: string) => {
    setCurrentPage(1)
    setExportMode(false)
    onResetSelectedExportItem()
    setDeleteMode(false)
    setSelectedDeleteItem(new Set())
    fetch({ sortOption: sort })
  }

  const [currentPage, setCurrentPage] = useState<number>(1)
  const maxPage = Math.ceil(todos.count / PAGE_PER_RECORD)
  const onPageClick = (page: number) => {
    setCurrentPage(page)
  }
  const startIdx = PAGE_PER_RECORD * (currentPage - 1)
  const endIdx = PAGE_PER_RECORD * currentPage
  const todoItems = loading
    ? []
    : todos.todo.filter((_, idx) => {
        return startIdx <= idx && idx < endIdx
      })

  const findSortOption = SORT_OPTIONS.filter(
    (item) => option.sortOption === item.id,
  )
  const currentSortOption =
    !findSortOption || findSortOption.length === 0
      ? SORT_OPTIONS[0]
      : findSortOption[0]

  const [bookInfo, setBookInfo] = useState<string | undefined>(undefined)

  const studentHistoryList = useStudentHistory().payload.map((history) => ({
    studentHistoryId: history.studentHistoryId,
    classId: history.classId,
    className: history.className,
  }))
  const studentHistoryId = useStudentHistory().defaultHistoryId

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
  const supportExportmode = useSupportTodoExportMode()

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

  const [isDeleteMode, setDeleteMode] = useState(false)
  const [selectedDeleteItem, setSelectedDeleteItem] = useState<Set<string>>(
    new Set(),
  )
  const onDeleteCheckedChange = (
    item: {
      levelRoundId: string
      studyId?: string
      isAddable: boolean
    },
    isChecked: boolean,
  ) => {
    const targetStudyId = item.studyId
    if (targetStudyId) {
      const newSet = new Set(selectedDeleteItem)
      if (isChecked) {
        newSet.add(targetStudyId)
      } else {
        newSet.delete(targetStudyId)
      }
      setSelectedDeleteItem(newSet)
    }
  }

  const { fetch: deleteTodos } = useFetchLibraryDeleteTodo()
  const onSelectDeleteTodo = () => {
    if (selectedDeleteItem.size > 0) {
      const studyIds: string[] = []
      selectedDeleteItem.forEach((studyId) => {
        studyIds.push(studyId)
      })
      deleteTodos({
        studyIds,
        callback: ({ success, error }) => {
          if (success) {
            fetch({
              page: 1,
              sortOption: option.sortOption,
              isReload: true,
              callback: ({ success, error }) => {
                if (success) {
                  setSelectedDeleteItem(new Set())
                  setDeleteMode(false)
                  setCurrentPage(1)
                }
              },
            })
          } else if (error) {
            alert('과제를 삭제하는 중에 일시적인 오류가 발생하였습니다.')
          }
        },
      })
    }
  }

  return (
    <>
      <AssignmentNavBar active={'to-do'} />
      <main className={style.to_do}>
        <AlertBar>
          이곳에서 완료해야 할 학습(최대 200권)을 볼 수 있어요. 완료하지 않은
          학습은 추가된 날로부터 60일이 지나면 자동으로 삭제됩니다.
        </AlertBar>
        <div className={style.to_do_sort}>
          <div className={style.to_do_sort_container}>
            <Dropdown title={`총 ${todos.count}권`}>
              {/* 
              * FIXME : 다운로드 기능, 전체 삭제 구현 전까지 숨김 처리 (2024. 04. 15)
              <DropdownItem>목록 다운로드</DropdownItem>
              <DropdownItem>
                <span className="color-red">과제 전체삭제</span>
              </DropdownItem> */}
            </Dropdown>
            <Dropdown title={currentSortOption.label}>
              {SORT_OPTIONS.map((sort) => {
                return (
                  <DropdownItem
                    key={`todo-sort-${sort.id}`}
                    onClick={() => {
                      onChangeSort(sort.id)
                    }}>
                    {sort.label}
                  </DropdownItem>
                )
              })}
            </Dropdown>
          </div>
          {todos.count !== 0 && (
            <div className="flex gap-m">
              <div
                className={style.txt_l}
                onClick={() => {
                  if (isExportMode) {
                    onResetSelectedExportItem()
                    setExportMode(false)
                  } else {
                    setExportMode(true)
                  }
                }}>
                {isDeleteMode
                  ? undefined
                  : isExportMode
                    ? '작업 취소'
                    : '내보내기'}
              </div>
              <div
                className={style.txt_l}
                onClick={() => {
                  if (isDeleteMode) {
                    setSelectedDeleteItem(new Set())
                    setDeleteMode(false)
                  } else {
                    setDeleteMode(true)
                  }
                }}>
                {isExportMode ? undefined : isDeleteMode ? '삭제 취소' : '삭제'}
              </div>
            </div>
          )}
        </div>
        {todos.count !== 0 ? (
          <>
            <div className={style.to_do_list}>
              {todoItems.map((book, i) => {
                const isCheckMode = isExportMode || isDeleteMode
                const isChecked =
                  (isExportMode && selectedExportItem.has(book.levelRoundId)) ||
                  (isDeleteMode && selectedDeleteItem.has(book.studyId))
                const onCheckedChange = isExportMode
                  ? onExportCheckedChange
                  : onDeleteCheckedChange
                const isCheckable = !isDeleteMode || book.deleteYn
                return (
                  <BookCover
                    key={`book-cover-${i}-${book.surfaceImagePath}`}
                    target={`todo`}
                    bookImgSrc={book.surfaceImagePath}
                    bookCode={book.levelName}
                    title={book.title}
                    author={book.author}
                    isBookInfo={bookInfo === book.studyId}
                    isMovieBook={!!book.animationPath}
                    onClickBookDetail={() => {
                      setBookInfo(bookInfo ? undefined : book.studyId)
                    }}
                    levelRoundId={book.levelRoundId}
                    studyId={book.studyId}
                    studentHistoryId={book.studentHistoryId}
                    isExportMode={isCheckMode}
                    isExportChecked={isChecked}
                    isExportCheckable={isCheckable}
                    onExportCheckedChange={onCheckedChange}
                  />
                )
              })}
            </div>
            <PaginationBar
              page={currentPage}
              maxPage={maxPage}
              onPageClick={onPageClick}
            />
          </>
        ) : (
          <EmptyMessage>현재 완료해야 할 학습은 없어요.</EmptyMessage>
        )}

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
        {/* 일괄삭제 모드 실행시 */}
        {isDeleteMode && (
          <ExportModePanel
            count={selectedDeleteItem.size}
            buttonName="선택한 과제를 삭제하기"
            onExportClick={() => {
              onSelectDeleteTodo()
            }}></ExportModePanel>
        )}
      </main>
    </>
  )
}
