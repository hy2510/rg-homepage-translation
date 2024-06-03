import SITE_PATH from '@/app/site-path'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { BackLink } from '@/ui/common/common-components'

type Step = 1 | 2 | 3
export default function ForgotPasswordSchoolAcademy({
  style,
}: {
  style: Record<string, string>
}) {
  const [step, setStep] = useState<Step>(1)

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
      <div>준비중입니다.</div>
    </>
  )
}
