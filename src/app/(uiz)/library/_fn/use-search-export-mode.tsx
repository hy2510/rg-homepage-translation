import { useState } from 'react'
import {
  useFetchExportBookListUrl,
  useFetchExportVocabularyUrl,
} from '@/client/store/library/export/hook'
import {
  useFetchLibraryAddFavroite,
  useFetchLibraryFavorite,
} from '@/client/store/library/favorites/hook'
import { useUpdateBookListTodo } from '@/client/store/library/hook'
import {
  useFetchLibraryAddTodo,
  useFetchLibraryTodos,
} from '@/client/store/library/todos/hook'

export type ExportMode = 'todo' | 'favorite' | 'vocabulary' | 'list'

export function useSearchExportMode({
  studentHistoryList,
  studentHistoryId,
}: {
  studentHistoryList: unknown[]
  studentHistoryId: string
}) {
  const [selectedExportItem, setSelectedExportItem] = useState<
    Map<string, { isAddable: boolean; levelRoundId: string; studyId?: string }>
  >(new Map())
  const onExportCheckedChange = (
    item: {
      levelRoundId: string
      isAddable: boolean
    },
    isChecked: boolean,
  ) => {
    const newMap = new Map(selectedExportItem)
    if (isChecked) {
      newMap.set(item.levelRoundId, { ...item })
    } else {
      newMap.delete(item.levelRoundId)
    }
    setSelectedExportItem(newMap)
  }
  const { fetch: todoListReload } = useFetchLibraryTodos()
  const { fetch: favoriteReload } = useFetchLibraryFavorite()

  const [selectExportMode, setSelectExportMode] = useState('')
  const [selectLevelRoundIds, setSelectLevelRoundIds] = useState<string[]>([])

  const updateBookList = useUpdateBookListTodo()
  const { fetch: addTodo } = useFetchLibraryAddTodo()
  const { fetch: addFavorite } = useFetchLibraryAddFavroite()
  const { fetch: exportBookList } = useFetchExportBookListUrl()
  const { fetch: exportVocabulary } = useFetchExportVocabularyUrl()

  const onAddTodos = (levelRoundIds: string[], studentHistoryId: string) => {
    addTodo({
      levelRoundIds,
      studentHistoryId,
      callback: ({ success, error }) => {
        if (success) {
          todoListReload({ isReload: true })
          updateBookList(levelRoundIds, true)
          setSelectLevelRoundIds([])
          alert('Todo에 추가되었습니다.')
        } else if (error) {
          if ((error as any).message) {
            alert((error as any).message)
          } else {
            alert('Todo에 추가할 수 없습니다.')
          }
        }
      },
    })
  }

  const onAddFavorites = (levelRoundIds: string[]) => {
    addFavorite({
      levelRoundIds,
      callback: ({ success, error }) => {
        if (success) {
          favoriteReload({ status: 'All' })
          alert('Favorite에 추가되었습니다.')
        } else if (error) {
          if ((error as any).message) {
            alert((error as any).message)
          } else {
            alert('Favorite에 추가할 수 없습니다.')
          }
        }
      },
    })
  }

  const onExportVocabularys = (
    levelRoundIds: string[],
    studentHistoryId: string,
  ) => {
    exportVocabulary({
      levelRoundIds,
      studentHistoryId,
      callback: ({ success, payload, error }) => {
        if (success) {
          window.open(payload, '_blank', 'noopener, noreferrer')
        }
      },
    })
  }

  const onExportBookLists = (levelRoundIds: string[]) => {
    exportBookList({
      levelRoundIds,
      callback: ({ success, payload, error }) => {
        if (success) {
          window.open(payload, '_blank', 'noopener, noreferrer')
        }
      },
    })
  }

  const onExportClick = (mode: string) => {
    if (mode === 'todo') {
      const levelRoundIds: string[] = []
      selectedExportItem.forEach((item) => {
        if (item.isAddable) {
          levelRoundIds.push(item.levelRoundId)
        }
      })
      if (levelRoundIds.length > 0) {
        if (studentHistoryList.length > 1) {
          setSelectExportMode(mode)
          setSelectLevelRoundIds(levelRoundIds)
        } else {
          onAddTodos(levelRoundIds, studentHistoryId)
        }
      }
    } else if (mode === 'favorite') {
      const levelRoundIds: string[] = []
      selectedExportItem.forEach((item) => {
        levelRoundIds.push(item.levelRoundId)
      })
      onAddFavorites(levelRoundIds)
    } else if (mode === 'list') {
      const levelRoundIds: string[] = []
      selectedExportItem.forEach((item) => {
        levelRoundIds.push(item.levelRoundId)
      })
      onExportBookLists(levelRoundIds)
    } else if (mode === 'vocabulary') {
      const levelRoundIds: string[] = []
      selectedExportItem.forEach((item) => {
        levelRoundIds.push(item.levelRoundId)
      })
      if (levelRoundIds.length > 0) {
        if (studentHistoryList.length > 1) {
          setSelectExportMode(mode)
          setSelectLevelRoundIds(levelRoundIds)
        } else {
          onExportVocabularys(levelRoundIds, studentHistoryId)
        }
      }
    }
  }

  const onExportSelectStudentHistoryId = (studentHistoryId: string) => {
    if (selectExportMode === 'todo') {
      onAddTodos(selectLevelRoundIds, studentHistoryId)
    } else if (selectExportMode === 'vocabulary') {
      onExportVocabularys(selectLevelRoundIds, studentHistoryId)
    }
    setSelectLevelRoundIds([])
  }

  return {
    isSelectableStudentHistoryId: selectLevelRoundIds.length > 0,
    selectedExportItem,
    onResetSelectedExportItem: () => {
      setSelectedExportItem(new Map())
    },
    onDismissSelectableHistoryId: () => setSelectLevelRoundIds([]),
    onExportClick,
    onExportCheckedChange,
    onExportSelectStudentHistoryId,
  }
}

export function useSupportSearchExportMode(): ExportMode[] {
  return ['vocabulary', 'list', 'favorite', 'todo']
}

export function useSupportTodoExportMode(): ExportMode[] {
  return ['vocabulary', 'list']
}

export function useSupportFavoriteExportMode(): ExportMode[] {
  return ['vocabulary', 'list']
}
