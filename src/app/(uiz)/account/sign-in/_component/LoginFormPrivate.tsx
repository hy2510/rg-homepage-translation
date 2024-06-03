'use client'

import { useApplicationType } from '@/app/_context/AppContext'
import { useLoginAction } from '@/app/_context/LoginContext'
import SITE_PATH from '@/app/site-path'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ReactNode, useRef, useState } from 'react'
import { Button, TextField } from '@/ui/common/common-components'
import { useStyle } from '@/ui/context/StyleContext'

const STYLE_ID = 'page_sign_in'

export default function LoginFormPrivate({
  customHeader,
}: {
  customHeader?: ReactNode
}) {
  const style = useStyle(STYLE_ID)

  const router = useRouter()
  const isAppType = useApplicationType() === 'app'
  const onLogin = useLoginAction()

  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const loginIdInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)

  const isLoginDisabled = !loginId || !password

  const requestLogin = (id: string, password: string) => {
    onLogin({
      id,
      password,
      isSavePassword: false,
      onError: (code, message, redirect) => {
        if (code === 3000) {
        } else if (code === 2001 && redirect) {
          router.replace(redirect)
        }
        alert(message)
        passwordInputRef.current?.focus()
      },
    })
  }

  return (
    <>
      <div className={style.log_in_personal_member}>
        {customHeader}
        <TextField
          ref={loginIdInputRef}
          id={'user-id'}
          hint={'아이디 (또는 e-mail)'}
          onTextChange={(text) => setLoginId(text)}
          value={loginId}
          onKeyDown={(e) => {
            if (e.key.toLowerCase() === 'enter') {
              if (!isLoginDisabled) {
                requestLogin(loginId, password)
              } else if (loginId && !password) {
                passwordInputRef?.current?.focus()
              }
            }
          }}
        />
        <TextField
          ref={passwordInputRef}
          id={'user-passowrd'}
          hint={'비밀번호'}
          password
          value={password}
          onTextChange={(text) => setPassword(text)}
          onKeyDown={(e) => {
            if (e.key.toLowerCase() === 'enter') {
              if (!isLoginDisabled) {
                requestLogin(loginId, password)
              } else if (!loginId && password) {
                loginIdInputRef?.current?.focus()
              }
            }
          }}
        />
        <Button
          shadow={!isLoginDisabled}
          color={isLoginDisabled ? 'gray' : 'red'}
          onClick={() => {
            if (!isLoginDisabled) {
              requestLogin(loginId, password)
            }
          }}>
          로그인
        </Button>
        <div className={style.row_box}>
          <Link href={SITE_PATH.ACCOUNT.FORGOT_ID}>아이디 찾기</Link>
          <Link href={SITE_PATH.ACCOUNT.FORGOT_PASSWORD}>비밀번호 찾기</Link>
          {isAppType && <Link href={SITE_PATH.ACCOUNT.SIGN_UP}>회원가입</Link>}
        </div>
        <div className={style.comment}>
          ❗️ 학교나 학원에서 사용 안내를 받은 경우, 그룹 회원 탭에서 검색 후
          로그인 하세요.
        </div>
      </div>
    </>
  )
}
