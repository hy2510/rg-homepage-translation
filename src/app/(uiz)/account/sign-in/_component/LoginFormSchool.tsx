'use client'

import { useCustomerInfo } from '@/app/_context/CustomerContext'
import { useLoginAction } from '@/app/_context/LoginContext'
import SITE_PATH from '@/app/site-path'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ReactNode, useRef, useState } from 'react'
import {
  useFetchClassList,
  useOnLoadClassGroup,
} from '@/client/store/account/class/hook'
import { useFetchFindIdWithClassAndStudentName } from '@/client/store/account/forgot/hook'
import { ClassListResponse } from '@/repository/client/account/class-list'
import { Button, Nav, NavItem, TextField } from '@/ui/common/common-components'
import { useStyle } from '@/ui/context/StyleContext'

const STYLE_ID = 'page_sign_in'

type TabLoginType = 'Id' | 'Class'
export default function LoginFormSchool({
  customHeader,
}: {
  customHeader?: ReactNode
}) {
  const style = useStyle(STYLE_ID)

  const router = useRouter()
  const onLogin = useLoginAction()
  const [tab, setTab] = useState<TabLoginType>('Class')

  const [loginId, setLoginId] = useState('')
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const loginIdInputRef = useRef<HTMLInputElement>(null)
  const userNameInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)

  const classGroupFetch = useOnLoadClassGroup()
  const [classGroup, setClassGroup] = useState<string>('')
  const [classList, setClassList] = useState<ClassListResponse>([])
  const [classOne, setClassOne] = useState<string>('')
  const classListFetch = useFetchClassList()
  const onChangeClassGroup = (classGroupId: string) => {
    if (!classGroupId) {
      return
    }
    setClassGroup(classGroupId)
    classListFetch.fetch({
      classGroupId,
      callback: (data) => {
        if (data.success && data.payload) {
          setClassOne(data.payload[0].classId)
          setClassList(data.payload)
        }
      },
    })
  }

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

  const onRunLogin = ({
    tab,
    id,
    classId,
    studentName,
    password,
  }: {
    tab: TabLoginType
    id?: string
    classId?: string
    studentName?: string
    password: string
  }) => {
    if (tab === 'Id' && !id) {
      return
    }
    if (tab === 'Class' && !classId) {
      return
    }
    if (tab === 'Class' && !studentName) {
      return
    }
    if (!password) {
      return
    }
    if (tab === 'Id') {
      requestLogin(id!!, password)
    } else if (tab === 'Class') {
      onRunClassLogin({
        classId: classId!,
        studentName: studentName!,
        password,
      })
    }
  }

  const findIdFetch = useFetchFindIdWithClassAndStudentName()
  const onRunClassLogin = ({
    classId,
    studentName,
    password,
  }: {
    classId: string
    studentName: string
    password: string
  }) => {
    findIdFetch.fetch({
      classId,
      studentName,
      password,
      callback: (data) => {
        if (data.success && data.payload) {
          if (data.payload.code === 0) {
            const loginId = data.payload.loginId
            requestLogin(loginId, password)
          } else {
            alert(
              '학생정보를 찾을 수 없습니다. 고객센터로 문의하여 주시기 바랍니다.',
            )
          }
        } else {
          alert(
            '학생정보를 찾을 수 없습니다. 고객센터로 문의하여 주시기 바랍니다.',
          )
        }
      },
    })
  }
  const groupList = classGroupFetch.payload
  const customerInfo = useCustomerInfo()
  const customerName = customerInfo.customerGroupName
  const isAvailableClassLogin = customerInfo.useStudentNoYn
  if (!isAvailableClassLogin && tab === 'Class') {
    setTab('Id')
  }

  const isLoginDisabled =
    tab === 'Id'
      ? !loginId || !password
      : !classGroup || !classOne || !userName || !password
  return (
    <>
      {isAvailableClassLogin && (
        <Nav>
          <NavItem active={tab === 'Id'} onClick={() => setTab('Id')}>
            아이디 로그인
          </NavItem>
          <NavItem active={tab === 'Class'} onClick={() => setTab('Class')}>
            학년반 로그인
          </NavItem>
        </Nav>
      )}
      <div className={style.logIn_group_member}>
        {customHeader}
        {tab === 'Class' ? (
          <>
            <div>
              <select
                style={{
                  marginLeft: '10px',
                  fontSize: 'medium',
                }}
                value={classGroup}
                onChange={(e) => {
                  onChangeClassGroup(e.target.value)
                }}>
                <option key={'grd_default'} disabled value="">
                  학년 선택
                </option>
                {groupList.map((group) => {
                  return (
                    <option key={group.classGroupId} value={group.classGroupId}>
                      {group.name}
                    </option>
                  )
                })}
              </select>
              <select
                style={{
                  marginLeft: '20px',
                  marginRight: '10px',
                  fontSize: 'medium',
                }}
                value={classOne}
                onChange={(e) => {
                  setClassOne(e.target.value)
                }}>
                {!classList ||
                  (classList.length === 0 && (
                    <option key={'cls_default'} disabled value="">
                      반 선택
                    </option>
                  ))}
                {classList.map((cls) => {
                  return (
                    <option key={cls.classId} value={cls.classId}>
                      {cls.name}
                    </option>
                  )
                })}
              </select>
            </div>
            <TextField
              ref={userNameInputRef}
              id={'user-name'}
              hint={'이름'}
              onTextChange={(text) => setUserName(text)}
              value={userName}
              onKeyDown={(e) => {
                if (e.key.toLowerCase() === 'enter') {
                  if (!isLoginDisabled) {
                    onRunLogin({
                      tab,
                      classId: classOne,
                      studentName: userName,
                      password,
                    })
                  } else if (userName && !password) {
                    passwordInputRef?.current?.focus()
                  }
                }
              }}
            />
          </>
        ) : (
          <TextField
            ref={loginIdInputRef}
            id={'user-id'}
            hint={'아이디'}
            onTextChange={(text) => setLoginId(text)}
            value={loginId}
            onKeyDown={(e) => {
              if (e.key.toLowerCase() === 'enter') {
                if (!isLoginDisabled) {
                  onRunLogin({ tab: 'Id', id: loginId, password })
                } else if (loginId && !password) {
                  passwordInputRef?.current?.focus()
                }
              }
            }}
          />
        )}
        <TextField
          ref={passwordInputRef}
          id={'user-passowrd'}
          hint={'비밀번호'}
          password
          onTextChange={(text) => setPassword(text)}
          value={password}
          onKeyDown={(e) => {
            if (e.key.toLowerCase() === 'enter') {
              if (!isLoginDisabled) {
                onRunLogin({
                  tab,
                  id: loginId,
                  classId: classOne,
                  studentName: userName,
                  password,
                })
              } else if (tab === 'Id' && !loginId && password) {
                loginIdInputRef?.current?.focus()
              } else if (tab === 'Class' && !userName && password) {
                userNameInputRef?.current?.focus()
              }
            }
          }}
        />
        <Button
          shadow={!isLoginDisabled}
          color={isLoginDisabled ? 'gray' : undefined}
          onClick={() => {
            if (!isLoginDisabled) {
              onRunLogin({
                tab,
                id: loginId,
                classId: classOne,
                studentName: userName,
                password,
              })
            }
          }}>
          로그인
        </Button>
        <div className={style.row_box}>
          <Link href={SITE_PATH.ACCOUNT.FORGOT_ID}>아이디 찾기</Link>
          <Link href={SITE_PATH.ACCOUNT.FORGOT_PASSWORD}>비밀번호 찾기</Link>
        </div>
        <div className={style.comment}>
          {`❗️ '${customerName}'에서 재학중인 학생만 이용할 수 있어요. `}
          <br />
          {`❗️ 아이디와 비밀번호는 '${customerName}'에서 발급해 드려요.`}
        </div>
      </div>
    </>
  )
}
