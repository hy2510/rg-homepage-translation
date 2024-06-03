import { goToStudy } from '@/app/_function/study-start'
import { useState } from 'react'
import { useFetchBookInfoDetail } from '@/client/store/bookinfo/detail/hook'
import { useFetchLibraryAddTodo } from '@/client/store/library/todos/hook'
import { useStudentHistory } from '@/client/store/student/history/selector'

export default function useQuickStudyStart() {
  const studentHistory = useStudentHistory()
  const studentHistoryList = studentHistory.payload.map((history) => ({
    studentHistoryId: history.studentHistoryId,
    classId: history.classId,
    className: history.className,
  }))
  const studentHistoryId = studentHistory.defaultHistoryId
  const [selectLevelRoundId, setSelectLevelRoundId] = useState<
    string | undefined
  >(undefined)

  const { fetch: fetchBookInfo, loading: isBookInfoLoading } =
    useFetchBookInfoDetail()
  const { fetch: addTodo, loading: isAddTodoLoading } = useFetchLibraryAddTodo()

  const onStartStudy = (levelRoundId: string) => {
    fetchBookInfo({
      levelRoundId,
      studentHistoryId,
      callback: ({ success, error, payload }) => {
        if (success) {
          if (payload?.studyId) {
            goToStudy({
              studyInfo: payload!!,
            })
          } else {
            if (studentHistoryList.length === 1) {
              onStartActivity(levelRoundId, studentHistoryId)
            } else {
              setSelectLevelRoundId(levelRoundId)
            }
          }
        }
      },
    })
  }

  const onSelectStudentHistoryId = (studentHistoryId: string) => {
    if (selectLevelRoundId) {
      onStartActivity(selectLevelRoundId, studentHistoryId)
    }
  }

  const onStartActivity = (levelRoundId: string, studentHistoryId: string) => {
    const levelRoundIds = [levelRoundId]
    addTodo({
      levelRoundIds,
      studentHistoryId,
      callback: ({ success, error }) => {
        if (success && !error) {
          fetchBookInfo({
            levelRoundId,
            studentHistoryId,
            callback: ({ success, error, payload }) => {
              if (success && !error) {
                goToStudy({
                  studyInfo: payload!!,
                })
              }
            },
          })
        }
      },
    })
  }

  return {
    studentHistoryId,
    studentHistoryList,
    selectLevelRoundId,
    setSelectLevelRoundId,
    startStudyIfAvail: onStartStudy,
    startStudyImmediate: onSelectStudentHistoryId,
  }
}
