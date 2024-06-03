'use client'

import { useStyle } from '@/ui/context/StyleContext'

const STYLE_ID = 'global_footer'

// 공통하단
export default function Gfooter() {
  const style = useStyle(STYLE_ID)

  return (
    <div className={style.g_footer}>
      <div className="container">
        <div className={style.row_a}>
          <span>고객센터</span>
          <span>1599-0533</span>
        </div>
        <div className={style.row_b}>
          <div>홈</div>
          <div>소개</div>
          {/* <div>체험</div> */}
          <div>이용약관</div>
          <div>개인정보 취급방침</div>
          <div>B2B</div>
        </div>
        <div className={style.row_c}>
          <div>
            경기도 성남시 수정구 창업로 43, A동 807~810호 (판교 글로벌비즈 센터)
          </div>
          <br />
          <div>
            대표이사 김용환 ㅣ 사업자 등록 번호 119-86-01044 ㅣ 통신판매번호: 2013-경기성남-0836호 성남교육지원청 등록 제4868호 ㅣ FAX :
            070-0826-8660 ㅣ Mail : rgmanager@readinggate.com
          </div>
          <br />
          <div>
            
          </div>
        </div>
      </div>
    </div>
  )
}
