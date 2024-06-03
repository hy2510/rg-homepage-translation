'use client'

import { useState } from 'react'
import {
  useFetchLibraryDeleteFavorite,
  useFetchLibraryFavorite,
  useOnLoadLibraryFavorite,
} from '@/client/store/library/favorites/hook'
import { useLibraryFavorite } from '@/client/store/library/favorites/selector'
import {
  useStudentHistory,
  useStudentHistoryAction,
} from '@/client/store/student/history/selector'
import PaginationBar from '@/ui/common/PaginationBar'
import { AlertBar, Dropdown, DropdownItem } from '@/ui/common/common-components'
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
  useSupportFavoriteExportMode,
} from '../../_fn/use-search-export-mode'
import AssignmentNavBar from '../_component/AssignmentNavBar'

const STYLE_ID = 'page_favorite'

export default function Page() {
  const { loading, error } = useOnLoadLibraryFavorite()
  if (loading) {
    return <LoadingScreen />
  }
  return <Favorite />
}

function Favorite() {
  const style = useStyle(STYLE_ID)

  const STATUS_OPTION = [
    {
      id: 'All',
      label: 'All',
    },
    {
      id: 'Complete',
      label: '완료된 학습',
    },
    {
      id: 'Before',
      label: '미완료 학습',
    },
  ]

  const { fetch } = useFetchLibraryFavorite()
  const { option, payload: books } = useLibraryFavorite()

  const onChangeStatus = (status: string) => {
    setExportMode(false)
    onResetSelectedExportItem()
    setDeleteMode(false)
    setSelectedDeleteItem(new Set())
    fetch({ status, page: 1 })
  }

  const currentPage = books.page.page
  const maxPage = books.page.totalPages
  const onPageClick = (page: number) => {
    fetch({ status: option.status, page: page })
  }

  const findStatusOption = STATUS_OPTION.filter(
    (item) => option.status === item.id,
  )
  const currentSortOption =
    !findStatusOption || findStatusOption.length === 0
      ? STATUS_OPTION[0]
      : findStatusOption[0]

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
  const supportExportmode = useSupportFavoriteExportMode()

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
      isAddable: boolean
    },
    isChecked: boolean,
  ) => {
    const newSet = new Set(selectedDeleteItem)
    if (isChecked) {
      newSet.add(item.levelRoundId)
    } else {
      newSet.delete(item.levelRoundId)
    }
    setSelectedDeleteItem(newSet)
  }

  const { fetch: deleteFavorites } = useFetchLibraryDeleteFavorite()
  const onSelectDeleteFavroite = () => {
    if (selectedDeleteItem.size > 0) {
      const levelRoundIds: string[] = []
      selectedDeleteItem.forEach((levelRoundId) => {
        levelRoundIds.push(levelRoundId)
      })
      deleteFavorites({
        levelRoundIds,
        callback: ({ success, error }) => {
          if (success) {
            fetch({
              status: option.status,
              page: 1,
              callback: ({ success, error }) => {
                if (success) {
                  setDeleteMode(false)
                  setSelectedDeleteItem(new Set())
                }
              },
            })
          } else if (error) {
            alert(
              '즐겨찾기 한 도서를 삭제하는 중에 일시적인 오류가 발생하였습니다.',
            )
          }
        },
      })
    }
  }

  return (
    <>
      <AssignmentNavBar active={'favorite'} />
      <main className={style.favorite}>
        <AlertBar>
          이곳에서 학습 정보창의 하트 버튼을 눌러 추가한 도서들을 볼 수 있어요.
        </AlertBar>
        <div className={style.favorite_sort}>
          <div className={style.favorite_sort_container}>
            <Dropdown title={`총 ${books.page.totalRecords}권`}>
              {/* 
              * FIXME : 다운로드 기능, 전체 삭제 구현 전까지 숨김 처리 (2024. 04. 15)
              <DropdownItem>목록 다운로드</DropdownItem>
              <DropdownItem>
                <span className="color-red">과제 전체삭제</span>
              </DropdownItem> */}
            </Dropdown>
            <Dropdown title={currentSortOption.label}>
              {STATUS_OPTION.map((opt) => {
                return (
                  <DropdownItem
                    key={`favorite-status-${opt.id}`}
                    onClick={() => {
                      onChangeStatus(opt.id)
                    }}>
                    {opt.label}
                  </DropdownItem>
                )
              })}
            </Dropdown>
          </div>
          {books.page.totalRecords > 0 && (
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
        <div className={style.favorite_list}>
          {books.book.map((book, i) => {
            const isCheckMode = isExportMode || isDeleteMode
            const isChecked =
              (isExportMode && selectedExportItem.has(book.levelRoundId)) ||
              (isDeleteMode && selectedDeleteItem.has(book.levelRoundId))
            const onCheckedChange = isExportMode
              ? onExportCheckedChange
              : onDeleteCheckedChange

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
                isExportMode={isCheckMode}
                isExportChecked={isChecked}
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
            buttonName="선택한 도서를 삭제하기"
            onExportClick={() => {
              onSelectDeleteFavroite()
            }}></ExportModePanel>
        )}
      </main>
    </>
  )
}
