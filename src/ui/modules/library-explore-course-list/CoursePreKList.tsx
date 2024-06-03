import './course-list.scss'
import Image from 'next/image'
import { ReactNode } from 'react'
import { useScreenMode, useStyle } from '@/ui/context/StyleContext'
import { useStudentInfo } from '@/client/store/student/info/selector'

const STYLE_ID = 'course_list'

// 코스 리스트
export function CoursePreKList({
  passedNum,
  totalNum,
  children,
}: {
  passedNum: number
  totalNum: number
  children?: ReactNode
}) {
  const style = useStyle(STYLE_ID)

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
      <div className={style.course_list}>{children}</div>
    </>
  )
}

// 코스 아이템
export function CourseItem({
  imgSrc,
  title,
  bookCode,
  levelRoundId,
  passCount = 0,
  previousItemPass,
  onStartClick,
}: {
  imgSrc: string
  title: string
  bookCode: string
  levelRoundId: string
  passCount: number
  previousItemPass?: boolean
  onStartClick?: (levelRoundId: string) => void
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
        {student.studyEndDay > endDateLimit ?
          <div
            className={`${style.button} ${
              previousItemPass && !itemPass ? style.start : style.start_ready
            } ${itemPass && style.review}`}
            onClick={() => {
              onStartClick && onStartClick(levelRoundId)
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
            onStartClick && onStartClick(levelRoundId)
          }}>
          {itemPass ? '다시 보기' : '시작'}
        </div> */}
      </div>
    </div>
  )
}
