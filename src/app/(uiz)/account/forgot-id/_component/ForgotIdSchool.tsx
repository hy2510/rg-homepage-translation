'use client'

import SITE_PATH from '@/app/site-path'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  useFetchClassList,
  useOnLoadClassGroup,
} from '@/client/store/account/class/hook'
import { useFetchForgotIdWithClassAndStudentName } from '@/client/store/account/forgot/hook'
import { ClassGroupResponse } from '@/repository/client/account/class-group'
import { ClassListResponse } from '@/repository/client/account/class-list'
import {
  BackLink,
  Button,
  FormDropDown,
  TextField,
} from '@/ui/common/common-components'
import BoxUserInfo from '@/ui/modules/account-components/box-user-info'

export default function ForgotIdSchool({
  style,
}: {
  style: Record<string, string>
}) {
  const classGroupFetch = useOnLoadClassGroup()
  const [step, setStep] = useState<1 | 2>(1)

  const [findResult, setFindResult] = useState<{
    loginId: string
    className: string
    studentName: string
  }>({ loginId: '', className: '', studentName: '' })

  const forgotId = useFetchForgotIdWithClassAndStudentName()
  const onFindId = (
    classId: string,
    className: string,
    studentName: string,
  ) => {
    forgotId.fetch({
      classId,
      studentName,
      callback: (data) => {
        if (data.success && data.payload) {
          if (data.payload.code === 0) {
            setFindResult({
              loginId: data.payload.loginId,
              studentName,
              className,
            })
            setStep(2)
          } else {
            alert('ID를 찾을 수 없습니다. 고객센터로 문의하여 주시기 바랍니다.')
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
          style={style}
          groupList={classGroupFetch.payload}
          onFindId={onFindId}
        />
      )}
      {step === 2 && <Step2FindIdResult style={style} result={findResult} />}
    </main>
  )
}

function Step1ForgotIdInput({
  style,
  groupList,
  onFindId,
}: {
  style: Record<string, string>
  groupList: ClassGroupResponse
  onFindId: (classId: string, className: string, studentName: string) => void
}) {
  const [uesrName, setUserName] = useState<string>('')
  const [classGroup, setClassGroup] = useState<string>('')
  const [classOne, setClassOne] = useState<string>('')

  const [classList, setClassList] = useState<ClassListResponse>([])
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

  //   if (!classGroup && groupList && groupList.length >= 1) {
  //     const classGroupId = groupList[0].classGroupId
  //     onChangeClassGroup(classGroupId)
  //   }

  const groupName =
    groupList.find((item) => item.classGroupId === classGroup)?.name || '학년'
  const className =
    classList?.find((item) => item.classId === classOne)?.name || '반'

  return (
    <div className={style.forgot_id_form}>
      <div className={style.txt_heading}>정보 입력</div>
      <div className={style.group_select_grade}>
        <FormDropDown
          label={'학년'}
          select={groupList.map((item) => ({
            key: item.classGroupId,
            label: item.name,
          }))}
          onChange={(key) => {
            onChangeClassGroup(key)
          }}
          value={groupName}
        />
        <FormDropDown
          label={'소속반'}
          select={classList.map((item) => ({
            key: item.classId,
            label: item.name,
          }))}
          onChange={(key) => {
            setClassOne(key)
          }}
          value={className}
        />
      </div>
      <TextField
        hint={'이름'}
        value={uesrName}
        onTextChange={(text) => setUserName(text)}
      />
      <Button
        shadow
        onClick={() => {
          const className =
            classList.find((item) => item.classId === classOne)?.name || ''
          onFindId(classOne, className, uesrName)
        }}>
        찾기
      </Button>
    </div>
  )
}

function Step2FindIdResult({
  style,
  result,
}: {
  style: Record<string, string>
  result: { loginId: string; className: string; studentName: string }
}) {
  const { loginId, className, studentName } = result
  return (
    <div className={style.forgot_id_find_result}>
      <div className={style.txt_heading}>아이디 찾기 결과</div>
      <BoxUserInfo
        datas={[
          { label: '이름', value: studentName },
          { label: '아이디', value: loginId },
          { label: '소속반', value: className },
        ]}
      />
    </div>
  )
}
