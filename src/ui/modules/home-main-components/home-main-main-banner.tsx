'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useStyle } from '@/ui/context/StyleContext'

const STYLE_ID = 'home_main_main_banner'

export default function MainBanner({ data }: { data?: unknown }) {
  const style = useStyle(STYLE_ID)

  const mainBannerData = [
    {
      name: "1",
      imgSrc:
        "https://fservice6.readinggate.com/UPLOADFILE/Notice/infographic_2023_study_banner.png?ver=240327093523",
      href: "https://www.readinggate.com/News/LibraryBoardNotice?notifytype=094001&no=1627",
      target: "_blank",
    },
    {
      name: "2",
      imgSrc:
        "https://wcfresource.a1edu.com/newsystem/image/slidingbanner/common/banner_newbook_eng.png?ver=240327093311",
      href: "https://www.readinggate.com/News/NewBooks",
      target: "_blank",
    },
  ]

  const [order, _order] = useState(0)
  const [aniFx, _aniFx] = useState('fade-in')

  const MainBannerItem = ({
    imgSrc = '',
    href,
    target,
  }: {
    imgSrc?: string
    href?: string
    target?: string
  }) => {
    return (
      <Link href={href ? href : ''} target={target ? target : '_self'}>
        <div className={`${style.main_banner_item} ${aniFx}`}>
          <Image alt="" src={imgSrc} width={1000} height={350} loading="lazy" />
        </div>
      </Link>
    )
  }

  const Indicator = () => {
    return (
      <div className={style.indicator}>
        <div className={style.arrows}>
          <div
            className={style.btn_left}
            onClick={() => {
              _order(order == 0 ? mainBannerData.length - 1 : order - 1)
            }}></div>
          <div
            className={style.btn_right}
            onClick={() => {
              _order(order < mainBannerData.length - 1 ? order + 1 : 0)
            }}></div>
        </div>
        <div className={style.status}>
          {order + 1} / {mainBannerData.length}
        </div>
      </div>
    )
  }

  return (
    <div className={style.main_banner}>
      <MainBannerItem
        imgSrc={mainBannerData[order].imgSrc}
        href={mainBannerData[order].href}
        target={mainBannerData[order].target}
      />
      <Indicator />
    </div>
  )
}
