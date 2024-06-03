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

  const parameter = await getParameters(
    request,
    'levelRoundIds',
    'studentHistoryId',
  )
  const levelRoundIds = parameter.getString('levelRoundIds', '')
  const studentHistoryId = parameter.getString('studentHistoryId', '')

  const [payload, status, error] = await executeRequestAction(
    Library.exportVocabularyUrl(token, { levelRoundIds, studentHistoryId }),
  )
  if (error) {
    return RouteResponse.commonError()
  }
  return RouteResponse.response(payload, status)
}
