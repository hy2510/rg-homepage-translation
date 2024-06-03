'use client'

import SITE_PATH from '@/app/site-path'
import { useRouter } from 'next/navigation'
import { useStudentInfo } from '@/client/store/student/info/selector'
import { Button } from '@/ui/common/common-components'
import { useStyle } from '@/ui/context/StyleContext'

const STYLE_ID = 'page_welcome'

export default function Welcome() {
  const style = useStyle(STYLE_ID)

  const student = useStudentInfo().payload

  const router = useRouter()
  return (
    <div className={style.sign_up_box}>
      <main className={style.welcome}>
        <div className={style.txt_title}>회원가입 완료</div>
        <div className={style.txt_sub_title}>회원정보</div>
        <div className={style.member_info_box}>
          <div>이름</div>
          <div>{student.name}</div>
          <div>로그인 ID</div>
          <div>{student.loginId}</div>
          <div>가입일</div>
          <div>{student.registDate}</div>
          <div>남은 학습 기간</div>
          <div>{student.studyEndDay}일</div>
        </div>
        <div className={style.comment}>
          <span>
            * 학습 결과 리포트, 정기적인 소식 등 유용한 정보를 받으시겠어요?
          </span>
          <span
            style={{ color: '#0062e3', cursor: 'pointer', fontWeight: '500' }}
            onClick={() => {
              router.replace(SITE_PATH.ACCOUNT.MAIN)
            }}>
            소식받기
          </span>
        </div>

        <Button
          shadow
          onClick={() => {
            router.replace(SITE_PATH.LIBRARY.HOME)
          }}>
          학습 둘러보기
        </Button>
        <div className={style.link_button_container}>
          <div
            className={style.link_button}
            onClick={() => {
              router.replace(SITE_PATH.HOME.MAIN)
            }}>
            홈페이지
          </div>
        </div>
      </main>
    </div>
  )
}
