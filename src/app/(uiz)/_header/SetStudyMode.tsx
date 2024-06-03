'use client'

import { useCustomerInfo } from '@/app/_context/CustomerContext'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useLibraryHomeAction } from '@/client/store/library/home/selector'
import { useFetchChangeStudySetting } from '@/client/store/student/info/hook'
import {
  useStudentInfo,
  useStudentInfoAction,
} from '@/client/store/student/info/selector'
import { Button, CheckBox, Modal } from '@/ui/common/common-components'
import { useStyle } from '@/ui/context/StyleContext'
import { getUserConfig, updateUserConfig } from './_fn/user-config'

const STYLE_ID = 'global_option_my_rg'

export function SetStudyModeModal({
  onCloseClick,
}: {
  onCloseClick?: () => void
}) {
  const style = useStyle(STYLE_ID)
  return (
    <Modal
      compact
      header={true}
      title={'학습설정'}
      onClickDelete={() => {
        onCloseClick && onCloseClick()
      }}
      onClickLightbox={() => {
        onCloseClick && onCloseClick()
      }}>
      <div className={style.my_rg_modal}>
        <SetStudyMode />
      </div>
    </Modal>
  )
}

// 학습 설정
export function SetStudyMode() {
  const style = useStyle(STYLE_ID)

  const { updateMode } = useLibraryHomeAction()
  const { updateStudySetting } = useStudentInfoAction()

  const customerId = useCustomerInfo().customerId
  const student = useStudentInfo().payload

  const [viewMode, setViewMode] = useState<'level' | 'challenge'>(
    getUserConfig(
      {
        studentId: student.studentId,
        customerId,
      },
      true,
    )!!.mode === 'challenge'
      ? 'challenge'
      : 'level',
  )
  const [isKListenAndRepeat, setKListenAndRepeat] = useState(
    student.eBKListenRepeat,
  )
  const [is1ListenAndRepeat, set1ListenAndRepeat] = useState(
    student.eB1ListenRepeat,
  )
  const [isVocaHint, setVocaHint] = useState(student.viewStep2Skip)
  const [isSummaryChance, setSummaryChance] = useState(student.viewStep3Hint)

  const onClickSaveMode = () => {
    updateUserConfig({
      customerId,
      studentId: student.studentId,
      mode: viewMode,
    })
    updateMode(viewMode)
  }

  useEffect(() => {
    updateUserConfig({
      customerId,
      studentId: student.studentId,
      mode: viewMode,
    })
    updateMode(viewMode)
  },[viewMode])

  const { fetch } = useFetchChangeStudySetting()
  const onChangeStudyOption = (
    type:
      | 'EBKListenRepeat'
      | 'EB1ListenRepeat'
      | 'ViewStep3Hint'
      | 'ViewStep2Skip',
    value: boolean,
  ) => {
    let update: ((value: boolean) => void) | undefined = undefined
    if (type === 'EBKListenRepeat') {
      update = setKListenAndRepeat
    } else if (type === 'EB1ListenRepeat') {
      update = set1ListenAndRepeat
    } else if (type === 'ViewStep2Skip') {
      update = setVocaHint
    } else if (type === 'ViewStep3Hint') {
      update = setSummaryChance
    }
    update && update(value)
    fetch({
      type,
      value,
      callback: (success) => {
        if (success) {
          updateStudySetting(type, value)
        } else {
          update && update(!value)
        }
      },
    })
  }

  return (
    <div className={style.set_study_mode}>
      <div className={style.row_a}>
        <div className={style.txt_h}>학습 메인</div>
        {/* 자유 모드, 코스 모드 */}
        {/* <div className={style.choose_study_mode}>
          <ChooseStudyModeItem
            name="레벨업 모드"
            active={viewMode === 'level'}
            levelUpIcon
            onClick={() => {
              setViewMode('level')
            }}
          />
          <ChooseStudyModeItem
            name="챌린지 모드"
            active={viewMode === 'challenge'}
            challengeIcon
            onClick={() => {
              setViewMode('challenge')
            }}
          />
        </div> */}
        <SetStudyOptionItem
          title="챌린지 참여 현황 보기"
          discription="영어 독서왕 대회가 시작되면 챌린지 참여 현황이 활성화됩니다."
          check={viewMode === 'challenge'}
          onClick={() => {
              viewMode === 'level' ? setViewMode('challenge') : setViewMode('level')
            }
          }
        />
      </div>
      <div className={style.row_c}>
        <div className={style.txt_h}>eBook 스토리</div>
        <SetStudyOptionItem
          title="Listen & Repeat - Level K"
          discription="eBook 학습에서 스토리가 자동으로 2회 반복 재생 됩니다."
          check={isKListenAndRepeat}
          onClick={() =>
            onChangeStudyOption('EBKListenRepeat', !isKListenAndRepeat)
          }
        />
        <SetStudyOptionItem
          title="Listen & Repeat - Level 1"
          discription="eBook 학습에서 스토리가 자동으로 2회 반복 재생 됩니다."
          check={is1ListenAndRepeat}
          onClick={() =>
            onChangeStudyOption('EB1ListenRepeat', !is1ListenAndRepeat)
          }
        />
      </div>
      <div className={style.row_b}>
        <div className={style.txt_h}>퀴즈 풀기</div>
        <SetStudyOptionItem
          title="Vocabulary Skip, Hint"
          discription="타이핑 방식의 Practice는 문제마다 건너뛸 수 있고, Test는 주어진 기회만큼 힌트가 제공됩니다."
          check={isVocaHint}
          onClick={() => onChangeStudyOption('ViewStep2Skip', !isVocaHint)}
        />
        <SetStudyOptionItem
          title="Summary Chance"
          discription="주어진 기회만큼 정답을 획득하고 다음 문제로 건너뛸 수 있습니다."
          check={isSummaryChance}
          onClick={() => onChangeStudyOption('ViewStep3Hint', !isSummaryChance)}
        />
      </div>
      {/* <Button shadow width={'100%'} onClick={onClickSaveMode}>
        저장하기
      </Button> */}
    </div>
  )
}

// 학습 설정 > 학습 모드 선택 아이템
const ChooseStudyModeItem = ({
  name,
  active,
  onClick,
  levelUpIcon,
  challengeIcon,
}: {
  name: string
  active: boolean
  onClick?: () => void
  levelUpIcon?: boolean
  challengeIcon?: boolean
}) => {
  const style = useStyle(STYLE_ID)

  return (
    <div
      className={`${style.choose_study_mode_item} ${active && style.active}`}
      onClick={onClick}>
      {levelUpIcon &&
        (active ? (
          <Image
            alt=""
            src="/src/images/@set-study-mode/book_icon_on.svg"
            width={24}
            height={24}
          />
        ) : (
          <Image
            alt=""
            src="/src/images/@set-study-mode/book_icon_off.svg"
            width={24}
            height={24}
          />
        ))}
      {challengeIcon &&
        (active ? (
          <Image
            alt=""
            src="/src/images/@set-study-mode/crown_icon_on.svg"
            width={24}
            height={24}
          />
        ) : (
          <Image
            alt=""
            src="/src/images/@set-study-mode/crown_icon_off.svg"
            width={24}
            height={24}
          />
        ))}
      {name}
    </div>
  )
}

// 학습 설정 > 학습 옵션 설정 아이템
const SetStudyOptionItem = ({
  check,
  title,
  discription,
  onClick,
}: {
  check: boolean
  title: string
  discription: string
  onClick?: () => void
}) => {
  const style = useStyle(STYLE_ID)

  return (
    <div
      className={`${style.set_study_option_item} ${check && style.checked}`}
      onClick={onClick}>
      <div className={style.row_a1}>
        <span className={style.txt_h1}>{title}</span>
        <CheckBox check={check} />
      </div>
      <div className={style.row_b}>{discription}</div>
    </div>
  )
}
