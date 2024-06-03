'use client'

import { useCustomerInfo } from '@/app/_context/CustomerContext'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import {
  useFetchChnagePassword,
  useFetchModifySmsReceive,
  useFetchUpdateStudentName,
} from '@/client/store/student/info/hook'
import { useStudentInfo } from '@/client/store/student/info/selector'
import { CheckBox, TextField } from '@/ui/common/common-components'
import { useStyle } from '@/ui/context/StyleContext'
import {
  isValidatePassword,
  isValidatePasswordVn,
  isValidateStudentName,
} from '../sign-up/_component/Signup'

const STYLE_ID = 'page_account_info'

export default function Page() {
  const style = useStyle(STYLE_ID)

  const customer = useCustomerInfo()
  const countryCode = customer.countryCode
  const student = useStudentInfo().payload

  const { fetch: fetchUpdateStudentName } = useFetchUpdateStudentName()
  const [newStudentName, setNewStudentName] = useState<{
    isEdit: boolean
    value: string
  }>({ isEdit: false, value: '' })
  const onChangeStudentName = (name: string) => {
    if (name.length === 0) {
      alert('학생 이름을 입력해주세요.')
      return
    }
    if (!isValidateStudentName(name)) {
      alert('올바른 이름을 입력해주세요.')
      return
    }
    setNewStudentName({ isEdit: false, value: name })
    fetchUpdateStudentName({
      studentName: name,
      callback: (success) => {
        if (!success) {
          alert('변경할 수 없습니다.')
          setNewStudentName({ isEdit: true, value: name })
        } else {
          alert('이름이 변경되었습니다.')
        }
      },
    })
  }

  const { fetch: fetchChangePassword } = useFetchChnagePassword()
  const [newPassword, setNewPassword] = useState<{
    isEdit: boolean
    oldValue: string
    newValue: string
  }>({ isEdit: false, oldValue: '', newValue: '' })
  const onChangePassword = (oldPassword: string, newPassword: string) => {
    if (oldPassword.length === 0) {
      alert('현재 사용중인 비밀번호를 입력해주세요.')
      return
    }
    if (newPassword.length === 0) {
      alert('새로운 비밀번호를 입력해주세요.')
      return
    }
    if (oldPassword === newPassword) {
      alert('기존 비밀번호와 다르게 설정해주세요.')
      return
    }
    if (countryCode === 'KR' && !isValidatePassword(newPassword)) {
      alert('비밀번호는 영문 숫자 조합 8~20글자로 입력해 주세요.')
      return
    } else if (countryCode === 'VN' && !isValidatePasswordVn(newPassword)) {
      alert(
        '비밀번호는 영문 대문자, 영문 소문자, 숫자, 특수문자 조합 8~20글자로 입력해 주세요.',
      )
      return
    }
    setNewPassword({
      isEdit: false,
      oldValue: oldPassword,
      newValue: newPassword,
    })
    fetchChangePassword({
      oldPassword,
      newPassword,
      callback: (success) => {
        if (!success) {
          alert('변경할 수 없습니다.')
          setNewPassword({
            isEdit: true,
            oldValue: oldPassword,
            newValue: newPassword,
          })
        } else {
          alert('비밀번호가 변경되었습니다.')
          setNewPassword({ isEdit: false, oldValue: '', newValue: '' })
        }
      },
    })
  }

  const userName = student.name
  let userEmail = ''
  if (student.parentEmail) {
    userEmail = student.parentEmail
  } else if (student.studentEmail) {
    userEmail = student.studentEmail
  }
  let userPhone = ''
  if (student.parentCellPhone) {
    userPhone = student.parentCellPhone
  } else if (student.studentCellPhone) {
    userPhone = student.studentCellPhone
  }

  const isSmsReceive = student.smsReceiveYN
  const { fetch: fetchModifySmsAgree } = useFetchModifySmsReceive()
  const onChangeSmsReceive = (isReceive: boolean) => {
    if (!userPhone) {
      alert(
        '전화번호가 없는 경우 체크박스를 눌렀을 때 경고창 출력: 학습 리포트, 소식 등 알림을 받으려면 수신할 휴대전화번호가 필요합니다. 연락처 칸에서 휴대전화번호를 등록해 주세요.',
      )
      return
    }
    fetchModifySmsAgree({
      isReceive,
      callback: (success) => {
        if (!success) {
          alert('변경할 수 없습니다.')
        } else {
          if (isReceive) {
            alert('학습리포트, 소식 등의 알림에 수신 동의하였습니다.')
          } else {
            alert('학습리포트, 소식 등의 알림에 수신 거부하였습니다.')
          }
        }
      },
    })
  }

  return (
    <main className={`${style.account_info} container compact`}>
      <div className={style.heading}>계정정보</div>
      <div className={style.contents}>
        {/* 회원 & 결제 정보 */}
        <div className={style.sub_title}>회원, 결제 정보</div>
        <div className={`${style.description} ${style.include_link}`}>
          <div className={style.lable_text}>
            남은 학습 기간: {student.studyEndDay}일,
          </div>
          <div className={style.lable_text}>
            학습 만료일: {student.studyEndDate}
          </div>
          <Link
            href="https://www.readinggate.com/Payment/Price"
            target="_blank"
            className={style.link_text}>
            결제하기
          </Link>
        </div>
        <div className={style.form_box}>
          <EditTextField
            hint={'학생이름'}
            value={newStudentName.isEdit ? newStudentName.value : userName}
            editMessage={'편집'}
            saveMessage={'저장'}
            isEdit={newStudentName.isEdit}
            onTextChange={(text) => {
              if (newStudentName.isEdit) {
                setNewStudentName({ isEdit: true, value: text })
              }
            }}
            onConfirmEdit={(isEdit, text) => {
              if (!isEdit) {
                setNewStudentName({ isEdit: true, value: userName })
              } else {
                onChangeStudentName(text)
              }
            }}
          />
          <div>
            <TextField hint={'ID(E-Mail)'} value={userEmail} disabled />
          </div>
          <EditChangePassword
            oldPassword={newPassword.oldValue}
            newPassword={newPassword.newValue}
            isEdit={newPassword.isEdit}
            onTextChange={(oldValue, newValue) => {
              setNewPassword({ ...newPassword, oldValue, newValue })
            }}
            onConfirmEdit={(oldValue, newValue) => {
              onChangePassword(oldValue, newValue)
            }}
            onModeChange={(isEdit) =>
              setNewPassword({ isEdit, oldValue: '', newValue: '' })
            }
          />

          {/* 전화번호가 있는 경우 */}
          <EditTextField
            hint={'연락처 (휴대전화번호)'}
            value={userPhone}
            editMessage={'편집'}
            saveMessage={'본인인증'}
          />
          {/* 전화번호가 없는 경우 */}
        </div>
        <div className={style.check}>
          {/* 전화번호가 없는 경우 체크박스를 눌렀을 때 경고창 출력: 학습 리포트, 소식 등 알림을 받으려면 수신할 휴대전화번호가 필요합니다. 연락처 칸에서 휴대전화번호를 등록해 주세요. [확인] */}
          <CheckBox
            check={isSmsReceive}
            onClick={() => {
              onChangeSmsReceive(!isSmsReceive)
            }}
          />
          <span
            onClick={() => {
              onChangeSmsReceive(!isSmsReceive)
            }}>
            학습 리포트, 소식 등 알림 받기
          </span>
        </div>
        <div className={style.accordion_box}>
          <AccordionItem headerContents={'결제 상세 정보'} bodyContents={'-'} />
          <AccordionItem headerContents={'학습 일시 중지'} bodyContents={'-'} />
          <AccordionItem headerContents={'회원 탈퇴'} bodyContents={'-'} />
        </div>
      </div>
    </main>
  )
}

// 수정하기 기능이 있는 텍스트 필드
const EditTextField = ({
  hint,
  value,
  editMessage,
  saveMessage,
  password,
  email,
  isEdit,
  onTextChange,
  onConfirmEdit,
}: {
  hint?: string
  value?: string
  editMessage?: string
  saveMessage?: string
  password?: boolean
  email?: boolean
  isEdit?: boolean
  onTextChange?: (text: string) => void
  onConfirmEdit?: (isEdit: boolean, text: string) => void
}) => {
  const style = useStyle(STYLE_ID)

  return (
    <div className={style.edit_text_field}>
      <div
        className={style.btn_edit}
        onClick={() => {
          onConfirmEdit && onConfirmEdit(!!isEdit, value || '')
        }}>
        {!isEdit ? (
          editMessage
        ) : (
          <span className={style.text_blue}>{saveMessage}</span>
        )}
      </div>
      <TextField
        hint={hint}
        value={value}
        disabled={!isEdit}
        password={password}
        email={email}
        onTextChange={onTextChange}
      />
    </div>
  )
}

// 비밀번호 변경하기
const EditChangePassword = ({
  oldPassword,
  newPassword,
  isEdit,
  onTextChange,
  onConfirmEdit,
  onModeChange,
}: {
  oldPassword?: string
  newPassword?: string
  isEdit?: boolean
  onTextChange?: (oldValue: string, newValue: string) => void
  onConfirmEdit?: (oldPassword: string, newPassword: string) => void
  onModeChange?: (isEdit: boolean) => void
}) => {
  const style = useStyle(STYLE_ID)

  return (
    <div className={style.edit_change_password}>
      {!isEdit ? (
        <>
          <div
            className={style.btn_edit}
            onClick={() => {
              onModeChange && onModeChange(true)
            }}>
            편집
          </div>
          <TextField
            hint={'비밀번호'}
            value={'************'}
            disabled
            password
          />
        </>
      ) : (
        <div className={style.input_password}>
          <div className={style.row_1}>
            <TextField
              hint={'현재 비밀번호'}
              password
              value={oldPassword}
              onTextChange={(text) => {
                onTextChange && onTextChange(text, newPassword || '')
              }}
            />
          </div>
          <div className={style.row_2}>
            <div className={style.btn_edit}>
              <div
                className={style.text_blue}
                onClick={() => {
                  onModeChange && onModeChange(false)
                }}>
                취소
              </div>
              <div
                className={style.text_blue}
                onClick={() => {
                  onConfirmEdit &&
                    onConfirmEdit(oldPassword || '', newPassword || '')
                }}>
                변경
              </div>
            </div>
            <TextField
              hint={'변경할 비밀번호'}
              password
              value={newPassword}
              onTextChange={(text) => {
                onTextChange && onTextChange(oldPassword || '', text)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// 아코디언 아이템
const AccordionItem = ({
  headerContents,
  bodyContents,
}: {
  headerContents?: string
  bodyContents?: string
}) => {
  const style = useStyle(STYLE_ID)

  return (
    <div className={style.accordion_item}>
      <div className={style.header}>
        <div className={style.header_text}>{headerContents}</div>
        <div className={style.btn_toggle}>
          <Image
            alt=""
            src="/src/images/arrow-icons/chv_down.svg"
            width={20}
            height={20}
          />
        </div>
      </div>
      <div className={style.body_contents}>{bodyContents}</div>
    </div>
  )
}
