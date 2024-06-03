import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export default async function createMiddleware(request: NextRequest) {
  // FIXME : 쿠키가 서버컴포넌트에 바로 반영되지 않는 issue로 헤더를 활용하는 방법도 생각해 보아야 함. 아래는 그 샘플.
  // 다른 방법으로는 클라이언트에서 navigator를 이용하여 refresh 하는 방법이 있음. ( 설정 당시의 쿠키는 다음 요청에서 조회됨. )
  // const ct = cookies().get('main')?.value || ''
  // console.log('ct', ct)
  // const t = new Date().toString()
  // const newHeaders = new Headers(request.headers)
  // newHeaders.set('x-main', encodeURIComponent(t))
  // const response = NextResponse.next({
  //   request: {
  //     headers: newHeaders,
  //   },
  // })
  // response.cookies.set('main', t)
  // request.cookies.set('main', '5678')
  // return response
}

export const config = {
  matcher: ['/z/:path*', '/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
