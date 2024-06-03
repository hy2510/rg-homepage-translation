'use client'

import { useCustomerInfo } from '@/app/_context/CustomerContext'
import { useStyle } from '@/ui/context/StyleContext'
import ForgotIdPrivate from './ForgotIdPrivate'
import ForgotIdSchool from './ForgotIdSchool'

const STYLE_ID = 'page_forgot_id'
export default function ForgotId() {
  const style = useStyle(STYLE_ID)

  const customer = useCustomerInfo()
  const customerUse = customer.customerUse

  return (
    <div className={style.forgot}>
      <div className={style.forgot_id}>
        {customerUse === 'Private' && <ForgotIdPrivate style={style} />}
        {customerUse === 'School' && <ForgotIdSchool style={style} />}
        {customerUse !== 'Private' && customerUse !== 'School' && (
          <div>
            ID찾기를 지원하지 않는 고객사입니다. 고객센터로 문의해주세요.
          </div>
        )}
      </div>
    </div>
  )
}
