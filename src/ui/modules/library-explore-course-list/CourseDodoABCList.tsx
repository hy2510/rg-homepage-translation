import './course-list.scss'
import Image from 'next/image'
import { ReactNode } from 'react'
import { Button } from '@/ui/common/common-components'
import { useScreenMode, useStyle } from '@/ui/context/StyleContext'
import { useStudentInfo } from '@/client/store/student/info/selector'

const STYLE_ID = 'course_list'

// 코스 리스트
export function CourseDodoABCList({
  passedNum,
  totalNum,
  children,
  introVideoSrc,
  outroVideoSrc,
  introBgUrl1,
  introBgUrl2,
  introBgUrl3,
  introBg,
  outroBg,
  outroBgUrl,
  courseBgUrl,
  introPosterSrc,
  outroPosterSrc,
}: {
  passedNum: number
  totalNum: number
  children?: ReactNode
  introVideoSrc?: string
  outroVideoSrc?: string
  introBgUrl1?: string
  introBgUrl2?: string
  introBgUrl3?: string
  introBg?: string
  outroBg?: string
  outroBgUrl?: string
  courseBgUrl?: string
  introPosterSrc?: string
  outroPosterSrc?: string
}) {
  const style = useStyle(STYLE_ID)

  const IntroVideoBox = () => {
    return (
      <div className={style.video_wraper}>
        <video controls poster={introPosterSrc}>
          <source src={introVideoSrc} type="video/mp4" />
        </video>
      </div>
    )
  }

  const OutroVidioBox = () => {
    return (
      <div className={style.video_wraper}>
        <video controls poster={outroPosterSrc}>
          <source src={outroVideoSrc} type="video/mp4" />
        </video>
      </div>
    )
  }

  return (
    <>
      <div className={style.row_a}>
        <div className={style.row_a_container}>
          <div className={style.txt_h}>완료한 학습</div>
          <div className={style.completed_status}>
            <div className={style.txt_l1}>{passedNum}</div>
            <div className={style.txt_l2}>/{totalNum}</div>
          </div>
        </div>
      </div>
      <div className={style.intro_movie}>
        <div className={`intro_bg ${introBg}`}></div>
        {introVideoSrc && <IntroVideoBox />}
      </div>
      <div className={style.course_list}>{children}</div>
      {outroVideoSrc && (
        <div className={style.outro_movie}>
          <OutroVidioBox />
          {/* <div style={{ position: 'relative', zIndex: 1 }}>
            <Button color={'gray'} width={'400'} shadow>
              Go to Next!
            </Button>
          </div> */}
          <div className={`outro_bg ${outroBg}`}></div>
        </div>
      )}
    </>
  )
}

// 코스 아이템
export function CourseItem({
  imgSrc,
  title,
  vocaSrc,
  passCount = 0,
  bookCode,
  previousItemPass,
  onStartClick,
}: {
  imgSrc: string
  title: string
  vocaSrc?: string
  passCount?: number
  bookCode: string
  previousItemPass?: boolean
  onStartClick?: (bookCode: string) => void
}) {
  const style = useStyle(STYLE_ID)

  const itemPass = passCount > 0

  const isMobile = useScreenMode() === 'mobile'

  const student = useStudentInfo().payload
  const endDateLimit = 0
  const endMessage = '학습 기간이 종료되었습니다.'

  return (
    <div className={style.course_item}>
      <div className={style.col_a}>
        <div className={style.check_study}>
          <div className={style.status}>
            <div
              className={`${style.streak_front} ${
                previousItemPass && style.prev_passed
              }`}></div>
            <Image
              alt=""
              src={
                itemPass
                  ? '/src/images/@course-list/study_passed.svg'
                  : '/src/images/@course-list/study_ready.svg'
              }
              width={50}
              height={50}
            />
            <div
              className={`${style.streak_back} ${
                itemPass && style.passed
              }`}></div>
          </div>
        </div>
        <div
          className={`${style.cover} ${
            previousItemPass && !itemPass ? style.heartbeat : ''
          }`}>
          <Image
            alt=""
            src={imgSrc}
            layout="intrinsic"
            width={100}
            height={170}
            className={`${
              previousItemPass && !itemPass ? style.done : style.ready
            } ${itemPass && style.done}`}
          />
        </div>
        {isMobile ? <></> : <div className={style.txt_h}>{title}</div>}
      </div>
      <div className={style.col_b}>
        <div
          className={`${style.button} ${
            previousItemPass && !itemPass
              ? style.voca_download
              : style.voca_download_ready
          }`}>
          <Image
            alt={''}
            src="/src/images/@course-list/download.svg"
            width={20}
            height={20}
          />
        </div>
        {student.studyEndDay > endDateLimit ?
          <div
            className={`${style.button} ${
              previousItemPass && !itemPass ? style.start : style.start_ready
            } ${itemPass && style.review}`}
            onClick={() => {
              onStartClick && onStartClick(bookCode)
            }}>
            {itemPass ? '다시 보기' : '시작'}
          </div>
          : <div
              className={`${style.button} ${
                previousItemPass && !itemPass ? style.start : style.start_ready
              } ${itemPass && style.review}`}
              onClick={() => {alert(endMessage)}}>
              <Image alt='' src='/src/images/lock-icons/lock_white.svg' width={24} height={24} />
            </div>
        }
        {/* <div
          className={`${style.button} ${
            previousItemPass && !itemPass ? style.start : style.start_ready
          } ${itemPass && style.review}`}
          onClick={() => {
            onStartClick && onStartClick(bookCode)
          }}>
          {itemPass ? '다시 보기' : '시작'}
        </div> */}
      </div>
    </div>
  )
}
