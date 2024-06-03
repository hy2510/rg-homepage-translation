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
    'bookType',
    'level',
    'searchText',
    'status',
    'genre',
    'sort',
    'page',
  )
  const level = parameter.getString('level').toUpperCase()
  const bookType = parameter.getString('bookType').toUpperCase()
  const searchText = parameter.getString('searchText', '')
  const pStatus = parameter.getString('status', 'All')
  const genre = parameter.getString('genre', 'All')
  const sort = parameter.getString('sort')
  const page = parameter.getNumber('page', 1)

  const [payload, status, error] = await executeRequestAction(
    Library.searchSeries(token, {
      studyTypeCode: bookType === 'EB' ? '001006' : '001001',
      level,
      searchText,
      page: page,
      genre,
      sort,
      status: pStatus,
    }),
  )

  await executeRequestAction(
    Library.changeFilter(token, {
      type: bookType,
      genre,
      sort,
      status: pStatus,
    }),
  )

  if (error) {
    return RouteResponse.commonError()
  }
  return RouteResponse.response(payload, status)
}
