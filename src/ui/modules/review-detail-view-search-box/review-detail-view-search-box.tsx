import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useStyle } from '@/ui/context/StyleContext'

const STYLE_ID = 'review_detail_view_search_box'

// 상세보기 리포트 검색박스
export const ReportSearchBox = ({
  startDate,
  endDate,
  isHideKeyword,
  keyword,
  onChangeStartDate,
  onChangeEndDate,
  onChangeKeyword,
  onClickSearch: onClick,
}: {
  startDate: string
  endDate: string
  isHideKeyword: boolean
  keyword?: string
  onChangeStartDate?: (date: string) => void
  onChangeEndDate?: (date: string) => void
  onChangeKeyword?: (keyword: string) => void
  onClickSearch?: (startDate: string, endDate: string, keyword?: string) => void
}) => {
  const style = useStyle(STYLE_ID)

  const [lKeyword, setlKeyword] = useState(keyword || '')
  const [lStartDate, setlStartDate] = useState(startDate)
  const [lEndDate, setlEndDate] = useState(endDate)

  useEffect(() => {
    setlKeyword(keyword || '')
  }, [keyword])

  useEffect(() => {
    setlStartDate(startDate)
  }, [startDate])

  useEffect(() => {
    setlEndDate(endDate)
  }, [endDate])

  return (
    <div className={style.report_search_box}>
      <div className={style.column1}>
        <div className={style.period}>
          <div className={style.start_date}>
            <input
              type="date"
              value={lStartDate}
              onChange={(e) => {
                const value = e.target.value
                setlStartDate(value)
                onChangeStartDate && onChangeStartDate(value)
              }}
            />
          </div>
          <div>~</div>
          <div className={style.end_date}>
            <input
              type="date"
              value={lEndDate}
              onChange={(e) => {
                const value = e.target.value
                setlEndDate(value)
                onChangeEndDate && onChangeEndDate(value)
              }}
            />
          </div>
        </div>

        {isHideKeyword ? (
          <></>
        ) : (
          <div className={style.search_bar}>
            <input
              type="text"
              placeholder="도서 또는 시리즈명"
              value={lKeyword}
              onChange={(e) => {
                const value = e.target.value
                setlKeyword(value)
                onChangeKeyword && onChangeKeyword(value)
              }}
            />
          </div>
        )}
      </div>
      <button
        onClick={() => {
          onClick && onClick(lStartDate, lEndDate, lKeyword)
        }}
        className={style.search_button}>
        <Image
          alt=""
          src="/src/images/search-icons/search_white.svg"
          width={20}
          height={20}
        />
        <span className={style.button_text}>검색하기</span>
      </button>
    </div>
  )
}
