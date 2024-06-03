import './series-item-theme.scss'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'
import { AlertBar } from '@/ui/common/common-components'
import { useStyle } from '@/ui/context/StyleContext'

const STYLE_ID = 'series_list'
// 학습메인 > 사용자의 학습레벨의 시리즈 리스트
export function SeriesList({ children }: { children?: ReactNode }) {
  const style = useStyle(STYLE_ID)

  return (
    <div className={style.series_list}>
      <div className={style.txt_h}>이 레벨의 시리즈</div>
      <AlertBar>이 레벨과 연관된 학습 도서 시리즈를 찾아볼 수 있어요!</AlertBar>
      <div className={style.series_list_container}>{children}</div>
    </div>
  )
}

// 학습메인 > 사용자의 학습레벨의 시리즈 아이템
const SeriesThemes = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'dark_blue',
  'purple',
  'gray',
  'brown',
  'light_gray',
  'pink',
  'dark_green',
  'default',
] as const
type SeriesTheme = (typeof SeriesThemes)[number]
function getSeriesTheme(theme: string): SeriesTheme | undefined {
  return SeriesThemes.includes(theme as SeriesTheme)
    ? (theme as SeriesTheme)
    : undefined
}
export function SeriesItem({
  seriesImgSrc,
  seriesName,
  theme,
  onClick,
}: {
  seriesImgSrc: string
  seriesName: string
  theme: string
  onClick?: () => void
}) {
  const colors: SeriesTheme = getSeriesTheme(theme) || 'default'
  return (
    <Link
      href={'#'}
      onClick={(e) => {
        e.preventDefault()
        onClick && onClick()
      }}>
      <div className="series_item">
        <div className={`series_book ${colors}`}>
          <div className="books shadow_1"></div>
          <div className="books shadow_2"></div>
          <div className="books cover">
            <Image
              alt=""
              src={seriesImgSrc}
              layout="intrinsic"
              width={200}
              height={200}
              className="cover_image"
            />
            <div className="book_title">
              <div className="triangle_l"></div>
              <div className="triangle_r"></div>
              <div className="series_name">{seriesName}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
