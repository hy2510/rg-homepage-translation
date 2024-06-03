import Image from 'next/image'
import { useState } from 'react'
import { useAchieveLevelPoint } from '@/client/store/achieve/level-point/selector'
import { useFetchLibraryHomePreK } from '@/client/store/library/home/hook'
import { useLibraryHome } from '@/client/store/library/home/selector'
import { AlertBar, Nav, NavItem } from '@/ui/common/common-components'
import { useStyle } from '@/ui/context/StyleContext'
import {
  CourseDodoABCList,
  CourseItem,
} from '@/ui/modules/library-explore-course-list/CourseDodoABCList'
import { LevelUpStatusPK } from '@/ui/modules/library-explore-level-up-status/level-up-status-pk'
import StudyLevelDropDown, {
  DropDownOption,
} from '@/ui/modules/library-find-study-level-selector/StudyLevelDropDown'
import { SetStudyModeModal } from '../../_header/SetStudyMode'
import StudentHistorySelectModal from '../_cpnt/StudentHistorySelectModal'
import useQuickStudyStart from '../_fn/use-quick-study-start'

const STYLE_ID = 'page_library'

type Activity =
  | 'Study-Alphabet'
  | 'Study-Phonics-1'
  | 'Study-Phonics-2'
  | 'Study-Sight-Words-1'
  | 'Study-Sight-Words-2'
  | 'Song-Nursery-Rhyme'
  | 'Song-Alphabet-Chant'
  | 'Song-Phonics-Chant'
  | 'Game-Alphabet'
  | 'Game-Phonics'
  | 'Game-Sight-Words-1'
  | 'Game-Sight-Words-2'
const DodoABCMode = () => {
  const { fetch } = useFetchLibraryHomePreK()

  const [isShowStudyModal, setShowStudyModal] = useState(false)
  const activity = useLibraryHome().Dodo.option.activity as Activity
  const activityType = activity.split('-')[0]

  const levelPoint = useAchieveLevelPoint().payload
  const level = 'PK'

  const preKCategory: DropDownOption[] = [
    { key: 'Study-Alphabet', label: 'DODO ABC' },
    { key: 'Game-Alphabet', label: 'Game' },
    { key: 'Song-Nursery-Rhyme', label: 'Song & Chant' },
  ]

  let currentActivity =
    activityType === 'Study'
      ? preKCategory[0]
      : activityType === 'Song'
        ? preKCategory[2]
        : preKCategory[1]

  const onActivityChanged = (activity: Activity) => {
    fetch({ activity })
  }

  let pointProgress = 0
  const currentLevelPoint = levelPoint.filter(
    (item) => item.levelName === level,
  )
  if (currentLevelPoint && currentLevelPoint.length === 1) {
    const point = currentLevelPoint[0]
    if (point.remainingRgPoint > 0) {
      pointProgress = Number(
        ((point.myRgPoint / point.requiredRgPoint) * 100).toFixed(2),
      )
    } else {
      pointProgress = 100
    }
  }

  const {
    studentHistoryId,
    studentHistoryList,
    selectLevelRoundId,
    setSelectLevelRoundId,
    startStudyIfAvail,
    startStudyImmediate,
  } = useQuickStudyStart()

  return (
    <>
      <LevelUpStatusPK
        progress={`${pointProgress}%`}
        onClickStudyMode={() => setShowStudyModal(true)}>
        <StudyLevelDropDown
          currentItem={currentActivity}
          items={preKCategory}
          onItemClick={(key) => {
            const activity = key as Activity
            onActivityChanged(activity)
          }}
        />
      </LevelUpStatusPK>
      {activityType === 'Study' && (
        <Nav>
          <NavItem
            active={activity === 'Study-Alphabet'}
            onClick={() => {
              onActivityChanged('Study-Alphabet')
            }}>
            알파벳
          </NavItem>
          <NavItem
            active={activity === 'Study-Phonics-1'}
            onClick={() => {
              onActivityChanged('Study-Phonics-1')
            }}>
            파닉스1
          </NavItem>
          <NavItem
            active={activity === 'Study-Phonics-2'}
            onClick={() => {
              onActivityChanged('Study-Phonics-2')
            }}>
            파닉스2
          </NavItem>
          <NavItem
            active={activity === 'Study-Sight-Words-1'}
            onClick={() => {
              onActivityChanged('Study-Sight-Words-1')
            }}>
            사이트워드1
          </NavItem>
          <NavItem
            active={activity === 'Study-Sight-Words-2'}
            onClick={() => {
              onActivityChanged('Study-Sight-Words-2')
            }}>
            사이트워드2
          </NavItem>
        </Nav>
      )}
      {activityType === 'Song' && (
        <Nav>
          <NavItem
            active={activity === 'Song-Nursery-Rhyme'}
            onClick={() => {
              onActivityChanged('Song-Nursery-Rhyme')
            }}>
            Nursery Rhyme
          </NavItem>
          <NavItem
            active={activity === 'Song-Alphabet-Chant'}
            onClick={() => {
              onActivityChanged('Song-Alphabet-Chant')
            }}>
            Alphabet Chant
          </NavItem>
          <NavItem
            active={activity === 'Song-Phonics-Chant'}
            onClick={() => {
              onActivityChanged('Song-Phonics-Chant')
            }}>
            Phonics Chant
          </NavItem>
        </Nav>
      )}
      {activityType === 'Game' && (
        <Nav>
          <NavItem
            active={activity === 'Game-Alphabet'}
            onClick={() => {
              onActivityChanged('Game-Alphabet')
            }}>
            알파벳
          </NavItem>
          <NavItem
            active={activity === 'Game-Phonics'}
            onClick={() => {
              onActivityChanged('Game-Phonics')
            }}>
            파닉스
          </NavItem>
          <NavItem
            active={activity === 'Game-Sight-Words-1'}
            onClick={() => {
              onActivityChanged('Game-Sight-Words-1')
            }}>
            사이트워드1
          </NavItem>
          <NavItem
            active={activity === 'Game-Sight-Words-2'}
            onClick={() => {
              onActivityChanged('Game-Sight-Words-2')
            }}>
            사이트워드2
          </NavItem>
        </Nav>
      )}
      {/* 코스 아이템 */}
      {activityType === 'Study' && (
        <DodoABCStudy onBookCoverClick={startStudyIfAvail} />
      )}
      {activityType === 'Game' && (
        <DodoABCGame onBookCoverClick={startStudyIfAvail} />
      )}
      {activityType === 'Song' && (
        <DodoABCSong onBookCoverClick={startStudyIfAvail} />
      )}
      {isShowStudyModal && (
        <SetStudyModeModal onCloseClick={() => setShowStudyModal(false)} />
      )}
      {selectLevelRoundId && (
        <StudentHistorySelectModal
          studentHistoryList={studentHistoryList}
          defaultStudentHistoryId={studentHistoryId}
          onCloseModal={() => setSelectLevelRoundId(undefined)}
          onSelectStudentHistoryId={startStudyImmediate}
        />
      )}
    </>
  )
}
export default DodoABCMode

function DodoABCStudy({
  onBookCoverClick,
}: {
  onBookCoverClick?: (levelRoundId: string) => void
}) {
  const activity = useLibraryHome().Dodo.option.activity as Activity
  const pkBooks = useLibraryHome().Dodo.payload.book

  const maxContents = pkBooks.length
  let passedContents = 0
  pkBooks.forEach((item) => {
    if (item.rgPointCount > 0) {
      passedContents++
    }
  })

  let introVideoSrc = ''
  let outroVideoSrc = ''
  let introBg = ''
  let outroBg = ''
  let introPosterSrc = ''
  let outroPosterSrc = ''
  if (activity === 'Study-Alphabet') {
    introVideoSrc =
      'https://wcfresource.a1edu.com/newsystem/moviebook/dodoabc/alphabet_intro.mp4'
    outroVideoSrc =
      'https://wcfresource.a1edu.com/newsystem/moviebook/dodoabc/alphabet_ending.mp4'
    introBg = 'alphabet'
    outroBg = 'alphabet'
    introPosterSrc =
      '/src/images/@dodo-abc-video-thumbnail/doddo_abc_01_intro.png'
    outroPosterSrc =
      '/src/images/@dodo-abc-video-thumbnail/doddo_abc_01_ending.png'
  } else if (activity === 'Study-Phonics-1') {
    introVideoSrc =
      'https://wcfresource.a1edu.com/newsystem/moviebook/dodoabc/phonics1_intro.mp4'
    outroVideoSrc =
      'https://wcfresource.a1edu.com/newsystem/moviebook/dodoabc/phonics1_ending.mp4'
    introBg = 'phonics1'
    outroBg = 'phonics1'
    introPosterSrc =
      '/src/images/@dodo-abc-video-thumbnail/doddo_abc_02_intro.png'
    outroPosterSrc =
      '/src/images/@dodo-abc-video-thumbnail/doddo_abc_02_ending.png'
  } else if (activity === 'Study-Phonics-2') {
    introVideoSrc =
      'https://wcfresource.a1edu.com/newsystem/moviebook/dodoabc/phonics2_intro.mp4'
    outroVideoSrc =
      'https://wcfresource.a1edu.com/newsystem/moviebook/dodoabc/phonics2_ending.mp4'
    introBg = 'phonics2'
    outroBg = 'phonics2'
    introPosterSrc =
      '/src/images/@dodo-abc-video-thumbnail/doddo_abc_03_intro.png'
    outroPosterSrc =
      '/src/images/@dodo-abc-video-thumbnail/doddo_abc_03_ending.png'
  } else if (activity === 'Study-Sight-Words-1') {
    introVideoSrc =
      'https://wcfresource.a1edu.com/newsystem/moviebook/dodoabc/sightwords_intro.mp4'
    outroVideoSrc =
      'https://wcfresource.a1edu.com/newsystem/moviebook/dodoabc/sightwords_ending.mp4'
    introBg = 'sightWords1'
    outroBg = 'sightWords1'
    introPosterSrc =
      '/src/images/@dodo-abc-video-thumbnail/doddo_abc_04_intro.png'
    outroPosterSrc =
      '/src/images/@dodo-abc-video-thumbnail/doddo_abc_04_ending.png'
  } else if (activity === 'Study-Sight-Words-2') {
    introVideoSrc = ''
    outroVideoSrc = ''
    introBg = 'sightWords2'
    outroBg = 'sightWords2'
  }

  return (
    <>
      <AlertBar>DODO와 함께 영어의 기초를 즐겁게 배워보세요!</AlertBar>
      <CourseDodoABCList
        passedNum={passedContents}
        totalNum={maxContents}
        introVideoSrc={introVideoSrc}
        outroVideoSrc={outroVideoSrc}
        introBg={introBg}
        outroBg={outroBg}
        introPosterSrc={introPosterSrc}
        outroPosterSrc={outroPosterSrc}>
        {pkBooks.map((item, i) => {
          return (
            <CourseItem
              key={item.levelRoundId}
              imgSrc={item.surfaceImagePath}
              passCount={item.rgPointCount}
              title={item.topicTitle}
              bookCode={item.levelName}
              previousItemPass={i === 0 || pkBooks[i - 1].rgPointCount > 0}
              onStartClick={() => {
                onBookCoverClick && onBookCoverClick(item.levelRoundId)
              }}
            />
          )
        })}
      </CourseDodoABCList>
    </>
  )
}

function DodoABCGame({
  onBookCoverClick,
}: {
  onBookCoverClick?: (levelRoundId: string) => void
}) {
  const style = useStyle(STYLE_ID)

  const activity = useLibraryHome().Dodo.option.activity as Activity
  const pkBooks = useLibraryHome().Dodo.payload.book

  let gameActivityStyle = ''
  if (activity === 'Game-Alphabet') {
    gameActivityStyle = ` ${style.alphabet}`
  } else if (activity === 'Game-Phonics') {
    gameActivityStyle = ` ${style.phonics}`
  } else if (activity === 'Game-Sight-Words-1') {
    gameActivityStyle = ` ${style.sight_word_1}`
  } else if (activity === 'Game-Sight-Words-2') {
    gameActivityStyle = ` ${style.sight_word_2}`
  }

  return (
    <>
      <div className={`${style.game_header} ${gameActivityStyle}`}>
        <div className={`${style.symbol_image} ${gameActivityStyle}`} />
      </div>
      <div className={style.game_list}>
        {pkBooks.map((item) => {
          const starIcons: number[] = Array(item.rgPointCount).fill(0)

          return (
            <div
              key={item.levelRoundId}
              className={`${style.game_list_item} ${
                item.gameLandRoundOpenYn ? '' : style.incompleted
              }`}
              onClick={() => {
                if (item.gameLandRoundOpenYn) {
                  onBookCoverClick && onBookCoverClick(item.levelRoundId)
                }
              }}>
              {starIcons.length > 0 && (
                <div className={style.completed_label}>
                  {starIcons.map((_, i) => {
                    return (
                      <div
                        className={style.ico_star}
                        key={`star_${item.levelRoundId}_${i}`}
                      />
                    )
                  })}
                </div>
              )}
              <Image
                alt=""
                src={item.surfaceImagePath}
                width={100}
                height={150}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          )
        })}
      </div>
    </>
  )
}

function DodoABCSong({
  onBookCoverClick,
}: {
  onBookCoverClick?: (levelRoundId: string) => void
}) {
  const style = useStyle(STYLE_ID)

  const activity = useLibraryHome().Dodo.option.activity as Activity
  const pkBooks = useLibraryHome().Dodo.payload.book

  let songActivityStyle = ''
  if (activity === 'Song-Nursery-Rhyme') {
    songActivityStyle = ` ${style.nursery_rhyme}`
  } else if (activity === 'Song-Alphabet-Chant') {
    songActivityStyle = ` ${style.alpabet_chant}`
  } else if (activity === 'Song-Phonics-Chant') {
    songActivityStyle = ` ${style.phonics_chant}`
  }

  return (
    <>
      <div className={`${style.songn_chant_header} ${songActivityStyle}`}>
        <div className={`${style.symbol_image} ${songActivityStyle}`} />
      </div>
      <div className={style.songn_chant_list}>
        {pkBooks.map((item) => {
          return (
            <div
              className={style.songn_chant_list_item}
              key={item.levelRoundId}
              onClick={() => {
                onBookCoverClick && onBookCoverClick(item.levelRoundId)
              }}>
              <div className={style.cover}>
                <Image
                  alt=""
                  src={item.surfaceImagePath}
                  width={150}
                  height={100}
                  style={{ width: '100%', height: '100%', display: 'block' }}
                />
              </div>
              {/* <div className={style.title}>{a.topicTitle}</div> */}
            </div>
          )
        })}
      </div>
    </>
  )
}
