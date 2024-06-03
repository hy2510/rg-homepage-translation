'use client'

import SITE_PATH from '@/app/site-path'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useFetchForgotId } from '@/client/store/account/forgot/hook'
import { ForgotIdResponse } from '@/repository/client/account/forgot-id'
import {
  BackLink,
  Button,
  Nav,
  NavItem,
  TextField,
} from '@/ui/common/common-components'
import BoxUserInfo from '@/ui/modules/account-components/box-user-info'

type Step = 1 | 2
type FindType = 'Email' | 'Phone'
export default function ForgotIdPrivate({
  style,
}: {
  style: Record<string, string>
}) {
  const [step, setStep] = useState<Step>(1)
  const [target, setTarget] = useState<FindType>('Phone')

  const [findResult, setFindResult] = useState<ForgotIdResponse>([])

  const forgotId = useFetchForgotId()
  const onFindId = (keyword: string) => {
    forgotId.fetch({
      type: target,
      keyword,
      callback: (data) => {
        if (data.success) {
          if (data.payload) {
            setFindResult([...data.payload])
            setStep(2)
          }
        } else if (data.error) {
          const error = data.error as { code: number; message: string }
          if (error.code === 1000) {
            alert('가입된 회원이 아닙니다.')
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
    <main className={style.forgot_id}>
      <BackLink
        onClick={() => {
          if (step === 1) {
            router.back()
          } else {
            setStep(1)
          }
        }}>
        아이디 찾기
      </BackLink>
      {step === 1 && (
        <Step1ForgotIdInput
          tab={target}
          onFindId={onFindId}
          onChangeTab={(tab) => setTarget(tab)}
          style={style}
        />
      )}
      {step === 2 && (
        <Step2FindIdResult result={findResult} onClickLogin={onClickLogin} />
      )}
    </main>
  )
}

function Step1ForgotIdInput({
  tab,
  onChangeTab,
  onFindId,
  style,
}: {
  tab: FindType
  onChangeTab: (tab: FindType) => void
  onFindId: (keyword: string) => void
  style: Record<string, string>
}) {
  const [email, setEmail] = useState<string>('')
  const [phoneNumber, setPhoneNumber] = useState<string>('')

  const comment =
    tab === 'Phone'
      ? '* 회원 정보에 등록한 연락처(휴대전화 번호)를 입력해 주세요.'
      : '* 회원 정보에 등록한 E-Mail 주소를 입력해 주세요.'
  return (
    <>
      <div style={{ overflow: 'auto' }}>
        <Nav>
          <NavItem
            active={tab == 'Phone'}
            onClick={() => {
              onChangeTab('Phone')
            }}>
            연락처로 찾기
          </NavItem>
          <NavItem
            active={tab == 'Email'}
            onClick={() => {
              onChangeTab('Email')
            }}>
            E-Mail로 찾기
          </NavItem>
        </Nav>
      </div>
      <div className={style.comment}>{comment}</div>
      {tab == 'Phone' && (
        <TextField
          hint={'연락처'}
          value={phoneNumber}
          onTextChange={(text) => setPhoneNumber(text)}
        />
      )}
      {tab == 'Email' && (
        <TextField
          hint={'E-Mail'}
          value={email}
          onTextChange={(text) => setEmail(text)}
        />
      )}
      <Button
        shadow
        onClick={() => {
          const keyword = tab === 'Phone' ? phoneNumber : email
          onFindId(keyword)
        }}>
        찾기
      </Button>
    </>
  )
}

function Step2FindIdResult({
  result,
  onClickLogin,
}: {
  result: ForgotIdResponse
  onClickLogin: () => void
}) {
  return (
    <>
      {result.map((item, i) => {
        return (
          <BoxUserInfo
            key={`${item.loginId}-${i}`}
            datas={[
              { label: '이름', value: item.studentName },
              { label: '아이디', value: item.loginId },
              { label: '가입일', value: item.registDate },
            ]}
          />
        )
      })}
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
