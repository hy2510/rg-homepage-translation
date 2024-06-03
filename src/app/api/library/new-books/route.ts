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

  const parameter = await getParameters(request, 'year', 'month')
  const today = new Date()
  const year = parameter.getNumber('year', today.getFullYear())
  const month = parameter.getNumber('month', today.getMonth() + 1)

  const action = Library.newBooks(token, { year, month })
  const [payload, status, error] = await executeRequestAction(action)
  if (error) {
    return RouteResponse.commonError()
  }
  return RouteResponse.response(payload, status)
}
