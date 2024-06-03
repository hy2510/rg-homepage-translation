import RgNewsPostBoard from '@/ui/modules/home-rg-news-components/home-rg-news-post-board'

export default function Page() {
  const data = [
    {
      title: '2024년 1월 신규 콘텐츠',
      imgSrc:
        'https://wcfresource.a1edu.com/newsystem/image/newbooks/newbooks_202401.jpg',
    },
    {
      title: '2023년 12월 신규 콘텐츠',
      imgSrc:
        'https://wcfresource.a1edu.com/newsystem/image/newbooks/newbooks_202312.jpg',
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
