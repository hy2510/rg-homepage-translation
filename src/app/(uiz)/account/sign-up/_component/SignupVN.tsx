'use client'

import { useLoginAction } from '@/app/_context/LoginContext'
import SITE_PATH from '@/app/site-path'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  useFetchSignupEmailCertification,
  useFetchSignupEmailConfirm_VN,
  useFetchSignupPhoneCertification_VN,
  useFetchSignupPhoneConfirm_VN,
  useFetchSignup_VN,
} from '@/client/store/account/signup/hook'
import { useStudentIsLogin } from '@/client/store/student/info/selector'
import {
  AlertBar,
  BackLink,
  Button,
  TextField,
} from '@/ui/common/common-components'
import {
  BASE_TIME,
  CheckField,
  isValidateEmailVn,
  isValidatePasswordVn,
  isValidateStudentName,
  useCountDown,
} from './Signup'

type Step = 1 | 2 | 3 | 4
type SignupParams = {
  email: string
  studentName: string
  password: string
  repassword: string
  checkAge: boolean
  checkPolicy: boolean
  checkTerms: boolean
  phone: string
}
export default function SignupVN({ style }: { style: Record<string, string> }) {
  const isLogin = useStudentIsLogin()

  const [step, setStep] = useState<Step>(1)

  const [signupParams, setSignupParams] = useState<SignupParams>({
    email: '',
    studentName: '',
    password: '',
    repassword: '',
    checkAge: false,
    checkPolicy: false,
    checkTerms: false,
    phone: '',
  })

  const onLogin = useLoginAction()
  const [loginAction, setLoginAction] = useState<boolean>(false)

  const emailCert = useFetchSignupEmailCertification()
  const onValidateSignupParams = (params: SignupParams) => {
    if (!params.studentName) {
      alert('학생 이름을 입력해주세요.')
      return
    }
    if (!isValidateStudentName(params.studentName)) {
      alert(
        '비밀번호는 영문 대문자, 영문 소문자, 숫자, 특수문자 조합 8~20글자로 입력해 주세요.',
      )
      return
    }
    if (!params.email) {
      alert('E-Mail을 입력해주세요.')
      return
    }
    if (!isValidateEmailVn(params.email)) {
      alert('E-Mail을 형식에 맞게 입력해주세요.')
      return
    }
    if (!params.password) {
      alert('비밀번호를 입력해주세요.')
      return
    }
    if (!isValidatePasswordVn(params.password)) {
      alert('비밀번호를 형식에 맞게 입력해주세요.')
      return
    }
    if (!params.repassword) {
      alert('비밀번호를 다시 입력해주세요.')
      return
    }
    if (params.password !== params.repassword) {
      alert('비밀번호가 일치하지 않습니다.')
      return
    }
    if (!params.checkAge) {
      alert('만 14세 이상만 가입 가능합니다.')
      return
    }
    if (!params.checkPolicy) {
      alert('이용약관은 필수 동의항목입니다.')
      return
    }
    if (!params.checkTerms) {
      alert('개인정보 처리방침은 필수 동의항목입니다.')
      return
    }

    emailCert.fetch({
      email: params.email,
      password: params.password,
      studentName: params.studentName,
      callback: (data) => {
        if (data.success) {
          setSignupParams(params)
          setStep(2)
        } else if (data.error) {
          const error = data.error as { extra: string }
          if (error.extra) {
            const extra = JSON.parse(error.extra)
            const code = extra.code || -1
            if (code === 1) {
              alert('다른 사용자가 사용중인 Email입니다.')
            } else if (code === 2) {
              alert(
                'Email을 발송할 수 없습니다. 계속해서 이 메시지가 나오면 고객센터로 문의하여 주십시오.',
              )
            }
          }
        }
      },
    })
  }
  const onRetryRequestEmailCode = () => {
    onValidateSignupParams(signupParams)
  }

  const emailConfirm = useFetchSignupEmailConfirm_VN()
  const onEmailValidateCode = (authCode: string) => {
    // TODO : 회원가입 이메일 인증

    emailConfirm.fetch({
      email: signupParams.email,
      authCode,
      callback: (data) => {
        if (data.success) {
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
                '회원가입 오류가 발생하였습니다. 계속해서 이 메시지가 나오면 고객센터로 문의하여 주십시오.',
              )
            }
          }
        } else {
          alert('fail')
        }
      },
    })
  }

  const phoneCert = useFetchSignupPhoneCertification_VN()
  const onRequestPhoneCode = (phone: string) => {
    phoneCert.fetch({
      phone,
      callback: (data) => {
        if (data.success) {
          setSignupParams({ ...signupParams, phone })
          setStep(4)
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
                '회원가입 오류가 발생하였습니다. 계속해서 이 메시지가 나오면 고객센터로 문의하여 주십시오.',
              )
            }
          }
        } else {
          alert('fail')
        }
      },
    })
  }
  const onRetryRequestPhoneCode = () => {
    onRequestPhoneCode(signupParams.phone)
  }

  const phoneConfirm = useFetchSignupPhoneConfirm_VN()
  const onPhoneValidateCode = (authCode: string) => {
    phoneConfirm.fetch({
      phone: signupParams.phone,
      authCode,
      callback: (data) => {
        if (data.success) {
          onSignup()
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
                '회원가입 오류가 발생하였습니다. 계속해서 이 메시지가 나오면 고객센터로 문의하여 주십시오.',
              )
            }
          }
        } else {
          alert('fail')
        }
      },
    })
  }

  const signup = useFetchSignup_VN()
  const onSignup = () => {
    signup.fetch({
      phone: signupParams.phone,
      email: signupParams.email,
      callback: (data) => {
        if (data.success) {
          setLoginAction(true)
          onLogin({
            id: signupParams.email,
            password: signupParams.password,
            redirectPath: SITE_PATH.ACCOUNT.SIGN_UP_WELCOME,
            onError: (err) => {
              alert('오류가 발생하였습니다.')
            },
          })
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
                '회원가입 오류가 발생하였습니다. 계속해서 이 메시지가 나오면 고객센터로 문의하여 주십시오.',
              )
            }
          }
        } else {
          alert('fail')
        }
      },
    })
  }

  const router = useRouter()

  if (isLogin && !loginAction) {
    return (
      <main>
        <BackLink onClick={() => router.back()}>오류</BackLink>
        <div>
          <div style={{ marginTop: '1rem' }}>잘못된 접근입니다.</div>
        </div>
      </main>
    )
  }

  return (
    <>
      {step === 1 && (
        <Step1SignupInputVN
          onClickBack={() => {
            router.back()
          }}
          formData={signupParams}
          onFormUpdate={(formData) => onValidateSignupParams(formData)}
          style={style}
        />
      )}
      {step === 2 && (
        <Step2EmailAuth
          userEmail={signupParams.email}
          onPrevStep={() => setStep(1)}
          onValidateCode={onEmailValidateCode}
          onReSendCode={onRetryRequestEmailCode}
          style={style}
        />
      )}
      {step === 3 && (
        <Step3PhoneInput
          onPrevStep={() => setStep(1)}
          onRequestPhoneCode={onRequestPhoneCode}
          style={style}
        />
      )}
      {step === 4 && (
        <Step4PhoneAuth
          userPhone={signupParams.phone}
          onPrevStep={() => setStep(1)}
          onValidateCode={onPhoneValidateCode}
          onReSendCode={onRetryRequestPhoneCode}
          style={style}
        />
      )}
    </>
  )
}

function Step1SignupInputVN({
  onClickBack,
  formData,
  onFormUpdate,
  style,
}: {
  onClickBack?: () => void
  formData: SignupParams
  onFormUpdate: (formData: SignupParams) => void
  style: Record<string, string>
}) {
  const [email, setEmail] = useState(formData.email)
  const [studentName, setStudentName] = useState(formData.studentName)
  const [password, setPassword] = useState(formData.password)
  const [repassword, setRepassword] = useState(formData.repassword)
  const [checkAge, setCheckAge] = useState(formData.checkAge)
  const [checkPolicy, setCheckPolicy] = useState(formData.checkPolicy)
  const [checkTerms, setCheckTerms] = useState(formData.checkTerms)

  const [isWarningStudentName, setWarningStudentName] = useState(false)
  const [isWarningEmail, setWarningEmail] = useState(false)
  const [isWarningPassword, setWarningPassword] = useState(false)
  const [isWarningRepassword, setWarningRepassword] = useState(false)

  return (
    <main className={style.step1}>
      <BackLink onClick={() => onClickBack && onClickBack()}>
        리딩게이트 회원가입
      </BackLink>
      <AlertBar>
        [웰컴 혜택] 가입일로부터 7일간 레벨테스트를 제외한 모든 학습 무료 사용!
      </AlertBar>
      <div className={style.sign_up_form}>
        <div className={style.comment}>
          * 리딩게이트 학습을 하게될 학생의 이름을 입력해 주세요.
        </div>
        <TextField
          hint={'학생 이름'}
          value={studentName}
          onTextChange={(text) => setStudentName(text)}
          onFocusIn={(text) => setWarningStudentName(false)}
          onFocusOut={(text) =>
            setWarningStudentName(
              text.length > 1 && !isValidateStudentName(text),
            )
          }
        />
        {isWarningStudentName && (
          <span style={{ color: 'red' }}>
            {`[!] 학생 이름을 올바르게 입력해 주세요.`}
          </span>
        )}
        <div className={style.comment}>
          * 로그인 ID로 사용할 E-Mail 주소를 입력해 주세요.
        </div>
        <TextField
          hint={'E-Mail (예: student@readinggate.com)'}
          value={email}
          onTextChange={(text) => setEmail(text)}
          onFocusIn={(text) => setWarningEmail(false)}
          onFocusOut={(text) =>
            setWarningEmail(text.length > 0 && !isValidateEmailVn(text))
          }
        />
        {isWarningEmail && (
          <span
            style={{
              color: 'red',
            }}>{`[!] E-Mail을 올바르게 입력해 주세요.`}</span>
        )}
        <div className={style.comment}>
          * 비밀번호는 영문 대문자, 영문 소문자, 숫자, 특수문자 조합 8~20글자로
          입력해 주세요.
        </div>
        <TextField
          hint={'비밀번호'}
          password
          value={password}
          onTextChange={(text) => setPassword(text)}
          onFocusIn={(text) => setWarningPassword(false)}
          onFocusOut={(text) =>
            setWarningPassword(text.length > 0 && !isValidatePasswordVn(text))
          }
        />
        {isWarningPassword && (
          <span
            style={{
              color: 'red',
            }}>{`[!] 비밀번호를 올바르게 입력해 주세요.`}</span>
        )}
        <div className={style.comment}>
          * 입력한 비밀번호를 한번 더 입력해 주세요.
        </div>
        <TextField
          hint={'비밀번호 확인'}
          password
          value={repassword}
          onTextChange={(text) => setRepassword(text)}
          onFocusIn={(text) => {
            setWarningRepassword(false)
            if (text !== password) {
              setRepassword('')
            }
          }}
          onFocusOut={(text) =>
            setWarningRepassword(text.length > 0 && text !== password)
          }
        />
        {isWarningRepassword && (
          <span
            style={{
              color: 'red',
            }}>{`[!] 비밀번호를 올바르게 입력해 주세요.`}</span>
        )}
        <CheckField
          style={style}
          value={checkAge}
          onCheckedChange={(isChecked) => setCheckAge(isChecked)}>
          [필수] 본 회원가입 작성자는 만 14세 이상입니다.
        </CheckField>
        <CheckField
          style={style}
          value={checkPolicy}
          onCheckedChange={(isChecked) => setCheckPolicy(isChecked)}>
          [필수]{' '}
          <span
            style={{ color: '#0062e3', cursor: 'pointer', fontWeight: '500' }}>
            이용약관
          </span>
          을 확인하였으며 해당 내용에 동의 합니다.
        </CheckField>
        <CheckField
          style={style}
          value={checkTerms}
          onCheckedChange={(isChecked) => setCheckTerms(isChecked)}>
          [필수]{' '}
          <span
            style={{
              color: '#0062e3',
              cursor: 'pointer',
              fontWeight: '500',
            }}>
            개인정보 처리방침
          </span>
          을 확인하였으며 해당 내용에 동의 합니다.
        </CheckField>
        <Button
          shadow
          onClick={() => {
            onFormUpdate &&
              onFormUpdate({
                email,
                studentName,
                password,
                repassword,
                checkAge,
                checkPolicy,
                checkTerms,
                phone: '',
              })
          }}>
          계속하기
        </Button>
      </div>
    </main>
  )
}

function Step2EmailAuth({
  userEmail,
  onPrevStep,
  onValidateCode,
  onReSendCode,
  style,
}: {
  userEmail?: string
  onPrevStep?: () => void
  onValidateCode?: (code: string) => void
  onReSendCode?: () => void
  style: Record<string, string>
}) {
  const [authCode, setAuthCode] = useState('')

  const { currentTime, reset } = useCountDown({
    timeset: BASE_TIME,
    autoStart: true,
  })

  const minute = Math.floor(currentTime / 60)
  const second = currentTime % 60

  const onCodeCheck = () => {
    if (currentTime > 0 && authCode.length > 0) {
      onValidateCode && onValidateCode(authCode)
    }
  }

  return (
    <main className={style.step2}>
      <BackLink onClick={() => onPrevStep && onPrevStep()}>본인인증</BackLink>
      <div className={style.sending_message}>
        <b>* {userEmail}</b>
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
              onReSendCode && onReSendCode()
              reset()
            }}>
            인증코드 재전송하기
          </div>
        </div>
      )}
    </main>
  )
}

function Step3PhoneInput({
  onPrevStep,
  onRequestPhoneCode,
  style,
}: {
  onPrevStep?: () => void
  onRequestPhoneCode?: (phone: string) => void
  style: Record<string, string>
}) {
  const [phoneNumber, setPhoneNumber] = useState('')

  const onRequestCode = () => {
    if (phoneNumber.length > 0) {
      onRequestPhoneCode && onRequestPhoneCode(phoneNumber)
    }
  }

  return (
    <main className={style.step2}>
      <BackLink onClick={() => onPrevStep && onPrevStep()}>본인인증</BackLink>

      <TextField
        hint={'전화번호 입력'}
        value={phoneNumber}
        maxLength={13}
        onTextChange={(text) => setPhoneNumber(text)}
      />
      <Button
        shadow={phoneNumber.length > 5}
        onClick={onRequestCode}
        color={phoneNumber.length <= 5 ? 'gray' : undefined}>
        인증번호 요청
      </Button>
    </main>
  )
}

function Step4PhoneAuth({
  userPhone,
  onPrevStep,
  onValidateCode,
  onReSendCode,
  style,
}: {
  userPhone: string
  onPrevStep?: () => void
  onValidateCode?: (code: string) => void
  onReSendCode?: () => void
  style: Record<string, string>
}) {
  const [authCode, setAuthCode] = useState('')

  const { currentTime, reset } = useCountDown({
    timeset: BASE_TIME,
    autoStart: true,
  })

  const minute = Math.floor(currentTime / 60)
  const second = currentTime % 60

  const onCodeCheck = () => {
    if (currentTime > 0 && authCode.length > 0) {
      onValidateCode && onValidateCode(authCode)
    }
  }

  return (
    <main className={style.step2}>
      <BackLink onClick={() => onPrevStep && onPrevStep()}>본인인증</BackLink>
      <div className={style.sending_message}>
        <b>* {userPhone}</b>
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
              onReSendCode && onReSendCode()
              reset()
            }}>
            인증코드 재전송하기
          </div>
        </div>
      )}
    </main>
  )
}
