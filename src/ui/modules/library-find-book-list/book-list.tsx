'use client'

import { ExportMode } from '@/app/(uiz)/library/_fn/use-search-export-mode'
import { ReactNode, useState } from 'react'
import { Dropdown } from '@/ui/common/common-components'
import { useStyle } from '@/ui/context/StyleContext'
import {
  ExportItem,
  ExportModePanel,
} from '../library-export-mode-panel/export-mode-panel'

const STYLE_ID = 'library_find_book_list'

// 학습메인 > 사용자의 학습레벨의 도서 리스트
export function BookList({
  count,
  children,
  supportExportMode,
  isExportMode,
  exportCount,
  onExportClick,
  toggleExportMode,
}: {
  count?: number
  children?: ReactNode
  supportExportMode?: ExportMode[]
  isExportMode?: boolean
  exportCount?: number
  onExportClick?: (mode: string) => void
  toggleExportMode?: () => void
}) {
  const style = useStyle(STYLE_ID)

  const activeExportMode: { name: ExportMode; label: string }[] = []
  supportExportMode?.forEach((mode) => {
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
      <div className="flex dir-col gap-m">
        <div className={style.book_counter}>
          <div className={style.book_counter_container}>
            <Dropdown title={`총 ${count}권`}>
              {/* 
               * FIXME : 다운로드 기능 구현 전까지 숨김 처리 (2024. 04. 15)
              <DropdownItem>목록 다운로드</DropdownItem> */}
            </Dropdown>
          </div>
          <div
            className={style.edit}
            onClick={() => {
              toggleExportMode && toggleExportMode()
            }}>
            {isExportMode ? '작업 취소' : '내보내기'}
          </div>
        </div>
        <div className={style.book_list}>
          <div className={style.row_b}>{children}</div>
        </div>
      </div>
      {isExportMode && (
        <ExportModePanel
          count={exportCount}
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
    </>
  )
}
