'use client'

import ClientTo from '@/app/_app/ClientTo'
import LoginForward from '@/app/_app/LoginForward'
import { getLoginExtra, resetLoginExtra } from '@/app/_context/LoginContext'
import SITE_PATH from '@/app/site-path'
import { useState } from 'react'
import { useFetchChangePassword } from '@/client/store/account/signin/hook'
import { Button, TextField } from '@/ui/common/common-components'
import { useStyle } from '@/ui/context/StyleContext'
import { isValidatePassword } from '../sign-up/_component/Signup'

const STYLE_ID = 'page_sign_in'

export default function Page() {
  const style = useStyle(STYLE_ID)

  const [notFound, setNotFound] = useState(false)
  const loginExtra = getLoginExtra()
  if (!notFound && loginExtra?.type !== 'ChangePassword') {
    setNotFound(true)
  }

  const [password, setPassword] = useState('')
  const [repassword, setRepassword] = useState('')
  const [isWarningPassword, setWarningPassword] = useState(false)
  const [isWarningRepassword, setWarningRepassword] = useState(false)
  const [errorRedirect, setErrorRedirect] = useState('')
  const [loginRedirect, setLoginRedirect] = useState('')

  const { fetch: changePassword } = useFetchChangePassword()

  if (notFound) {
    return <div></div>
  }
  if (!loginExtra?.type) {
    return <div>Loading</div>
  }

  const onChangePassword = () => {
    if (!password) {
      alert('비밀번호를 입력해주세요.')
      return
    }
    if (!isValidatePassword(password)) {
      alert('비밀번호는 영문 숫자 조합 8~20글자로 입력해 주세요.')
      return
    }
    if (!repassword) {
      alert('비밀번호를 다시 입력해주세요.')
      return
    }
    if (password !== repassword) {
      alert('비밀번호가 일치하지 않습니다.')
      return
    }
    const hash = loginExtra.hash
    changePassword({
      hash,
      newPassword: password,
      callback: (data) => {
        resetLoginExtra()
        if (data.success) {
          setLoginRedirect(SITE_PATH.HOME.MAIN)
        } else {
          alert('비밀번호 설정에 실패하였습니다.')
          setErrorRedirect(SITE_PATH.ACCOUNT.MAIN)
        }
      },
    })
  }

  if (errorRedirect) {
    return <ClientTo to={errorRedirect} isReplace />
  } else if (loginRedirect) {
    return <LoginForward to={loginRedirect} />
  }

  return (
    <main className={style.sign_in}>
      <div className={style.catchphrase}>
        <div className={style.brand_name}>리딩게이트</div>
        <div className={style.sentence}>읽는 즐거움, 커가는 영어실력</div>
      </div>
      <div className={style.log_in_box}>
        <div className={style.log_in_personal_member}>
          <div>* 비밀번호는 영문 숫자 조합 8~20글자로 입력해 주세요.</div>
          <TextField
            hint={'비밀번호'}
            password
            value={password}
            onTextChange={(text) => setPassword(text)}
            onFocusIn={(text) => setWarningPassword(false)}
            onFocusOut={(text) =>
              setWarningPassword(text.length > 0 && !isValidatePassword(text))
            }
          />
          {isWarningPassword && (
            <span
              style={{
                color: 'red',
              }}>{`[!] 비밀번호를 올바르게 입력해 주세요.`}</span>
          )}
          <div>* 입력한 비밀번호를 한번 더 입력해 주세요.</div>
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
          <Button
            shadow={true}
            onClick={() => {
              onChangePassword()
            }}>
            비밀번호 변경
          </Button>
        </div>
      </div>
    </main>
  )
}
