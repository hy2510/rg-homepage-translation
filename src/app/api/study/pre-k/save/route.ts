import {
  RouteResponse,
  executeRequestAction,
  getBodyParameters,
} from '@/app/api/_util'
import { getAuthorizationWithCookie } from '@/authorization/server/nextjsCookieAuthorization'
import { NextRequest } from 'next/server'
import PreK from '@/repository/server/pre-k'

export async function POST(request: NextRequest) {
  const token = getAuthorizationWithCookie().getActiveAccessToken()
  if (!token) {
    return RouteResponse.invalidAccessToken()
  }

  const parameter = await getBodyParameters(
    request,
    'studyId',
    'studentHistoryId',
    'step',
    'studyEndYn',
    'dvc',
  )
  const studyId = parameter.getString('studyId')
  const studentHistoryId = parameter.getString('studentHistoryId')
  const step = parameter.getString('step')
  const studyEndYn = parameter.getString('studyEndYn')
  const dvc = parameter.getString('dvc', 'N')

  const [payload, status, error] = await executeRequestAction(
    PreK.save(token, {
      studyId,
      studentHistoryId,
      step,
      studyEndYn,
      dvc,
    }),
  )
  if (error) {
    return RouteResponse.commonError()
  }
  return RouteResponse.response(payload, status)
}
