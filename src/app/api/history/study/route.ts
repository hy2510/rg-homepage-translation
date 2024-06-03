import { getAuthorizationWithCookie } from '@/authorization/server/nextjsCookieAuthorization'
import { NextRequest } from 'next/server'
import History from '@/repository/server/history'
import { RouteResponse, executeRequestAction, getParameters } from '../../_util'

export async function GET(request: NextRequest) {
  const token = getAuthorizationWithCookie().getActiveAccessToken()
  if (!token) {
    return RouteResponse.invalidAccessToken()
  }

  const parameter = await getParameters(
    request,
    'type',
    'keyword',
    'startDate',
    'endDate',
    'status',
  )

  const type = parameter.getString('type', '')
  const keyword = parameter.getString('keyword', '')
  const startDate = parameter.getString('startDate', '')
  const endDate = parameter.getString('endDate', '')
  const pStatus = parameter.getString('status', '')

  const action =
    type === 'Date'
      ? History.studyReport(token, {
          startDate,
          endDate,
          status: pStatus,
        })
      : History.studyReportSearch(token, {
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          keyword,
          status: pStatus,
        })

  const [payload, status, error] = await executeRequestAction(action)
  if (error) {
    return RouteResponse.commonError()
  }
  return RouteResponse.response(payload, status)
}
