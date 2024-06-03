'use client'

import Image from 'next/image'
import { useStyle } from '@/ui/context/StyleContext'
import { BookInfoModal } from './BookInfoModal'

const STYLE_ID = 'book_cover'

export interface BookCoverProps {
  target?: string
  bookImgSrc: string
  bookCode?: string
  title: string
  author: string
  summary?: string
  assignDate?: string
  earnPoint?: number
  isAssignedTodo?: boolean
  passedCount?: number
  isMovieBook?: boolean
  id?: string
  // 신규추가 프롭
  isBookInfo?: boolean
  onClickBookDetail?: () => void
  levelRoundId: string
  studyId?: string
  studentHistoryId: string
  studentHistoryList?: any[]
  onSelectStudentHistoryId?: (studentHistoryId: string) => void
  isExportMode?: boolean
  exportModeKey?: string
  isExportCheckable?: boolean
  isExportChecked?: boolean
  onExportCheckedChange?: (
    item: { levelRoundId: string; isAddable: boolean; studyId?: string },
    isChecked: boolean,
  ) => void
}

// 도서 아이템
export function BookCover({
  target = 'library',
  bookImgSrc,
  bookCode,
  title,
  author,
  assignDate,
  earnPoint,
  isAssignedTodo = false,
  passedCount = 0,
  isMovieBook,
  isBookInfo,
  onClickBookDetail,
  levelRoundId,
  studyId,
  studentHistoryId,
  studentHistoryList,
  onSelectStudentHistoryId,
  isExportMode,
  isExportChecked,
  isExportCheckable = true,
  onExportCheckedChange,
}: BookCoverProps) {
  const style = useStyle(STYLE_ID)

  let passedIcon = ''
  let passedClassName = ''
  if (passedCount >= 2) {
    passedIcon = '/src/images/@book-cover/passed_all.svg'
    passedClassName = style.passed_all
  } else if (passedCount === 1) {
    passedIcon = '/src/images/@book-cover/passed_1.svg'
    passedClassName = style.passed_1
  }

  const onCheckedChange = () => {
    isExportCheckable &&
      onExportCheckedChange &&
      onExportCheckedChange(
        { levelRoundId, isAddable: !isAssignedTodo, studyId },
        !isExportChecked,
      )
  }

  // 임시 (In Progress, H/W부여 과제, H/W 시작 일자)
  const isInProgress = false;
  const isHomeWork = false;
  const startHomeWorkDate = null;

  return (
    <>
      <div className={style.book_cover}>
        <div className={style.container}>
          <div className={style.study_status}>
            {isAssignedTodo && (
              <div className={style.assigned_todo}>
                <Image
                  alt=""
                  src="/src/images/@book-cover/assigned_todo.svg"
                  width={34}
                  height={34}
                />
              </div>
            )}
            {passedIcon && (
              <div className={passedClassName}>
                <Image alt="" src={passedIcon} width={34} height={34} />
              </div>
            )}
            {isInProgress && (
              <div className={style.in_progress}>
                <Image
                  alt=""
                  src="/src/images/@book-cover/in_progress.svg"
                  width={34}
                  height={34}
                />
              </div>
            )}
            {isHomeWork && (
              <div className={style.home_work}>
                <Image
                  alt=""
                  src="/src/images/@book-cover/home_work.svg"
                  width={34}
                  height={34}
                />
              </div>
            )}
          </div>
          <div className={style.book_image}>
            {isExportMode ? (
              <div
                className={`${style.check_box} ${style.swirl_in_bck}`}
                onClick={onCheckedChange}>
                {isExportCheckable && (
                  <>
                    {isExportChecked ? (
                      <Image
                        alt={''}
                        src="/src/images/check-icons/check_box_on.svg"
                        width={24}
                        height={24}
                      />
                    ) : (
                      <Image
                        alt={''}
                        src="/src/images/check-icons/check_box_off.svg"
                        width={24}
                        height={24}
                      />
                    )}
                  </>
                )}
              </div>
            ) : undefined}
            {isMovieBook && (
              <div className={style.movie_icon}>
                <Image
                  alt=""
                  src="/src/images/@book-cover/movie_src.svg"
                  width={34}
                  height={34}
                />
              </div>
            )}
            <Image
              alt=""
              src={bookImgSrc}
              layout="intrinsic"
              width={200}
              height={290}
              className={style.book_image_src}
              onClick={() => {
                if (!isExportMode) {
                  onClickBookDetail && onClickBookDetail()
                } else {
                  onCheckedChange()
                }
              }}
            />
          </div>
          {bookCode && (
            <div className={style.tag}>
              <span>{bookCode} {earnPoint && <div className={style.line}></div>}<span className={style.point}>{earnPoint}{earnPoint && 'P'}</span></span>
            </div>
          )}
          {startHomeWorkDate ? (
            <div className={style.tag}>
              <span>({startHomeWorkDate})</span>
            </div>
          ) : (
            assignDate && 
            <div className={style.tag}>
              <span>+{assignDate}</span>
            </div>
          )}
          
          {/* {earnPoint && (
            <div className={`${style.tag} ${style.point}`}>
              <span>{earnPoint}P</span>
            </div>
          )} */}
        </div>
      </div>
      {isBookInfo && (
        <BookInfoModal
          key={studyId}
          target={target}
          bookImgSrc={bookImgSrc}
          title={title}
          author={author}
          onClickDelete={() => {
            onClickBookDetail && onClickBookDetail()
          }}
          levelRoundId={levelRoundId}
          studyId={studyId}
          studentHistoryId={studentHistoryId}
          studentHistoryList={studentHistoryList}
          onSelectStudentHistoryId={onSelectStudentHistoryId}
        />
      )}
    </>
  )
}
