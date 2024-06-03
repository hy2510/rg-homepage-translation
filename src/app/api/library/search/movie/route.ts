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
    'level',
    'status',
    'genre',
    'sort',
    'page',
  )
  const level = parameter.getString('level').toUpperCase()
  const bookType = 'EB'
  const pStatus = parameter.getString('status', 'All')
  const genre = parameter.getString('genre', 'All')
  const sort = parameter.getString('sort')
  const page = parameter.getNumber('page', 1)

  const [payload, status, error] = await executeRequestAction(
    Library.searchMovie(token, {
      level,
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
