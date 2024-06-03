import {
  RouteResponse,
  executeRequestAction,
  getParameters,
} from '@/app/api/_util'
import { getAuthorizationWithCookie } from '@/authorization/server/nextjsCookieAuthorization'
import { NextRequest } from 'next/server'
import PreK from '@/repository/server/pre-k'

export async function GET(request: NextRequest) {
  const token = getAuthorizationWithCookie().getActiveAccessToken()
  if (!token) {
    return RouteResponse.invalidAccessToken()
  }

  const parameter = await getParameters(request, 'studyId', 'studentHistoryId')
  const studyId = parameter.getString('studyId', '')
  const studentHistoryId = parameter.getString('studentHistoryId', '')

  const [payload, status, error] = await executeRequestAction(
    PreK.commonGet(token, 'record', { studyId, studentHistoryId }),
  )
  if (error) {
    return RouteResponse.commonError()
  }
  return RouteResponse.response(payload, status)
}
