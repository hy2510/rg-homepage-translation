'use client'

import { useCustomerInfo } from '@/app/_context/CustomerContext'
import { useStyle } from '@/ui/context/StyleContext'
import ForgotPasswordPrivate from './ForgotPasswordPrivate'
import ForgotPasswordSchoolAcademy from './ForgotPasswordSchoolAcademy'

const STYLE_ID = 'page_forgot_password'

export default function ForgotPassword() {
  const style = useStyle(STYLE_ID)

  const customer = useCustomerInfo()
  const customerUse = customer.customerUse

  return (
    <div className={style.forgot}>
      <main className={style.forgot_password}>
        {customerUse === 'Private' && <ForgotPasswordPrivate style={style} />}
        {(customerUse === 'School' || customerUse === 'Academy') && (
          <ForgotPasswordSchoolAcademy style={style} />
        )}
        {customerUse !== 'Private' &&
          customerUse !== 'School' &&
          customerUse !== 'Academy' && (
            <div>
              비밀번호 찾기를 지원하지 않는 고객사입니다. 고객센터로
              문의해주세요.
            </div>
          )}
      </main>
    </div>
  )
}
