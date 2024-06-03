'use client'

import SITE_PATH from '@/app/site-path'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  useFetchForgotPassword,
  useFetchForgotPasswordConfirm,
} from '@/client/store/account/forgot/hook'
import {
  BackLink,
  Button,
  Nav,
  NavItem,
  TextField,
} from '@/ui/common/common-components'

type Step = 1 | 2 | 3
type FindType = 'Email' | 'Id'
export default function ForgotPasswordPrivate({
  style,
}: {
  style: Record<string, string>
}) {
  const [step, setStep] = useState<Step>(1)
  const [target, setTarget] = useState<FindType>('Email')

  const [sendEmail, setSendEmail] = useState<string>('')
  const [keyword, setKeyword] = useState<string>('')
  const [authCodeTime, setAuthCodeTime] = useState<number>(Date.now())

  const forgotPw = useFetchForgotPassword()
  const onRequestAuthCode = (keyword: string) => {
    setKeyword(keyword)
    forgotPw.fetch({
      type: target,
      keyword,
      callback: (data) => {
        if (data.success) {
          if (data.payload) {
            setSendEmail(data.payload.email)
            setAuthCodeTime(Date.now())
            setStep(2)
          }
        } else if (data.error) {
          const error = data.error as { extra: string }
          if (error.extra) {
            const extra = JSON.parse(error.extra)
            const code = extra.code || -1
            if (code === 1) {
              alert('사용자 정보를 찾을 수 없습니다.')
            } else if (code === 2) {
              alert(
                '동일한 이메일을 여러 계정에서 사용중이라 이메일인증을 할 수 없습니다. 고객센터로 문의하여 주십시오.',
              )
            } else if (code === 3) {
              alert('이메일 정보를 찾을 수 없습니다.')
            } else if (code === 4) {
              alert('이메일 정보가 잘못되었습니다.')
            } else if (code === 9) {
              alert(
                '이메일을 발송하지 못하였습니다. 계속해서 이 메시지가 나오면 고객센터로 문의하여 주십시오.',
              )
            }
          }
        }
      },
    })
  }

  const forgotPWConfirm = useFetchForgotPasswordConfirm()
  const onAuthPassword = (authCode: string) => {
    forgotPWConfirm.fetch({
      keyword,
      authCode,
      callback: (data) => {
        if (data.success && data.payload) {
          setStep(3)
        } else if (data.error) {
          const error = data.error as { extra: string }
          if (error.extra) {
            const extra = JSON.parse(error.extra)
            const code = extra.code || -1
            if (code === 1) {
              alert('인증 정보가 올바르지 않습니다.')
            } else if (code === 2) {
              alert('인증 유효 시간이 만료되었습니다.')
            } else if (code === 3) {
              alert(
                '비밀번호 찾기 오류가 발생하였습니다. 계속해서 이 메시지가 나오면 고객센터로 문의하여 주십시오.',
              )
            }
          }
        }
      },
    })
  }

  const onClickLogin = () => {
    router.push(SITE_PATH.ACCOUNT.SIGN_IN)
  }

  const router = useRouter()

  return (
    <>
      <BackLink
        onClick={() => {
          if (step === 1) {
            router.back()
          } else {
            setStep(1)
          }
        }}>
        비밀번호 찾기
      </BackLink>
      {step === 1 && (
        <Step1ForgotPasswordInput
          tab={target}
          onRequestAuthCode={onRequestAuthCode}
          onChangeTab={(tab) => setTarget(tab)}
          style={style}
        />
      )}
      {step === 2 && (
        <Step2AuthCodeInput
          codeTime={authCodeTime}
          sendEmail={sendEmail}
          onValidateCode={onAuthPassword}
          onRetryAuthCode={() => onRequestAuthCode(keyword)}
          style={style}
        />
      )}
      {step === 3 && (
        <Step3FindPasswordResult
          sendEmail={sendEmail}
          onClickLogin={onClickLogin}
          style={style}
        />
      )}
    </>
  )
}

function Step1ForgotPasswordInput({
  tab,
  onChangeTab,
  onRequestAuthCode,
  style,
}: {
  tab: FindType
  onChangeTab: (tab: FindType) => void
  onRequestAuthCode: (keyword: string) => void
  style: Record<string, string>
}) {
  const [email, setEmail] = useState<string>('')
  const [loginId, setLoginId] = useState<string>('')

  const comment =
    tab === 'Email'
      ? '* 회원 정보에 등록한 E-Mail 주소를 입력해 주세요.'
      : '* 회원 정보에 등록한 아이디를 입력해 주세요.'

  return (
    <>
      <div style={{ overflow: 'auto' }}>
        <Nav>
          <NavItem
            active={tab == 'Email'}
            onClick={() => {
              onChangeTab('Email')
            }}>
            E-Mail로 찾기
          </NavItem>
          <NavItem
            active={tab == 'Id'}
            onClick={() => {
              onChangeTab('Id')
            }}>
            아이디로 찾기
          </NavItem>
        </Nav>
      </div>
      <div className={style.comment}>{comment}</div>
      {tab == 'Email' && (
        <TextField
          hint={'E-Mail'}
          value={email}
          onTextChange={(text) => setEmail(text)}
        />
      )}
      {tab == 'Id' && (
        <TextField
          hint={'아이디'}
          value={loginId}
          onTextChange={(text) => setLoginId(text)}
        />
      )}
      <Button
        shadow
        onClick={() => {
          const keyword = tab === 'Id' ? loginId : email
          onRequestAuthCode(keyword)
        }}>
        찾기
      </Button>
    </>
  )
}

function Step2AuthCodeInput({
  codeTime,
  sendEmail,
  onValidateCode,
  onRetryAuthCode,
  style,
}: {
  codeTime: number
  sendEmail: string
  onValidateCode: (code: string) => void
  onRetryAuthCode: () => void
  style: Record<string, string>
}) {
  const [authCode, setAuthCode] = useState('')

  const { currentTime, reset } = useCountDown({
    timeset: BASE_TIME,
    autoStart: true,
  })

  useEffect(() => {
    reset()
  }, [codeTime, reset])

  const minute = Math.floor(currentTime / 60)
  const second = currentTime % 60

  const onCodeCheck = () => {
    if (currentTime > 0 && authCode.length > 0) {
      onValidateCode && onValidateCode(authCode)
    }
  }

  return (
    <>
      <div className={style.sending_message}>
        <b>* {sendEmail}</b>
        <span>
          로 인증코드를 발송했습니다. 현 시간 기준, 10분 안에 인증을 완료해
          주세요.
        </span>
      </div>

      <TextField
        hint={'인증코드 입력'}
        value={authCode}
        maxLength={6}
        onTextChange={(text) => setAuthCode(text)}
      />
      <Button
        shadow={currentTime > 0}
        onClick={onCodeCheck}
        color={currentTime <= 0 || authCode.length === 0 ? 'gray' : undefined}>
        인증하기
        {`(${minute > 9 ? minute : `0${minute}`}:${second > 9 ? second : `0${second}`})`}
      </Button>
      {currentTime <= BASE_TIME / 4 && (
        <div className={style.link_button_container}>
          <div
            className={style.link_button}
            onClick={() => {
              onRetryAuthCode()
            }}>
            인증코드 재전송하기
          </div>
        </div>
      )}
    </>
  )
}

function Step3FindPasswordResult({
  sendEmail,
  onClickLogin,
  style,
}: {
  sendEmail: string
  onClickLogin: () => void
  style: Record<string, string>
}) {
  return (
    <>
      <div>
        {sendEmail}로 임시비밀번호를 전송하였습니다. 로그인 후 비밀번호를
        변경하여 사용하시기 바랍니다.
      </div>
      <Button
        shadow
        onClick={() => {
          onClickLogin()
        }}>
        로그인
      </Button>
    </>
  )
}

const BASE_TIME = 60 * 10
function useCountDown({
  timeset,
  autoStart = false,
}: {
  timeset: number
  autoStart?: boolean
}) {
  const [on, setOn] = useState(autoStart)
  const [timeDelta, setTimeDelta] = useState(0)
  const refTimeMemo = useRef<number>(Date.now())

  useEffect(() => {
    let id: NodeJS.Timeout | undefined
    if (on) {
      refTimeMemo.current = Date.now()
      id = setInterval(() => {
        const nowTime = Date.now()
        const timeDelta = Math.floor((nowTime - refTimeMemo.current) / 1000)
        setTimeDelta(timeDelta)
        if (timeDelta >= timeset) {
          setOn(false)
        }
      }, 1000)
    }
    return () => {
      id && clearInterval(id)
    }
  }, [on, timeset])

  const stop = useCallback(() => {
    setOn(false)
  }, [setOn])

  const start = useCallback(() => {
    setOn(true)
  }, [setOn])

  const reset = useCallback(() => {
    refTimeMemo.current = Date.now()
    setOn(true)
  }, [setOn])

  return {
    currentTime: timeset - timeDelta,
    stop,
    start,
    reset,
  }
}
