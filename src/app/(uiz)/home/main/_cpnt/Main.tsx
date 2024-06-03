'use client'

import SITE_PATH from '@/app/site-path'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useStudentIsLogin } from '@/client/store/student/info/selector'
import { Margin } from '@/ui/common/common-components'
import { useStyle } from '@/ui/context/StyleContext'
import {
  AdBannerType1,
  AdBannerType2,
  AdBannersGroup,
} from '@/ui/modules/home-main-components/home-main-ad-banners'
import LogIn from '@/ui/modules/home-main-components/home-main-log-in'
import MainBanner from '@/ui/modules/home-main-components/home-main-main-banner'
import {
  RgNewsCard,
  RgNewsContainer,
} from '@/ui/modules/home-main-components/home-main-rg-news'
import {
  RgPostContainer,
  RgPostItem,
} from '@/ui/modules/home-main-components/home-main-rg-post'

const STYLE_ID = 'page_main'

export default function Main() {
  const style = useStyle(STYLE_ID)

  const router = useRouter()

  const isLogin = useStudentIsLogin()
  const onClickMainLoginButton = () => {
    if (isLogin) {
      router.push(SITE_PATH.LIBRARY.HOME)
    } else {
      router.push(SITE_PATH.ACCOUNT.MAIN)
    }
  }

  return (
    <main className={`${style.home_news} container`}>
      <div className={style.item1}>
        <MainBanner />
      </div>
      <div className={style.item2}>
        <RgNewsContainer>
          <RgNewsCard
            title={'2024상반기 영어독서왕선발대회 안내'}
            date={'2024-03-22'}
            href={
              'https://www.readinggate.com/News/LibraryBoardNotice?notifytype=094001&page=1&no=1634'
            }
            target={'_blank'}
            bgImage={'/src/images/@home/img_post_card_bg_default.svg'}
          />
          <RgNewsCard
            tag={'인포그래픽'}
            tagColor={'#FF81AD'}
            title={'뜨거웠던 2023년! RG학습데이터 공개'}
            titleColor={'#000000'}
            summary={'한눈에 보기 쉽게 정리해 보았어요.'}
            summaryColor={'#777'}
            // date={'2024-01-17'}
            bgColor={'#FDE2EB'}
            bgImage={'/src/images/@home/rg-news-sample/infographic.svg'}
            href={
              'https://www.readinggate.com/News/LibraryBoardNotice?notifytype=094001&page=1&no=1627'
            }
            target={'_blank'}
          />
          <RgNewsCard
            title={'2024 리딩게이트 슈퍼스타선발대회 결과 안내'}
            date={'2024-01-26'}
            href={
              'https://www.readinggate.com/News/LibraryBoardNotice?notifytype=094001&page=1&no=1629'
            }
            target={'_blank'}
            bgImage={'/src/images/@home/img_post_card_bg_default.svg'}
          />
          <RgNewsCard
            tag={'뉴스레터'}
            tagColor={'#00AEEF'}
            title={'2024년 3월 RG 뉴스레터'}
            titleColor={'#000000'}
            summary={'다양한 정보를 제공해 드려요'}
            summaryColor={'#777'}
            bgColor={'#F1F6FF'}
            bgImage={'/src/images/@home/rg-news-sample/img_news_letter.svg'}
            btnMore={'보러가기'}
            href={'https://www.readinggate.com/News/NewsLetter'}
            target={'_blank'}
          />
          <RgNewsCard
            title={'2023하반기 영어독서왕선발대회 결과'}
            date={'2023-12-20'}
            href={
              'https://www.readinggate.com/News/LibraryBoardNotice?notifytype=094001&page=1&no=1622'
            }
            target={'_blank'}
            bgImage={'/src/images/@home/img_post_card_bg_default.svg'}
          />
          <RgNewsCard
            tag={'캠페인'}
            tagColor={'#FFE8A2'}
            title={'다독다독 기부캠페인'}
            titleColor={'#FFFFFF'}
            summary={'내가 읽은 책 한권이 누군가의 희망으로'}
            summaryColor={'#ddd'}
            bgColor={'#CA112D'}
            bgImage={'/src/images/@home/rg-news-sample/campaign.svg'}
            href={'https://www.youtube.com/watch?v=l6SyjMwmM7A&t=4s'}
            target={'_blank'}
          />
        </RgNewsContainer>
      </div>
      <div className={style.item3}>
        <LogIn isLogin={isLogin} onClick={onClickMainLoginButton} />
      </div>
      <div className={style.item4}>
        <AdBannersGroup>
          <Margin height={10} />
          <AdBannerType1
            href="https://dev.readinggate.com/hidodo/"
            target={'_blank'}>
            <Image
              alt=""
              src="/src/sample-images/hidodo_banner.png"
              width={320}
              height={300}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
            {/* 하이도도 베너 */}
          </AdBannerType1>
          {/* <AdBannerType1>
            <Image
              src="https://postfiles.pstatic.net/MjAyMzEyMjJfMjY1/MDAxNzAzMjA5MDc2NDE4.BU9n85A77IT-a8QFbrcf2nNu4OS_dtxvpuzXKxdhD48g.y1FQQo8l-flP2cC_umW8Dy_xhkrWxK3fJrNGtWCV4Tcg.PNG.readinggate_official/4.png?type=w966"
              width={300}
              height={300}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />
          </AdBannerType1> */}
          <Margin height={10} />
          <AdBannerType2
            bgColor={'#ff274f20'}
            txt1={'B2B'}
            txt2={'문의하기'}
            imgSrc={'/src/images/@home/img_letter.svg'}
            href={'https://www.readinggate.com/Community/BringInInstitution'}
            target={'_blank'}
          />
          <AdBannerType2
            bgColor={'#15b5f120'}
            txt1={'DODO & FRIENDS'}
            txt2={'SHOP'}
            imgSrc={'/src/images/@home/img_bag.svg'}
            href={
              'https://brand.naver.com/readinggate/category/ff06b3149209419ba775729610cf1144?cp=1'
            }
            target={'_blank'}
          />
          <AdBannerType2
            bgColor={'#9747FF20'}
            txt1={'WORK BOOK'}
            txt2={'구매하기'}
            imgSrc={'/src/images/@home/img_note.svg'}
            href={
              'https://brand.naver.com/readinggate/category/97ef382000f947ab90f05041ea6b1f0c?cp=1'
            }
            target={'_blank'}
          />
        </AdBannersGroup>
      </div>
      <div className={style.item5}>
        <RgPostContainer>
          <RgPostItem
            imgSrc={
              'https://wcfresource.a1edu.com/newsystem/image/channel/channel240314.png?ver=240327093316'
            }
            href={'https://blog.naver.com/readinggate_official/223383172127'}
          />
          <RgPostItem
            imgSrc={
              'https://wcfresource.a1edu.com/newsystem/image/channel/channel240321.png?ver=240327093316'
            }
            href={'https://www.youtube.com/watch?v=GKkyd0Wq328'}
          />
          <RgPostItem
            imgSrc={
              'https://wcfresource.a1edu.com/newsystem/image/channel/channel240202.png?ver=240327093316'
            }
            href={'https://www.youtube.com/watch?v=vlSQPLDrqwo'}
          />
        </RgPostContainer>
      </div>
    </main>
  )
}
