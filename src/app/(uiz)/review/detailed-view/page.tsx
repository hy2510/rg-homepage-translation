'use client'

import { useMemo, useState } from 'react'
import { useFetchSpeakReport } from '@/client/store/history/speak/hook'
import { useHistorySpeak } from '@/client/store/history/speak/selector'
import {
  useFetchStudyReport,
  useOnLoadStudyReport,
} from '@/client/store/history/study/hook'
import { useHistoryStudy } from '@/client/store/history/study/selector'
import {
  Dropdown,
  DropdownItem,
  EmptyMessage,
  PillItem,
  Pills,
} from '@/ui/common/common-components'
import { useStyle } from '@/ui/context/StyleContext'
import LoadingScreen from '@/ui/modules/LoadingScreen'
import { ReviewAssessmentReport } from '@/ui/modules/review-assessment-report/ReviewAssessmentReport'
import {
  DetailedReportItem,
  DetailedReportsList,
  SpeakReportItem,
  SpeakReportsList,
  WritingReportItem,
  WritingReportsList,
} from '@/ui/modules/review-detail-view-reports/review-detail-view-reports'
import { ReportSearchBox } from '@/ui/modules/review-detail-view-search-box/review-detail-view-search-box'

const STYLE_ID = 'page_detailed_view'

export default function Page() {
  const { loading } = useOnLoadStudyReport()

  if (loading) {
    return <LoadingScreen />
  }
  return <HistoryLayout />
}

function HistoryLayout() {
  const style = useStyle(STYLE_ID)

  const option = useHistoryStudy().basic.option

  const { fetch: fetchReport } = useFetchStudyReport()
  const { fetch: fetchSpeaking } = useFetchSpeakReport()

  const [view, setView] = useState<'read' | 'speak' | 'write'>('read')
  const [startDate, setStartDate] = useState<{
    year: number
    month: number
    day: number
  }>({ ...option.startDate })
  const [endDate, setEndDate] = useState<{
    year: number
    month: number
    day: number
  }>({ ...option.endDate })
  const [keyword, setKeyword] = useState(option.keyword || '')

  const startDateText = `${startDate.year}-${
    startDate.month > 9 ? startDate.month : `0${startDate.month}`
  }-${startDate.day > 9 ? startDate.day : `0${startDate.day}`}`
  const endDateText = `${endDate.year}-${
    endDate.month > 9 ? endDate.month : `0${endDate.month}`
  }-${endDate.day > 9 ? endDate.day : `0${endDate.day}`}`

  const isHideKeyword = view === 'speak'

  return (
    <main className={style.detailed_view}>
      <ReportSearchBox
        startDate={startDateText}
        endDate={endDateText}
        isHideKeyword={isHideKeyword}
        keyword={isHideKeyword ? '' : keyword}
        onChangeStartDate={(date) => {
          const startDate = {
            year: Number(date.substring(0, 4)),
            month: Number(date.substring(5, 7)),
            day: Number(date.substring(8, 10)),
          }
          setStartDate(startDate)
        }}
        onChangeEndDate={(date) => {
          const endDate = {
            year: Number(date.substring(0, 4)),
            month: Number(date.substring(5, 7)),
            day: Number(date.substring(8, 10)),
          }
          setEndDate(endDate)
        }}
        onChangeKeyword={(text) => {
          setKeyword(text)
        }}
        onClickSearch={(startDt, endDt, text) => {
          const startDateSerial = {
            year: Number(startDt.substring(0, 4)),
            month: Number(startDt.substring(5, 7)),
            day: Number(startDt.substring(8, 10)),
          }
          const endDateSerial = {
            year: Number(endDt.substring(0, 4)),
            month: Number(endDt.substring(5, 7)),
            day: Number(endDt.substring(8, 10)),
          }
          const isReverseDate =
            Number(
              startDt.substring(0, 4) +
                startDt.substring(5, 7) +
                startDt.substring(8, 10),
            ) >
            Number(
              endDt.substring(0, 4) +
                endDt.substring(5, 7) +
                endDt.substring(8, 10),
            )
          const startDate = isReverseDate ? endDateSerial : startDateSerial
          const endDate = isReverseDate ? startDateSerial : endDateSerial

          const isChangeDate =
            startDate.year !== option.startDate.year ||
            startDate.month !== option.startDate.month ||
            startDate.day !== option.startDate.day ||
            endDate.year !== option.endDate.year ||
            endDate.month !== option.endDate.month ||
            endDate.day !== option.endDate.day
          const currentKeyword = option.keyword || ''
          if (isChangeDate || text !== currentKeyword) {
            if (view === 'read') {
              fetchReport({
                startDate,
                endDate,
                keyword: text,
                status: 'All',
              })
              setStartDate(startDate)
              setEndDate(endDate)
              setKeyword(text || '')
            } else if (view === 'write') {
              fetchReport({
                startDate,
                endDate,
                keyword: text,
                status: 'Writing',
              })
              setStartDate(startDate)
              setEndDate(endDate)
              setKeyword(text || '')
            } else if (view === 'speak') {
              if (isChangeDate) {
                fetchSpeaking({
                  startDate,
                  endDate,
                  status: 'All',
                  isSyncStudyDate: true,
                })
                setStartDate(startDate)
                setEndDate(endDate)
              }
            }
          }
        }}
      />
      <Dropdown
        title={
          view === 'read'
            ? 'My Read'
            : view === 'speak'
              ? 'My Speak'
              : 'Writing Activity'
        }>
        <DropdownItem
          onClick={() => {
            if (view !== 'read') {
              fetchReport({
                startDate: option.startDate,
                endDate: option.endDate,
                keyword: '',
                status: 'All',
              })
              setView('read')
              setStartDate(option.startDate)
              setEndDate(option.endDate)
              setKeyword('')
            }
          }}>
          My Read
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            if (view !== 'speak') {
              fetchSpeaking({
                startDate: option.startDate,
                endDate: option.endDate,
                status: 'All',
              })
              setView('speak')
              setStartDate(option.startDate)
              setEndDate(option.endDate)
            }
          }}>
          My Speak
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            if (view !== 'write') {
              fetchReport({
                startDate: option.startDate,
                endDate: option.endDate,
                keyword: '',
                status: 'Writing',
              })
              setView('write')
              setStartDate(option.startDate)
              setEndDate(option.endDate)
              setKeyword('')
            }
          }}>
          Writing Activity
        </DropdownItem>
      </Dropdown>
      {view === 'read' && <ReadList />}
      {view === 'speak' && <SpeakList />}
      {view === 'write' && <WriteList />}
    </main>
  )
}

function ReadList() {
  const [tab, setTab] = useState<'all' | 'passed' | 'failed'>('all')

  const history = useHistoryStudy().basic.payload

  const allCount = history.length
  const { passedCount, earnPoints } = useMemo(() => {
    let passedCount = 0
    let earnPoints = 0.0
    history.forEach((item) => {
      if (item.average >= 70) {
        passedCount++
        earnPoints += item.rgPoint
      }
    })
    return {
      passedCount,
      earnPoints: Math.round(earnPoints * 10) / 10,
    }
  }, [history])
  const failedCount = allCount - passedCount

  const list = history.filter((item) => {
    if (tab === 'passed') {
      return item.average >= 70
    } else if (tab === 'failed') {
      return item.average < 70
    } else {
      return true
    }
  })

  const [selectedBookInfo, setSelectBookInfo] = useState<string | undefined>(
    undefined,
  )

  return (
    <>
      <Pills>
        <PillItem
          active={tab === 'all'}
          onClick={() => {
            setTab('all')
          }}>
          All {allCount}권
        </PillItem>
        <PillItem
          active={tab === 'passed'}
          onClick={() => {
            setTab('passed')
          }}>
          Passed {passedCount}권 (+{earnPoints}P)
        </PillItem>
        <PillItem
          active={tab === 'failed'}
          onClick={() => {
            setTab('failed')
          }}>
          Failed {failedCount}권
        </PillItem>
      </Pills>
      {!list || list.length === 0 ? (
        <EmptyMessage>
          기간내 학습 기록을 찾아봤지만
          <br /> 표시할 내용이 없어요.
        </EmptyMessage>
      ) : (
        <DetailedReportsList>
          {list.map((a, i) => {
            return (
              <DetailedReportItem
                key={`history_${a.completeDate}_${a.bookId}_${i}`}
                title={a.title}
                bookCode={a.levelName}
                isPassed={a.average > 70}
                imgSrc={a.surfaceImagePath}
                studyDate={a.completeDate}
                totalScore={a.average}
                completedInfo={a.fullEasyName}
                earnPoints={a.rgPoint}
                onClick={() => {
                  setSelectBookInfo(a.studyId)
                }}>
                {selectedBookInfo && selectedBookInfo === a.studyId && (
                  <ReviewAssessmentReport
                    studyId={a.studyId}
                    studentHistoryId={a.studentHistoryId}
                    levelRoundId={a.levelRoundId}
                    title={a.title}
                    bookImgSrc={a.surfaceImagePath}
                    bookCode={a.levelName}
                    studyDate={a.completeDate}
                    totalScore={a.average}
                    isPassed={a.average > 70}
                    completedInfo={a.fullEasyName}
                    earnPoints={a.rgPoint}
                    onClickDelete={() => {
                      setSelectBookInfo(undefined)
                    }}
                  />
                )}
              </DetailedReportItem>
            )
          })}
        </DetailedReportsList>
      )}
      {/* <Pagination>
        <PaginationItem active={true}>1</PaginationItem>
      </Pagination> */}
    </>
  )
}

function WriteList() {
  const [tab, setTab] = useState<'all' | 'passed' | 'failed'>('all')

  const history = useHistoryStudy().basic.payload

  const allCount = history.length
  const { passedCount, earnPoints } = useMemo(() => {
    let passedCount = 0
    let earnPoints = 0.0
    history.forEach((item) => {
      if (item.average >= 70) {
        passedCount++
        earnPoints += item.rgPoint
      }
    })
    return {
      passedCount,
      earnPoints,
    }
  }, [history])
  const failedCount = allCount - passedCount

  const list = history.filter((item) => {
    if (tab === 'passed') {
      return item.average >= 70
    } else if (tab === 'failed') {
      return item.average < 70
    } else {
      return true
    }
  })

  return (
    <>
      <Pills>
        <PillItem
          active={tab === 'all'}
          onClick={() => {
            setTab('all')
          }}>
          All {allCount}권
        </PillItem>
        <PillItem
          active={tab === 'passed'}
          onClick={() => {
            setTab('passed')
          }}>
          Passed {passedCount}권
        </PillItem>
        <PillItem
          active={tab === 'failed'}
          onClick={() => {
            setTab('failed')
          }}>
          Failed {failedCount}권
        </PillItem>
      </Pills>
      <WritingReportsList>
        {list.map((a, i) => {
          let statusInfo = '-'
          if (a.revisionStatusCode === '028009') {
            statusInfo = 'Comp. R'
          } else if (a.revisionStatusCode === '028003') {
            statusInfo = 'On Revision'
          }
          return (
            <WritingReportItem
              key={`history_${a.completeDate}_${a.bookId}_${i}`}
              title={a.title}
              bookCode={a.levelName}
              isPassed={a.average > 70}
              imgSrc={a.surfaceImagePath}
              studyDate={a.completeDate}
              totalScore={a.average}
              completedInfo={statusInfo}
              writingScore={a.scoreStep5 ? a.scoreStep5.toString() : '-'}
            />
          )
        })}
      </WritingReportsList>
      {/* <Pagination>
        <PaginationItem active={true}>1</PaginationItem>
      </Pagination> */}
    </>
  )
}

function SpeakList() {
  const history = useHistorySpeak().payload

  const [tab, setTab] = useState<'all' | 'passed' | 'failed'>('all')
  const allCount = history.length
  const { passedCount, earnPoints } = useMemo(() => {
    let passedCount = 0
    let earnPoints = 0.0
    history.forEach((item) => {
      if (item.speakPassYn) {
        passedCount++
      }
    })
    return {
      passedCount,
      earnPoints,
    }
  }, [history])
  const failedCount = allCount - passedCount

  const list = history.filter((item) => {
    if (tab === 'passed') {
      return item.speakPassYn
    } else if (tab === 'failed') {
      return !item.speakPassYn
    } else {
      return true
    }
  })

  return (
    <>
      <Pills>
        <PillItem active={tab === 'all'} onClick={() => setTab('all')}>
          All {allCount}권
        </PillItem>
        <PillItem active={tab === 'passed'} onClick={() => setTab('passed')}>
          Passed {passedCount}권
        </PillItem>
        <PillItem active={tab === 'failed'} onClick={() => setTab('failed')}>
          Failed {failedCount}권
        </PillItem>
      </Pills>
      <SpeakReportsList>
        {list.map((a, i) => {
          return (
            <SpeakReportItem
              key={`speak-item-${a.levelName}-${i}`}
              imgSrc={a.surfaceImagePath}
              bookCode={a.levelName}
              title={a.title}
              studyDate={a.completeDate}
              totalScore={a.average}
              isPassed={a.speakPassYn}
              completedInfo={''}
              earnPoints={a.rgPoint}
            />
          )
        })}
      </SpeakReportsList>
      {/* <Pagination>
        <PaginationItem active={true}>1</PaginationItem>
      </Pagination> */}
    </>
  )
}
