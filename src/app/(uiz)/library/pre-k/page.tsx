'use client'

import { useCustomerInfo } from '@/app/_context/CustomerContext'
import SITE_PATH from '@/app/site-path'
import { useState } from 'react'
import { useLibraryPKFilter } from '@/client/store/library/filter/selector'
import {
  useFetchLibraryLevelPreK,
  useOnLoadLibraryLevelPreK,
} from '@/client/store/library/pre-k/hook'
import { useLibraryLevelPreK } from '@/client/store/library/pre-k/selector'
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
import StudyLevelBox from '@/ui/modules/library-find-study-level-selector/StudyLevelBox'
import StudyLevelDropDown, {
  DropDownOption,
} from '@/ui/modules/library-find-study-level-selector/StudyLevelDropDown'
import LibrarySearchFilter, {
  LibraryFilterOption,
} from '@/ui/modules/library-set-fliter/LibrarySearchFilter'
import StudentHistorySelectModal from '../_cpnt/StudentHistorySelectModal'
import {
  useSearchExportMode,
  useSupportSearchExportMode,
} from '../_fn/use-search-export-mode'

const STYLE_ID = 'page_pre_k'

export default function Page() {
  const customer = useCustomerInfo()

  if (customer.useDodoAbcYn === 'Y') {
    return <div>Not Support Pre K</div>
  }
  return <ValidatePreK />
}

function ValidatePreK() {
  const { loading } = useOnLoadLibraryLevelPreK({})
  if (loading) {
    return <LoadingScreen />
  }
  return <PreKLayout />
}

function PreKLayout() {
  const style = useStyle(STYLE_ID)

  const { option, payload: books } = useLibraryLevelPreK()
  const { activity } = useLibraryPKFilter()

  const { fetch: updateBook } = useFetchLibraryLevelPreK()

  const preKCategory: DropDownOption[] = [
    { key: 'All', label: '모든 단계' },
    { key: 'Alphabet', label: '알파벳' },
    { key: 'Phonics', label: '파닉스' },
    { key: 'Word', label: '단어' },
    { key: 'Story', label: '스토리' },
  ]
  let currentActivity = preKCategory[0]
  for (let i = 0; i < preKCategory.length; i++) {
    if (activity === preKCategory[i].key) {
      currentActivity = preKCategory[i]
      break
    }
  }

  const bookFilter = [
    {
      group: 'status',
      title: '학습 상태',
      option: [
        { id: 'All', label: '모든 학습', enabled: option.status === 'All' },
        {
          id: 'Before',
          label: '미완료 학습',
          enabled: option.status === 'Before',
        },
        {
          id: 'Complete',
          label: '완료한 학습',
          enabled: option.status === 'Complete',
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
    let status: string | undefined = undefined
    filterOption.forEach((group) => {
      if (group.group === 'status') {
        status = findOptionId(group)
      }
    })
    updateBook({ status })
  }

  const onChangeFilterActivity = (activity: string) => {
    updateBook({ activity })
  }

  const currentPage = books.page.page
  const maxPage = books.page.totalPages
  const onPageClick = (page: number) => {
    updateBook({ page })
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
    <main className={style.prek}>
      <BackLink href={SITE_PATH.LIBRARY.HOME} largeFont>
        PreK
      </BackLink>
      <StudyLevelBox>
        <StudyLevelDropDown
          currentItem={currentActivity}
          items={preKCategory}
          onItemClick={(key) => {
            onChangeFilterActivity(key)
          }}
        />
        <LibrarySearchFilter
          optionList={bookFilter}
          onOptionChange={onFilterChanged}
        />
      </StudyLevelBox>
      <BookList
        count={books.page.totalRecords}
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
        {books.book.map((a, i) => {
          const isLabelRgPoint = false
          // const earnPoint = isLabelRgPoint ? a.bookPoint : undefined
          // const bookCode = isLabelRgPoint ? undefined : a.levelName
          const earnPoint = a.bookPoint
          const bookCode = a.levelName

          const isExportChecked =
            isExportMode && selectedExportItem.has(a.levelRoundId)

          return (
            <BookCover
              key={`book-cover-${i}-${a.surfaceImagePath}`}
              target={`library`}
              bookImgSrc={a.surfaceImagePath}
              bookCode={bookCode}
              earnPoint={earnPoint}
              title={a.topicTitle}
              author={a.author}
              isBookInfo={bookInfo === a.levelRoundId}
              passedCount={a.rgPointCount}
              isAssignedTodo={!a.addYn}
              onClickBookDetail={() => {
                setBookInfo(bookInfo ? undefined : a.levelRoundId)
              }}
              levelRoundId={a.levelRoundId}
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

      {currentActivity.key === 'All' && (
        <PaginationBar
          page={currentPage}
          maxPage={maxPage}
          onPageClick={onPageClick}
        />
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
  )
}
