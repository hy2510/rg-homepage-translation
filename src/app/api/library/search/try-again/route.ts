import {
  RouteResponse,
  executeRequestAction,
  getParameters,
} from '@/app/api/_util'
import { getAuthorizationWithCookie } from '@/authorization/server/nextjsCookieAuthorization'
import { NextRequest } from 'next/server'
import Library from '@/repository/server/library'

export async function GET(request: NextRequest) {
  const token = getAuthorizationWithCookie().getActiveAccessToken()
  if (!token) {
    return RouteResponse.invalidAccessToken()
  }

  const parameter = await getParameters(request, 'page')
  const page = parameter.getNumber('page', 1)

  const [payload, status, error] = await executeRequestAction(
    Library.searchTryAgain(token, {
      page,
    }),
  )
  if (error) {
    return RouteResponse.commonError()
  }
  return RouteResponse.response(payload, status)
}
