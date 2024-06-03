'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Button } from '@/ui/common/common-components'
import { useStyle } from '@/ui/context/StyleContext'

const STYLE_ID = 'intro_choose_level'

// 단계선택 콘테이너
export function IntroChooseLevel({
  onChooseLevel,
}: {
  onChooseLevel?: (level: string) => void
}) {
  const style = useStyle(STYLE_ID)

  const [selectedLevel, setSelectedLevel] = useState<
    'PK' | 'KA' | '1A' | '2A' | undefined
  >(undefined)

  const onToggleCard = (level: 'PK' | 'KA' | '1A' | '2A') => {
    if (selectedLevel !== level) {
      setSelectedLevel(level)
    } else {
      setSelectedLevel(undefined)
    }
  }

  return (
    <div className={style.intro_choose_level}>
      <div
        className={`container compact ${style.intro_choose_level_container}`}>
        <div className={style.header}>
          <div className={style.txt_h}>시작할 단계를 선택하세요.</div>
          <div className={style.txt_p}>
            일단 시작해 보세요. 언제든지 변경 가능합니다.
          </div>
        </div>
        <div className={style.body}>
          <IntroChooseItem
            bgColor="#704ea6"
            label="PreK"
            title="기초 영어"
            detail="유치원 수준의 알파벳, 파닉스, 사이트 워드"
            // symbolImgSrc="/src/images/@intro-choose-level/symbol_img_01.svg"
            symbolImgSrc="/src/images/@intro-choose-level/prek_prev@2x.png"
            onCardClick={() => {
              onToggleCard('PK')
            }}
            onStartClick={() => {
              onChooseLevel && onChooseLevel('PK')
            }}
            active={selectedLevel === 'PK'}
          />
          <IntroChooseItem
            bgColor="#f6993b"
            label="Level K"
            title="초등 저학년"
            detail="기본 어휘학습, 짧은 스토리 이해"
            // symbolImgSrc="/src/images/@intro-choose-level/symbol_img_02.svg"
            symbolImgSrc="/src/images/@intro-choose-level/ka_prev@2x.png"
            onCardClick={() => {
              onToggleCard('KA')
            }}
            onStartClick={() => {
              onChooseLevel && onChooseLevel('KA')
            }}
            active={selectedLevel === 'KA'}
          />
          <IntroChooseItem
            bgColor="#e35f33"
            label="Level 1"
            title="초등 고학년"
            detail="스스로 읽기 능력 향상, 다양한 주제의 스토리"
            // symbolImgSrc="/src/images/@intro-choose-level/symbol_img_03.svg"
            symbolImgSrc="/src/images/@intro-choose-level/1a_prev@2x.png"
            onCardClick={() => {
              onToggleCard('1A')
            }}
            onStartClick={() => {
              onChooseLevel && onChooseLevel('1A')
            }}
            active={selectedLevel === '1A'}
          />
          <IntroChooseItem
            bgColor="#4eba60"
            label="Level 2"
            title="중등 이상"
            detail="독립적 읽기 완성, 논픽션 심화"
            // symbolImgSrc="/src/images/@intro-choose-level/symbol_img_04.svg"
            symbolImgSrc="/src/images/@intro-choose-level/2a_prev@2x.png"
            onCardClick={() => {
              onToggleCard('2A')
            }}
            onStartClick={() => {
              onChooseLevel && onChooseLevel('2A')
            }}
            active={selectedLevel === '2A'}
          />
        </div>
      </div>
    </div>
  )
}

// 단계선택 아이템
export function IntroChooseItem({
  bgColor,
  label,
  title,
  detail,
  symbolImgSrc,
  active,
  onCardClick,
  onStartClick,
}: {
  bgColor?: string
  label?: string
  title?: string
  detail?: string
  symbolImgSrc: string
  active?: boolean
  onCardClick?: () => void
  onStartClick?: () => void
}) {
  const style = useStyle(STYLE_ID)

  return (
    // <div style={{ minHeight: '300px', position: 'relative' }}>
    <div>
      <div
        // className={`${style.intro_choose_item} ${active && style.active}`}
        style={{backgroundColor: bgColor}}
        className={`${style.intro_choose_item}`}
        onClick={onCardClick}>
        <div className={style.exp}>
          <div className={style.txt_l}>{label}</div>
          <div className={style.txt_h}>{title}</div>
          <div className={style.txt_p}>{detail}</div>
        </div>
        {/* <div className={style.symbol_image}>
          <Image alt={''} src={symbolImgSrc} width={100} height={120} />
        </div> */}
        <div className={style.choose_box}>
          <Image alt={''} src={symbolImgSrc} width={300} height={200} style={{width: '100%', height: '100%'}} />
          <Button color={'red'} shadow onClick={onStartClick}>
            선택
          </Button>
        </div>
      </div>
      {/* <div className={style.buttons}>
        <div className={style.preview}>
          <div className={style.preview_link}>미리 보기</div>
        </div>
        <Button color={'red'} shadow onClick={onStartClick}>
          시작
        </Button>
      </div> */}
    </div>
  )
}
