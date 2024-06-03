'use client'

import { goToStudy } from '@/app/_function/study-start'
import Image from 'next/image'
import { ReactNode, useState } from 'react'
import { useOnLoadBookInfoDetail } from '@/client/store/bookinfo/detail/hook'
import {
  useBookInfoDetail,
  useBookInfoDetailAction,
} from '@/client/store/bookinfo/detail/selector'
import {
  useFetchLibraryAddFavroite,
  useFetchLibraryDeleteFavorite,
} from '@/client/store/library/favorites/hook'
import {
  useLibraryFavorite,
  useLibraryFavoriteAction,
} from '@/client/store/library/favorites/selector'
import { AlertBox, Button, Modal } from '@/ui/common/common-components'
import { useScreenMode, useStyle } from '@/ui/context/StyleContext'
import { useStudentInfo } from '@/client/store/student/info/selector'

const STYLE_ID = 'review_assessment_report'

type StudyStart = 'study' | 'speak'
export const ReviewAssessmentReport = ({
  levelRoundId,
  studyId,
  studentHistoryId,
  onClickDelete,
  onClickLightbox,
  bookImgSrc,
  title,
  author,
  addedToDo = false,
  addedFavorite = false,
  bookCode,
  studyDate,
  totalScore,
  isPassed,
  completedInfo,
  earnPoints,
}: {
  levelRoundId: string
  studyId: string
  studentHistoryId: string
  onClickDelete?: () => void
  onClickLightbox?: () => void
  bookImgSrc: string
  title: string
  author?: string
  addedToDo?: boolean
  addedFavorite?: boolean
  bookCode: string
  studyDate: string
  totalScore: number
  isPassed: boolean
  completedInfo: string
  earnPoints: number
}) => {
  const style = useStyle(STYLE_ID)

  const { loading: isBookInfoInitLoading } = useOnLoadBookInfoDetail({
    levelRoundId,
    studyId,
    studentHistoryId,
  })
  const bookInfo = useBookInfoDetail().payload
  const bookInfoAction = useBookInfoDetailAction()

  const [confirmMessageType, setConfirmMessageType] = useState<
    'Favorite' | 'Todo' | undefined
  >(undefined)

  const {
    fetch: addFavorite,
    loading: isAddFavoriteLoading,
    success: isAddFavoriteSuccess,
  } = useFetchLibraryAddFavroite()
  const {
    fetch: deleteFavorite,
    loading: isDeleteFavoriteLoading,
    success: isDeleteFavoriteSuccess,
  } = useFetchLibraryDeleteFavorite()

  const favoriteChangeAction = bookInfoAction.setFavorite
  const favoriteCount = useLibraryFavorite().count
  const favoriteCountAction = useLibraryFavoriteAction().setFavoriteCount

  const onAddFavorite = () => {
    if (
      !isBookInfoInitLoading &&
      !isAddFavoriteLoading &&
      !isDeleteFavoriteLoading
    ) {
      const levelRoundIds = [levelRoundId]
      addFavorite({
        levelRoundIds,
        callback: ({ success, error }) => {
          if (success && !error) {
            favoriteChangeAction(true)
            favoriteCountAction(favoriteCount + 1)
          }
        },
      })
    }
  }
  const onDeleteFavorite = () => {
    if (
      !isBookInfoInitLoading &&
      !isAddFavoriteLoading &&
      !isDeleteFavoriteLoading
    ) {
      const levelRoundIds = [levelRoundId]
      deleteFavorite({
        levelRoundIds,
        callback: ({ success, error }) => {
          if (success && !error) {
            favoriteChangeAction(false)
            favoriteCountAction(favoriteCount - 1)
          }
        },
      })
    }
  }

  const onStartStudy = (study: StudyStart) => {
    goToStudy({
      studyInfo: bookInfo,
      mode: 'review',
      isStartSpeak: study === 'speak',
    })
  }

  const isWorksheetYn = !!bookInfo.workSheetPath
  const isVocabularyYn = !!bookInfo.vocabularyPath
  const isReportYn = !!bookInfo.reportPath

  const student = useStudentInfo().payload
  const endDateLimit = 0
  const endMessage = '학습 기간이 종료되었습니다.'

  return (
    <Modal
      onClickLightbox={() => {
        if (onClickLightbox) {
          onClickLightbox()
        } else if (onClickDelete) {
          onClickDelete()
        }
      }}
      bookInfoStyle>
      <div className={style.review_assessment_report}>
        <div
          className={style.col_a}
          style={{ backgroundImage: `url("${bookImgSrc}")` }}>
          <div className={style.col_a_container}>
            <AddAssignment>
              <AddFavorite
                isFavorite={bookInfo.bookMarkYn}
                isConfirmMessage={confirmMessageType === 'Favorite'}
                onClick={() => {
                  if (confirmMessageType !== 'Favorite') {
                    setConfirmMessageType('Favorite')
                  } else {
                    setConfirmMessageType(undefined)
                  }
                }}
                onAddFavorite={onAddFavorite}
                onDeleteFavorite={onDeleteFavorite}
              />
              {/* <AddTodo
                isTodo={true}
                isConfirmMessage={confirmMessageType === 'Todo'}
                onClick={() => {
                  if (confirmMessageType !== 'Todo') {
                    setConfirmMessageType('Todo')
                  } else {
                    setConfirmMessageType(undefined)
                  }
                }}
              /> */}
            </AddAssignment>
            <div className={style.book}>
              <div className={style.book_container}>
                <div className={style.book_image}>
                  <Image
                    alt=""
                    src={bookImgSrc}
                    layout="intrinsic"
                    width={200}
                    height={200}
                  />
                </div>
                <div className={style.txt_h}>{title}</div>
                <div className={style.txt_l}>{author}</div>
              </div>
              <div className={style.download}>
                {isVocabularyYn && (
                  <div
                    className={style.download_voca}
                    onClick={() => {
                      student.studyEndDay > endDateLimit ?
                      window?.open(bookInfo.vocabularyPath)
                      : alert(endMessage)
                    }}>
                    <span>단어장</span>
                    <Image
                      alt=""
                      src="/src/images/@book-info/download.svg"
                      width={14}
                      height={14}
                    />
                  </div>
                )}
                {isWorksheetYn && (
                  <div
                    className={style.download_worksheet}
                    onClick={() => {
                      student.studyEndDay > endDateLimit ?
                      window?.open(bookInfo.workSheetPath)
                      : alert(endMessage)
                    }}>
                    <span>워크시트</span>
                    <Image
                      alt=""
                      src="/src/images/@book-info/download.svg"
                      width={14}
                      height={14}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className={style.review}>
              {isReportYn && (
                <Button
                  width="100%"
                  color={'dark'}
                  onClick={() => {
                    window?.open(bookInfo.reportPath)
                  }}>
                  리포트 출력
                </Button>
              )}
              {
                student.studyEndDay > endDateLimit ?
                <Button
                  width="100%"
                  color={isPassed ? 'blue' : 'red'}
                  onClick={() => {
                    onStartStudy('study')
                  }}>
                  다시 보기
                </Button>
                : <Button
                    width="100%"
                    color={isPassed ? 'blue' : 'red'}
                    onClick={() => {
                      alert(endMessage)
                    }}>
                    <Image alt='' src="/src/images/lock-icons/lock_white.svg" width={24} height={24} />
                  </Button>
              }
              {/* <Button
                width="100%"
                color={isPassed ? 'blue' : 'red'}
                onClick={() => {
                  onStartStudy('study')
                }}>
                다시 보기
              </Button>
              <Button
                width="100%"
                color={isPassed ? 'blue' : 'red'}
                onClick={() => {
                  alert(endMessage)
                }}>
                <Image alt='' src="/src/images/lock-icons/lock_white.svg" width={24} height={24} />
              </Button> */}
            </div>
          </div>
          <div className={style.light_box}></div>
        </div>
        <div className={style.col_b}>
          <div className={style.col_b_header}>
            <div className={style.txt_h}>학습 리포트</div>
            <div
              className={style.delete_button}
              onClick={(e) => {
                e.stopPropagation()
                onClickDelete && onClickDelete()
              }}></div>
          </div>
          <div className={style.col_b_body}>
            <SubTitle>학습 정보</SubTitle>
            <StudyInfo
              bookCode={bookCode}
              studyDate={studyDate}
              totalScore={totalScore}
              isPassed={isPassed}
              completedInfo={completedInfo}
              earnPoints={earnPoints}
            />
            <SubTitle>Step별 점수</SubTitle>
            <StepInfo
              scoreStep1={
                !bookInfo.scoreStep1 || bookInfo.scoreStep1 < 0
                  ? '-'
                  : bookInfo.scoreStep1
              }
              scoreStep2={
                !bookInfo.scoreStep2 || bookInfo.scoreStep2 < 0
                  ? '-'
                  : bookInfo.scoreStep2
              }
              scoreStep3={
                !bookInfo.scoreStep3 || bookInfo.scoreStep3 < 0
                  ? '-'
                  : bookInfo.scoreStep3
              }
              scoreStep4={
                !bookInfo.scoreStep4 || bookInfo.scoreStep4 < 0
                  ? '-'
                  : bookInfo.scoreStep4
              }
              scoreStep5={
                !bookInfo.scoreStep5 || bookInfo.scoreStep5 < 0
                  ? '-'
                  : bookInfo.scoreStep5
              }
            />
            {/* {(bookInfo.speakPassYn || bookInfo.animationPath) && (
              <MoreActivities
                isSpeakPass={bookInfo.speakPassYn}
                animationPath={bookInfo.animationPath}
              />
            )} */}
            {bookInfo.speakPassYn && (
              <MoreActivities isSpeakPass={bookInfo.speakPassYn} />
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}

const SubTitle = ({ children }: { children?: ReactNode }) => {
  const style = useStyle(STYLE_ID)

  return <div className={style.sub_title}>{children}</div>
}

const AddAssignment = ({ children }: { children?: ReactNode }) => {
  const style = useStyle(STYLE_ID)

  return (
    <div className={style.add_assignment}>
      <div className={style.add_assignment_container}>{children}</div>
    </div>
  )
}

const AddFavorite = ({
  isFavorite,
  isConfirmMessage,
  onClick,
  onAddFavorite,
  onDeleteFavorite,
}: {
  isFavorite: boolean
  isConfirmMessage: boolean
  onClick?: () => void
  onAddFavorite?: () => void
  onDeleteFavorite?: () => void
}) => {
  const style = useStyle(STYLE_ID)
  const isMobile = useScreenMode() === 'mobile'
  return (
    <div className={style.add_favorite}>
      <div
        className={style.add_favorite_icon}
        onClick={() => {
          onClick && onClick()
        }}>
        {isFavorite ? (
          <Image
            alt=""
            src="/src/images/@book-info/add_favorite_on.svg"
            width={24}
            height={24}
          />
        ) : (
          <Image
            alt=""
            src="/src/images/@book-info/add_favorite_off.svg"
            width={24}
            height={24}
          />
        )}
      </div>
      {isConfirmMessage && (
        <div className={style.alert}>
          <AlertBox
            toolTipRight={!isMobile}
            toolTipLeft={isMobile}
            text={
              isFavorite
                ? 'Favorite에서 학습을 삭제할까요?'
                : 'Favorite에 학습을 추가할까요?'
            }
            onClickY={() => {
              if (isFavorite) {
                onDeleteFavorite && onDeleteFavorite()
              } else {
                onAddFavorite && onAddFavorite()
              }
              onClick && onClick()
            }}
            onClickN={() => {
              onClick && onClick()
            }}
          />
        </div>
      )}
    </div>
  )
}

const AddTodo = ({
  isTodo,
  isConfirmMessage,
  onClick,
  onAddTodo,
  onDeleteTodo,
}: {
  isTodo: boolean
  isConfirmMessage: boolean
  onClick?: () => void
  onAddTodo?: () => void
  onDeleteTodo?: () => void
}) => {
  const style = useStyle(STYLE_ID)
  const isMobile = useScreenMode() === 'mobile'
  return (
    <div className={style.add_todo}>
      <div
        className={style.add_todo_icon}
        onClick={() => {
          onClick && onClick()
        }}>
        {isTodo ? (
          <Image
            alt=""
            src="/src/images/@book-info/add_to_do_on.svg"
            width={24}
            height={24}
          />
        ) : (
          <Image
            alt=""
            src="/src/images/@book-info/add_to_do_off.svg"
            width={24}
            height={24}
          />
        )}
      </div>
      {isConfirmMessage && (
        <div className={style.alert}>
          <AlertBox
            toolTipRight={!isMobile}
            toolTipLeft={isMobile}
            text={
              isTodo
                ? 'To-Do에서 학습을 삭제할까요?'
                : 'To-Do에 학습을 추가할까요?'
            }
            onClickY={() => {
              if (isTodo) {
                onDeleteTodo && onDeleteTodo()
              } else {
                onAddTodo && onAddTodo()
              }
              onClick && onClick()
            }}
            onClickN={() => {
              onClick && onClick()
            }}
          />
        </div>
      )}
    </div>
  )
}

// (북코드, 학습 완료일, 총점, 통과했는가, 학습 모드 - 1st or full, 획득포인트 )
const StudyInfo = ({
  bookCode,
  studyDate,
  totalScore,
  isPassed,
  completedInfo,
  earnPoints,
}: {
  bookCode: string
  studyDate: string
  totalScore: number
  isPassed: boolean
  completedInfo: string
  earnPoints: number
}) => {
  const style = useStyle(STYLE_ID)

  return (
    <div className={style.study_info}>
      <div className={style.detaild}>
        <div className={style.detaild_item}>북코드</div>
        <div className={style.detaild_item}>{bookCode}</div>
        <div className={style.detaild_item}>학습일</div>
        <div className={style.detaild_item}>{studyDate}</div>
        <div className={style.detaild_item}>총점</div>
        <div className={style.detaild_item}>{totalScore}</div>
        <div className={style.detaild_item}>학습 결과</div>
        <div className={style.detaild_item}>
          <span style={{ color: isPassed ? '#15b5f1' : '#ff274f' }}>
            {isPassed ? 'PASS' : 'FAILD'}{' '}
            {isPassed &&
              '/ ' + completedInfo + ' (' + '+' + earnPoints + 'P' + ')'}
          </span>
        </div>
      </div>
    </div>
  )
}

const StepInfo = ({
  scoreStep1,
  scoreStep2,
  scoreStep3,
  scoreStep4,
  scoreStep5,
}: {
  scoreStep1: number | '-'
  scoreStep2: number | '-'
  scoreStep3: number | '-'
  scoreStep4: number | '-'
  scoreStep5: number | '-'
}) => {
  const style = useStyle(STYLE_ID)

  return (
    <div className={style.step_info}>
      <div className={style.label}>step1</div>
      <div className={style.label}>step2</div>
      <div className={style.label}>step3</div>
      <div className={style.label}>step4</div>
      <div className={style.label}>step5</div>
      <div className={style.score}>{scoreStep1}</div>
      <div className={style.score}>{scoreStep2}</div>
      <div className={style.score}>{scoreStep3}</div>
      <div className={style.score}>{scoreStep4}</div>
      <div className={style.score}>{scoreStep5}</div>
    </div>
  )
}

const MoreActivities = ({
  isSpeakPass,
  animationPath,
}: {
  isSpeakPass: boolean
  animationPath?: string
}) => {
  const style = useStyle(STYLE_ID)

  return (
    <div className={style.book_resource}>
      <div className={style.book_resource_container}>
        <SubTitle>보너스 학습</SubTitle>
        <div className={style.buttons}>
          {isSpeakPass && (
            <div className={style.speak_button}>Speak (학습 완료)</div>
          )}
          {/* {animationPath && <div className={style.movie_button}>영상시청</div>} */}
        </div>
      </div>
    </div>
  )
}
