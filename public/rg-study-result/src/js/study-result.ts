type Popup = {
  popup: {
    divContainer: HTMLDivElement
    divPopupResult: HTMLDivElement
    divEffect: HTMLDivElement
  }
  attach: (parent: Element) => void
  detach: (parent: Element) => void
}

type PopupData = {
  playerReadingUnit: string
  score: number
  point?: number
  totalPoint?: number
  isDailyGoal?: boolean
  dailyGoalAward?: number
  isTodayStreak?: boolean
  streakAward?: number
  levelMaster?: string
  challenge?: string
  storyImage?: string
}

const SHOW_NEXT_ANIMATE_DELAY = 500

const POPUP_AUDIO_PATH = `src/audio`
const DAILY_GOAL_AWARD_IMAGE_PATH = `../src/images/@award-daily-goal`
const STREAK_AWARD_IMAGE_PATH = `../src/images/@award-streak`
const LEVEL_MASTER_IMAGE_PATH = `../src/images/@award-level-master`
const CHALLENGE_AWARD_IMAGE_PATH = `../src/images/@award-challenge`
const READING_UNIT_IMAGE_PATH = `src/images/study-complete`

const POPUP_FAIL = 'FAIL'
const POPUP_PASS = 'PASS'
const POPUP_DAILY_GOAL = 'DAILY_GOAL'
const POPUP_DAILY_GOAL_AWARD = 'DAILY_GOAL_AWARD'
const POPUP_STREAK = 'STREAK'
const POPUP_STREAK_AWARD = 'STREAK_AWARD'
const POPUP_FRIENDS_STORY = 'FRIENDS_STORY'
const POPUP_LEVEL_MASTER = 'LEVEL_MASTER'
const POPUP_CHALLENGE_AWARD = 'CHALLENGE_AWARD'

//=======================================================================================================//

const POPUP_PLAY_LIST: string[] = []
let playIndex = -1
let popupData: PopupData | undefined = undefined
let popupParent: Element | null = null
let popups: [Popup | null, Popup | null] = [null, null]
let returnUrl: string | undefined = undefined

function init() {
  const ferData = window.sessionStorage.getItem('FER')
  if (ferData) {
    /**
    {
      type: 'PK' | 'DODO' | 'EB' | 'PB'
      unit: ''
      level: ''
      referer: '/uiz/home'
      data: '~~~'
    }
    -----------------------------
    {
      "average": "100",
      "rgpoint": "1",
      "totalpoint": "126.85",
      "levelup": "",
      "levelmaster": "",
      "newreadingunit": "N",
      "readingunitid": "",
      "dailybook": "1",
      "dailypoint": "1",
      "dailytype": "BOOK",
      "dailygoal": "Y",
      "awarddailygoal": "100",
      "todayfirstpoint": "Y",
      "awardstraight": "100",
      "prizetitle": "NONE"
    }
     */
    const FER = JSON.parse(decodeURIComponent(atob(ferData)))
    if (FER && FER.data) {
      const studyResult = JSON.parse(FER.data)

      returnUrl = FER.referer
      const playerReadingUnit = FER.unit || findResultReadingUnit(FER.level)
      const point = studyResult.rgpoint ? Number(studyResult.rgpoint) : 0
      const totalPoint = studyResult.totalpoint
        ? Number(studyResult.totalpoint)
        : 0
      const score = studyResult.average ? Number(studyResult.average) : 0
      const isDailyGoal = studyResult.dailygoal
        ? studyResult.dailygoal === 'Y'
        : undefined
      const dailyGoalAward = studyResult.awarddailygoal
        ? Number(studyResult.awarddailygoal)
        : undefined
      const isTodayStreak = studyResult.todayfirstpoint
        ? studyResult.todayfirstpoint === 'Y'
        : undefined

      const streakAward = studyResult.awardstraight
        ? Number(studyResult.awardstraight)
        : undefined
      const levelMaster = studyResult.levelmaster || undefined
      let challenge = undefined
      if (
        studyResult.prizetitle &&
        !studyResult.prizetitle.startsWith('NONE')
      ) {
        const prize = studyResult.prizetitle.substring(0, 2)
        if (prize === '대상') {
          challenge = '1'
        } else if (prize === '최우') {
          challenge = '2'
        } else if (prize === '우수') {
          challenge = '3'
        } else {
          challenge = '4'
        }
      }
      const storyImage = getReadingUnitImage(totalPoint, point)?.imagePath
      popupData = {
        playerReadingUnit,
        point,
        totalPoint,
        score,
        isDailyGoal,
        dailyGoalAward,
        isTodayStreak,
        streakAward,
        levelMaster,
        challenge,
        storyImage,
      }
    }
  }

  window.sessionStorage.removeItem('REF')
  window.sessionStorage.removeItem('FER')
  window.sessionStorage.removeItem('apiStudyInfo')

  if (popupData) {
    setup()
  }
}

function setup() {
  if (!popupData) return

  if (popupData.score >= 70) {
    POPUP_PLAY_LIST.push(POPUP_PASS)
    if (popupData.isDailyGoal) {
      POPUP_PLAY_LIST.push(POPUP_DAILY_GOAL)
    }
    if (popupData.dailyGoalAward) {
      POPUP_PLAY_LIST.push(POPUP_DAILY_GOAL_AWARD)
    }
    if (popupData.isTodayStreak) {
      POPUP_PLAY_LIST.push(POPUP_STREAK)
    }
    if (popupData.streakAward) {
      POPUP_PLAY_LIST.push(POPUP_STREAK_AWARD)
    }
    if (popupData.storyImage) {
      POPUP_PLAY_LIST.push(POPUP_FRIENDS_STORY)
    }
    if (popupData.levelMaster) {
      POPUP_PLAY_LIST.push(POPUP_LEVEL_MASTER)
    }
    if (popupData.challenge) {
      POPUP_PLAY_LIST.push(POPUP_CHALLENGE_AWARD)
    }
  } else {
    POPUP_PLAY_LIST.push(POPUP_FAIL)
  }
  popupParent = document.querySelector('.container')
}

function startBoxOpen() {
  if (next()) {
    document.querySelector('#checkResult')?.classList.add('d-none')
  } else {
    finish()
  }
}

function onNextClick() {
  if (!next()) {
    finish()
  }
}

function finish() {
  if (returnUrl) {
    window.location.replace(returnUrl)
  } else {
    window.location.replace('/')
  }
}

function next() {
  const nextIndex = playIndex + 1
  if (
    !popupParent ||
    !popupData ||
    nextIndex < 0 ||
    nextIndex >= POPUP_PLAY_LIST.length
  ) {
    return false
  }

  let attachPopup = undefined
  let detachPopup = undefined
  if (nextIndex === 0) {
    const currentPopup = createPopup(
      POPUP_PLAY_LIST[nextIndex],
      popupData,
      onNextClick,
    )
    popups[0] = currentPopup
    attachPopup = currentPopup
  } else {
    detachPopup = popups[0]
    attachPopup = popups[1]
    popups[0] = popups[1]
    popups[1] = null
  }
  if (nextIndex + 1 < POPUP_PLAY_LIST.length) {
    const nextPopup = createPopup(
      POPUP_PLAY_LIST[nextIndex + 1],
      popupData,
      onNextClick,
    )
    popups[1] = nextPopup
  }
  if (detachPopup) {
    detachPopup.detach(popupParent)
  }
  if (attachPopup) {
    attachPopup.attach(popupParent)
    playIndex++
  }

  return true
}

function createPopup(
  popupId: string,
  data: PopupData,
  onClick?: () => void,
): Popup {
  let popup: Popup | undefined = undefined
  switch (popupId) {
    case POPUP_FAIL:
      popup = createTryAgainPopup(data.score, data.playerReadingUnit, onClick)
      break
    case POPUP_PASS:
      popup = createGoodJobPopup(
        data.point!,
        data.score,
        data.playerReadingUnit,
        onClick,
      )
      break
    case POPUP_DAILY_GOAL:
      popup = createDailyGoalPopup(onClick)
      break
    case POPUP_DAILY_GOAL_AWARD:
      popup = createDailyGoalAwardPopup(data.dailyGoalAward!, onClick)
      break
    case POPUP_STREAK:
      popup = createStreakPopup(onClick)
      break
    case POPUP_STREAK_AWARD:
      popup = createStreakAwardPopup(data.streakAward!, onClick)
      break
    case POPUP_FRIENDS_STORY:
      popup = createNewReadingUnitStoryPopup(data.storyImage!, onClick)
      break
    case POPUP_LEVEL_MASTER:
      const level = data.levelMaster!
      if (level === 'PK') {
        popup = createLevelMasterPopup('prek', onClick)
      } else {
        popup = createLevelMasterPopup(level.toLocaleLowerCase(), onClick)
      }
      break
    case POPUP_CHALLENGE_AWARD:
      popup = createChallengePopup(data.challenge!, onClick)
      break
  }
  if (!popup) {
    throw Error('popupId missmatch')
  }
  return popup
}

/**
 * Good Job Popup
 * @param points 획득한 포인트
 * @param score 학습 총점
 * @param readingUnit 학습 리딩유닛
 * @returns
 */
function createGoodJobPopup(
  points: number,
  score: number,
  readingUnit: string,
  onClick?: () => void,
): Popup {
  const popup = createPopupContainer('pass')

  // <div class="earn-point">
  //   <div id="pointNum" class="point"></div>
  //   <div id="readingUnit" class="reading-unit"></div>
  // </div>
  const divEarnPoint = div({ className: 'earn-point' })

  const divEarnPointNum = div({ className: 'point', text: `${points}` })
  const divEarnPointUnit = div({
    className: `reading-unit`,
  })
  const goodJobImage = `${READING_UNIT_IMAGE_PATH}/${readingUnit}_good_job.svg`
  divEarnPointUnit.style.backgroundImage = `url("${goodJobImage}")`

  divEarnPoint.appendChild(divEarnPointNum)
  divEarnPoint.appendChild(divEarnPointUnit)

  // <div class="ribbon-good-job"></div>
  const divGoodJob = div({ className: 'ribbon-good-job' })

  // <div class="score-container">
  //   <div class="txt-total-score"><span id="totalStudyScore"></span>/100</div>
  //   <div class="txt-message">Points Achived!</div>
  // </div>
  const divScoreContainer = div({ className: 'score-container' })

  const divTotalScore = div({ className: 'txt-total-score' })
  const spanMyScore = document.createElement('span')
  spanMyScore.id = 'totalStudyScore'
  spanMyScore.textContent = `${score}`
  const scoreTextNode = document.createTextNode('/100')

  divTotalScore.appendChild(spanMyScore)
  divTotalScore.appendChild(scoreTextNode)

  const divMessage = div({
    className: 'txt-message',
    text: 'Points Achieved!',
  })

  divScoreContainer.appendChild(divTotalScore)
  divScoreContainer.appendChild(divMessage)

  // div 차례대로 추가
  popup.divPopupResult.appendChild(divEarnPoint)
  popup.divPopupResult.appendChild(divGoodJob)
  popup.divPopupResult.appendChild(divScoreContainer)

  // 오디오 추가
  const audio = new Audio(`${POPUP_AUDIO_PATH}/study-result-pass.mp3`)

  if (onClick) {
    popup.divContainer.addEventListener('click', onClick)
  }
  return {
    popup,
    attach: (parent) => {
      audio.play()
      parent.appendChild(popup.divContainer)
      popup.divContainer.classList.remove('d-none')
      popup.divContainer.classList.add(
        'd-flex',
        'animate__animated',
        'animate__fadeIn',
      )
      popup.divPopupResult.classList.add('d-none')
      setTimeout(() => {
        popup.divPopupResult.classList.remove('d-none')
        popup.divPopupResult.classList.add(
          'animate__animated',
          'animate__bounceIn',
        )
      }, SHOW_NEXT_ANIMATE_DELAY)
    },
    detach: (parent) => {
      parent.removeChild(popup.divContainer)
    },
  }
}

/**
 * Try Again Popup
 * @param score 학습 총점
 * @param readingUnit 학습 리딩유닛
 */
function createTryAgainPopup(
  score: number,
  readingUnit: string,
  onClick?: () => void,
): Popup {
  const popup = createPopupContainer('fail')

  // <div class="earn-point">
  //   <div id="readingUnit" class="reading-unit"></div>
  // </div>
  const divEarnPoint = div({ className: 'earn-point' })

  const divEarnPointUnit = div({
    className: `reading-unit`,
  })
  const tryAgainImage = `${READING_UNIT_IMAGE_PATH}/${readingUnit}_try_again.svg`
  divEarnPointUnit.style.backgroundImage = `url("${tryAgainImage}")`

  divEarnPoint.appendChild(divEarnPointUnit)

  // <div class="ribbon-try-again"></div>
  const divGoodJob = div({ className: 'ribbon-try-again' })

  // <div class="score-container">
  //   <div class="txt-total-score"><span id="totalStudyScore"></span>/100</div>
  // </div>
  const divScoreContainer = div({ className: 'score-container' })

  const divTotalScore = div({ className: 'txt-total-score' })
  const spanMyScore = document.createElement('span')
  spanMyScore.id = 'totalStudyScore'
  spanMyScore.textContent = `${score}`
  const scoreTextNode = document.createTextNode('/100')

  divTotalScore.appendChild(spanMyScore)
  divTotalScore.appendChild(scoreTextNode)

  divScoreContainer.appendChild(divTotalScore)

  // div 차례대로 추가
  popup.divPopupResult.appendChild(divEarnPoint)
  popup.divPopupResult.appendChild(divGoodJob)
  popup.divPopupResult.appendChild(divScoreContainer)

  // 오디오 추가
  const audio = new Audio(`${POPUP_AUDIO_PATH}/study-result-fail.mp3`)

  if (onClick) {
    popup.divContainer.addEventListener('click', onClick)
  }
  return {
    popup,
    attach: (parent) => {
      audio.play()
      parent.appendChild(popup.divContainer)
      popup.divContainer.classList.remove('d-none')
      popup.divContainer.classList.add(
        'd-flex',
        'animate__animated',
        'animate__fadeIn',
      )
      setTimeout(() => {
        popup.divPopupResult.classList.remove('d-none')
      }, SHOW_NEXT_ANIMATE_DELAY)
    },
    detach: (parent) => {
      parent.removeChild(popup.divContainer)
    },
  }
}

/**
 * 일일 학습 목표 달성 Popup
 */
function createDailyGoalPopup(onClick?: () => void): Popup {
  const popup = createPopupContainer('dailyGoal', 'pass')

  //  <div class="confetti"></div>
  const divConfetti = createConfetti()
  popup.divPopupResult.appendChild(divConfetti)

  //  <div class="daily-goal-symbol"></div>
  const divDailyGoalSymbol = div({ className: 'daily-goal-symbol' })
  popup.divPopupResult.appendChild(divDailyGoalSymbol)

  //   <div class="message-box">
  //     <div class="txt-1">일일목표 달성!</div>
  //     <div class="txt-2">오늘의 학습 목표를 달성했어요!</div>
  //   </div>
  const divMessage = createMessageBox(
    '일일목표 달성!',
    '오늘의 학습 목표를 달성했어요!',
  )
  popup.divPopupResult.appendChild(divMessage)

  // 오디오 추가
  const audio = new Audio(`${POPUP_AUDIO_PATH}/daily-goal.mp3`)

  if (onClick) {
    popup.divContainer.addEventListener('click', onClick)
  }
  return {
    popup,
    attach: (parent) => {
      audio.play()
      parent.appendChild(popup.divContainer)
      popup.divContainer.classList.remove('d-none')
      popup.divContainer.classList.add(
        'd-flex',
        'animate__animated',
        'animate__fadeIn',
      )
      popup.divPopupResult.classList.add('d-none')
      setTimeout(() => {
        popup.divPopupResult.classList.remove('d-none')
        popup.divPopupResult.classList.add(
          'animate__animated',
          'animate__bounceIn',
        )
      }, SHOW_NEXT_ANIMATE_DELAY)
    },
    detach: (parent) => {
      parent.removeChild(popup.divContainer)
    },
  }
}

/**
 * 일일 학습 목표 뱃지 횟득 Popup
 * @param count 달성 누적 수
 */
function createDailyGoalAwardPopup(count: number, onClick?: () => void): Popup {
  const popup = createPopupContainer('dailyGoalAward', 'award')

  // <div class="confetti"></div>
  const divConfetti = createConfetti()
  popup.divPopupResult.appendChild(divConfetti)

  // <div id="dailyGoalAwardBadge" class="daily-goal-award-badge"></div>
  const divDailyGoalAwardBadge = div({
    id: 'dailyGoalAwardBadge',
    className: 'daily-goal-award-badge',
  })
  const dailyGoalAwardImage = `${DAILY_GOAL_AWARD_IMAGE_PATH}/badge_${count}d.svg`
  divDailyGoalAwardBadge.style.backgroundImage = `url("${dailyGoalAwardImage}")`
  popup.divPopupResult.appendChild(divDailyGoalAwardBadge)

  // <div class="message-box">
  //   <div class="txt-1">일일목표 어워드 획득!</div>
  //   <div class="txt-2">대단해요! 일일 학습 목표를 누적 25회 달성했어요!</div>
  // </div>
  const divMessage = createMessageBox(
    '일일목표 어워드 획득!',
    `대단해요! 일일 학습 목표를 누적 ${count}회 달성했어요!`,
  )
  popup.divPopupResult.appendChild(divMessage)

  // 오디오 추가
  const audio = new Audio(`${POPUP_AUDIO_PATH}/award.mp3`)

  if (onClick) {
    popup.divContainer.addEventListener('click', onClick)
  }
  return {
    popup,
    attach: (parent) => {
      audio.play()
      parent.appendChild(popup.divContainer)
      popup.divContainer.classList.remove('d-none')
      popup.divContainer.classList.add(
        'd-flex',
        'animate__animated',
        'animate__fadeIn',
      )
      popup.divPopupResult.classList.add('d-none')
      divDailyGoalAwardBadge.classList.add(
        'animate__animated',
        'animate__flipInY',
      )
      setTimeout(() => {
        popup.divPopupResult.classList.remove('d-none')
      }, SHOW_NEXT_ANIMATE_DELAY)
    },
    detach: (parent) => {
      parent.removeChild(popup.divContainer)
    },
  }
}

/**
 * 연속 학습 달성 Popup
 */
function createStreakPopup(onClick?: () => void): Popup {
  const popup = createPopupContainer('streak', 'pass')

  // <div class="streak-symbol">
  //   <dotlottie-player
  //     src="src/lottie/streak_symbol.json"
  //     background="transparent"
  //     speed="1"
  //     style="width: fit-content; height: 250px"
  //     loop
  //     autoplay></dotlottie-player>
  // </div>
  const divStreakSymbol = div({ className: 'streak-symbol' })
  const lottiePlayer = document.createElement('dotlottie-player')
  lottiePlayer.setAttribute('style', 'width: fit-content; height: 250px;')
  lottiePlayer.setAttribute('src', 'src/lottie/streak_symbol.json')
  lottiePlayer.setAttribute('background', 'transparent')
  lottiePlayer.setAttribute('speed', '1')
  lottiePlayer.setAttribute('loop', 'true')
  lottiePlayer.setAttribute('autoplay', 'true')
  divStreakSymbol.appendChild(lottiePlayer)
  popup.divPopupResult.appendChild(divStreakSymbol)

  // <div class="message-box">
  //   <div class="txt-1">연속학습 달성!</div>
  //   <div class="txt-2">아자아자! 매일 독서 습관이 쌓여가고 있어요!</div>
  // </div>
  const divMessage = createMessageBox(
    '연속학습 달성!',
    '아자아자! 매일 독서 습관이 쌓여가고 있어요!',
  )
  popup.divPopupResult.appendChild(divMessage)

  // 오디오 추가
  const audio = new Audio(`${POPUP_AUDIO_PATH}/streak.mp3`)

  if (onClick) {
    popup.divContainer.addEventListener('click', onClick)
  }
  return {
    popup,
    attach: (parent) => {
      audio.play()
      parent.appendChild(popup.divContainer)
      popup.divContainer.classList.remove('d-none')
      popup.divContainer.classList.add(
        'd-flex',
        'animate__animated',
        'animate__fadeIn',
      )
      popup.divPopupResult.classList.add('d-none')
      setTimeout(() => {
        popup.divPopupResult.classList.remove('d-none')
      }, SHOW_NEXT_ANIMATE_DELAY)
    },
    detach: (parent) => {
      parent.removeChild(popup.divContainer)
    },
  }
}

/**
 * 연속 학습 뱃지 획득 Popup
 * @param day 달성 누적일
 */
function createStreakAwardPopup(day: number, onClick?: () => void): Popup {
  const popup = createPopupContainer('streakAward', 'award')

  // <div class="confetti"></div>
  const divConfetti = createConfetti()
  popup.divPopupResult.appendChild(divConfetti)

  // <div id="streakAwardBadge" class="streak-award-badge"></div>
  const divStreakAwardBadge = div({
    id: 'streakAwardBadge',
    className: 'streak-award-badge',
  })
  const streakAwardImage = `${STREAK_AWARD_IMAGE_PATH}/badge_${day}days.svg`
  divStreakAwardBadge.style.backgroundImage = `url("${streakAwardImage}")`
  popup.divPopupResult.appendChild(divStreakAwardBadge)

  // <div class="message-box">
  //   <div class="txt-1">연속학습 어워드 획득!</div>
  //   <div class="txt-2">멋져요! 연속학습을 누적 20회 달성했어요!</div>
  // </div>
  const divMessage = createMessageBox(
    '연속학습 어워드 획득!',
    `멋져요! 연속학습을 누적 ${day}회 달성했어요!`,
  )
  popup.divPopupResult.appendChild(divMessage)

  // 오디오 추가
  const audio = new Audio(`${POPUP_AUDIO_PATH}/award.mp3`)
  if (onClick) {
    popup.divContainer.addEventListener('click', onClick)
  }
  return {
    popup,
    attach: (parent) => {
      audio.play()
      parent.appendChild(popup.divContainer)
      popup.divContainer.classList.remove('d-none')
      popup.divContainer.classList.add(
        'd-flex',
        'animate__animated',
        'animate__fadeIn',
      )
      popup.divPopupResult.classList.add('d-none')
      divStreakAwardBadge.classList.add('animate__animated', 'animate__flipInY')
      setTimeout(() => {
        popup.divPopupResult.classList.remove('d-none')
      }, SHOW_NEXT_ANIMATE_DELAY)
    },
    detach: (parent) => {
      parent.removeChild(popup.divContainer)
    },
  }
}

/**
 * 신규 리딩유닛 스토리 Open Popup
 * @param storyPath 신규 리딩유닛 스토리 이미지
 */
function createNewReadingUnitStoryPopup(
  storyImage: string,
  onClick?: () => void,
): Popup {
  const popup = createPopupContainer('friendsStory', 'pass')

  // <div id="friendsStoryCard" class="friends-story-card"></div>
  const divFriendsStoryCard = div({
    id: 'friendsStoryCard',
    className: 'friends-story-card',
  })

  divFriendsStoryCard.style.backgroundImage = `url("${storyImage}")`
  popup.divPopupResult.appendChild(divFriendsStoryCard)

  // <div class="message-box">
  //   <div class="txt-1">새로운 성장 스토리 잠금해제!</div>
  //   <div class="txt-2">퀘스트 메뉴에서 확인해 보세요!</div>
  // </div>
  const divMessage = createMessageBox(
    '새로운 성장 스토리 잠금해제!',
    '퀘스트 메뉴에서 확인해 보세요!',
  )
  popup.divPopupResult.appendChild(divMessage)

  // 오디오 추가
  const audio = new Audio(`${POPUP_AUDIO_PATH}/new-friends-story.mp3`)

  if (onClick) {
    popup.divContainer.addEventListener('click', onClick)
  }
  return {
    popup,
    attach: (parent) => {
      audio.play()
      parent.appendChild(popup.divContainer)
      popup.divContainer.classList.remove('d-none')
      popup.divContainer.classList.add(
        'd-flex',
        'animate__animated',
        'animate__fadeIn',
      )
      popup.divPopupResult.classList.add('d-none')
      divFriendsStoryCard.classList.add('animate__animated', 'animate__zoomIn')
      setTimeout(() => {
        popup.divPopupResult.classList.remove('d-none')
        popup.divPopupResult.classList.add(
          'animate__animated',
          'animate__zoomIn',
        )
      }, SHOW_NEXT_ANIMATE_DELAY)
    },
    detach: (parent) => {
      parent.removeChild(popup.divContainer)
    },
  }
}

/**
 * 레벨마스터 획득 Popup
 * @param level 마스터한 레벨
 * @returns
 */
function createLevelMasterPopup(level: string, onClick?: () => void): Popup {
  const popup = createPopupContainer('levelMaster', 'award')

  // <div class="confetti"></div>
  const divConfetti = createConfetti()
  popup.divPopupResult.appendChild(divConfetti)

  // <div id="levelMasterBadge" class="level-master-badge"></div>
  const divLevelMasterBadge = div({
    id: 'levelMasterBadge',
    className: 'level-master-badge',
  })
  let lv = level.toLocaleLowerCase()
  const levelMasterImage = `${LEVEL_MASTER_IMAGE_PATH}/level_${lv}.svg`
  divLevelMasterBadge.style.backgroundImage = `url("${levelMasterImage}")`
  popup.divPopupResult.appendChild(divLevelMasterBadge)

  // <div class="message-box">
  //   <div class="txt-1">레벨 마스터 배지 획득!</div>
  //   <div class="txt-2">훌륭해요! 이 레벨의 수준을 모두 마스터했어요!</div>
  // </div>
  const divMessage = createMessageBox(
    '레벨 마스터 배지 획득!',
    `훌륭해요! ${level} 레벨의 수준을 모두 마스터했어요!`,
  )
  popup.divPopupResult.appendChild(divMessage)

  // 오디오 추가
  const audio = new Audio(`${POPUP_AUDIO_PATH}/award.mp3`)

  if (onClick) {
    popup.divContainer.addEventListener('click', onClick)
  }
  return {
    popup,
    attach: (parent) => {
      audio.play()
      parent.appendChild(popup.divContainer)
      popup.divContainer.classList.remove('d-none')
      popup.divContainer.classList.add(
        'd-flex',
        'animate__animated',
        'animate__fadeIn',
      )
      popup.divPopupResult.classList.add('d-none')
      divLevelMasterBadge.classList.add(
        'animate__animated',
        'animate__fadeInUp',
      )
      setTimeout(() => {
        popup.divPopupResult.classList.remove('d-none')
        popup.divPopupResult.classList.add(
          'animate__animated',
          'animate__zoomIn',
        )
      }, SHOW_NEXT_ANIMATE_DELAY)
    },
    detach: (parent) => {
      parent.removeChild(popup.divContainer)
    },
  }
}

/**
 * 독서왕 수상 달성 Popup
 * @param challenge 독서왕 수상
 */
function createChallengePopup(challenge: string, onClick?: () => void): Popup {
  const popup = createPopupContainer('challengeAward', 'challenge-award')

  const divConfetti = createConfetti()
  popup.divPopupResult.appendChild(divConfetti)

  // <div id="challengeAwardBadge" class="challenge-award-badge"></div>
  const divChallengeAwardBadge = div({
    id: 'challengeAwardBadge',
    className: 'challenge-award-badge',
  })
  let challengeImage = `${CHALLENGE_AWARD_IMAGE_PATH}/award_sungsil.svg`
  if (challenge === '1') {
    challengeImage = `${CHALLENGE_AWARD_IMAGE_PATH}/award_daesang.svg`
  } else if (challenge === '2') {
    challengeImage = `${CHALLENGE_AWARD_IMAGE_PATH}/award_choiwoosu.svg`
  } else if (challenge === '3') {
    challengeImage = `${CHALLENGE_AWARD_IMAGE_PATH}/award_woosu.svg`
  }
  divChallengeAwardBadge.style.backgroundImage = `url("${challengeImage}")`
  popup.divPopupResult.appendChild(divChallengeAwardBadge)

  // <div class="message-box">
  //   <div class="txt-1">영어독서왕 챌린지 어워드 획득!</div>
  //   <div class="txt-2">축하합니다! 영어독서왕에 등극하셨어요!</div>
  // </div>
  const divMessage = createMessageBox(
    '영어독서왕 챌린지 어워드 획득!',
    '축하합니다! 영어독서왕에 등극하셨어요!',
  )
  popup.divPopupResult.appendChild(divMessage)

  // 오디오 추가
  const audio = new Audio(`${POPUP_AUDIO_PATH}/award-challenge.wav`)

  if (onClick) {
    popup.divContainer.addEventListener('click', onClick)
  }
  return {
    popup,
    attach: (parent) => {
      audio.play()
      parent.appendChild(popup.divContainer)
      popup.divContainer.classList.remove('d-none')
      popup.divContainer.classList.add(
        'd-flex',
        'animate__animated',
        'animate__fadeIn',
      )
      popup.divPopupResult.classList.add('d-none')
      divChallengeAwardBadge.classList.add(
        'animate__animated',
        'animate__fadeInUp',
      )
      setTimeout(() => {
        popup.divPopupResult.classList.remove('d-none')
        popup.divPopupResult.classList.add(
          'animate__animated',
          'animate__zoomIn',
        )
      }, SHOW_NEXT_ANIMATE_DELAY)
    },
    detach: (parent) => {
      parent.removeChild(popup.divContainer)
    },
  }
}

/* ================================================ *
 * DOM 생성 유틸리티 함수
 * ================================================ */

/**
  <div id='@id'> -> popup (root)
    <div class='result-popup d-none'></div> -> popup result (body)
    <div class='bg-effect @id'></div> -> effect (bg)
  </div>
*/
function createPopupContainer(id: string, effectId?: string) {
  const divContainer = div({ id, className: 'd-none' })
  const divPopupResult = div({
    id: `${id}Popup`,
    className: 'result-popup',
  })
  const divEffect = div({ className: `bg-effect ${effectId || id}` })

  divContainer.appendChild(divPopupResult)
  divContainer.appendChild(divEffect)
  return {
    divContainer,
    divPopupResult,
    divEffect,
  }
}

/** 
  <div class="confetti"></div>
*/
function createConfetti() {
  return div({ className: 'confetti' })
}

/**
 *
  <div class="message-box">
    <div class="txt-1">{title}</div>
    <div class="txt-2">{message}</div>
  </div>
*/
function createMessageBox(title: string, message: string) {
  const divMessageBox = div({ className: 'message-box' })
  const divBoxTitle = div({ className: 'txt-1', text: title })
  const divBoxMessage = div({ className: 'txt-2', text: message })

  divMessageBox.appendChild(divBoxTitle)
  divMessageBox.appendChild(divBoxMessage)
  return divMessageBox
}

// div generator function
function div(attr?: { id?: string; className?: string; text?: string }) {
  const div = document.createElement('div')
  if (!attr) {
    return div
  }
  if (attr.id) {
    div.id = attr.id
  }
  if (attr.className) {
    div.className = attr.className
  }
  if (attr.text) {
    div.textContent = attr.text
  }
  return div
}
