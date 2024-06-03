'use client'

import Image from 'next/image'
import { BackLink, Margin } from '@/ui/common/common-components'
import { useStyle } from '@/ui/context/StyleContext'

const STYLE_ID = 'page_rg_news_post'

export default function Page() {
  const style = useStyle(STYLE_ID)

  const data = {
    title: '[캠페인] 자랑스러운 리게인을 찾습니다!',
    date: '2024/3/31',
    contents:
      'https://fservice6.readinggate.com/UPLOADFILE/Notice/4df2e3b6dd8ec16849719914a1928c92.png',
  }

  const blurDataURL =
    'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=='

  return (
    <main className="container compact">
      <BackLink largeFont colorWhite>
        공지
      </BackLink>
      <Margin height={30} />
      <div className={style.rg_news_post}>
        <div className={style.row_1}>
          <div className={style.txt_1}>{data.title}</div>
          <div className={style.txt_2}>{data.date}</div>
        </div>
        <div className={style.row_2}>
          <div> - 광고 베너 - </div>
          <Margin height={20} />
          <div style={{ width: '100%', maxWidth: '750px', margin: 'auto' }}>
            <Image
              alt=""
              src={data.contents}
              width={1000}
              height={800}
              placeholder="blur"
              blurDataURL={blurDataURL}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: '10px',
              }}
            />
          </div>
          <Margin height={20} />
          <div> - 광고 베너 - </div>
        </div>
      </div>
    </main>
  )
}
