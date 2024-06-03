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

  const parameter = await getParameters(
    request,
    'studyId',
    'studentHistoryId',
    'step',
    'type',
  )
  const studyId = parameter.getString('studyId', '')
  const studentHistoryId = parameter.getString('studentHistoryId', '')
  const step = parameter.getString('step', '')
  const type = parameter.getString('type', '')

  const [payload, status, error] = await executeRequestAction(
    PreK.dodoQuiz(token, { studyId, studentHistoryId, step, type }),
  )
  if (error) {
    return RouteResponse.commonError()
  }
  return RouteResponse.response(payload, status)
}
