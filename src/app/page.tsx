import { getAuthorizationWithCookie } from '@/authorization/server/nextjsCookieAuthorization'
import { redirect } from 'next/navigation'
import SITE_PATH from './site-path'

export default function Page() {
  const authToken = getAuthorizationWithCookie().getAccessToken()
  if (authToken) {
    redirect(SITE_PATH.HOME.MAIN)
  } else {
    redirect(SITE_PATH.ACCOUNT.MAIN)
  }
}
