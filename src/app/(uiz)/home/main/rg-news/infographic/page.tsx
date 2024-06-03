import RgNewsPostBoard from '@/ui/modules/home-rg-news-components/home-rg-news-post-board'

export default function Page() {
  const data = [
    {
      title: '2023하반기 영어독서왕대회 인포그래픽',
      imgSrc:
        'https://wcfresource.a1edu.com/newsystem/image/infographic/infographic_2023_2nd.jpg',
    },
    {
      title: '2023상반기 영어독서왕대회 인포그래픽',
      imgSrc:
        'https://wcfresource.a1edu.com/newsystem/image/infographic/infographic_2023_study.jpg',
    },
    {
      title: '2023년 11월 신규 콘텐츠',
      imgSrc:
        'https://wcfresource.a1edu.com/newsystem/image/newbooks/newbooks_202311.jpg',
    },
    {
      title: '2023년 10월 신규 콘텐츠',
      imgSrc:
        'https://wcfresource.a1edu.com/newsystem/image/newbooks/newbooks_202310.jpg',
    },
    {
      title: '2023년 9월 신규 콘텐츠',
      imgSrc:
        'https://wcfresource.a1edu.com/newsystem/image/newbooks/newbooks_202309.jpg',
    },
  ]

  return <RgNewsPostBoard postData={data} />
}
