import 'server-only'
import { makeRequest as commonMakeRequest } from '@/http/common/utils'
import { http } from '@/http/core/call'
import { HttpRequest, HttpRequestOption } from '@/http/core/request'

// FIXME : 서버 요청 URL 설정 필요
// export const API_BASE_URL = 'http://localhost:4000/'
export const API_BASE_URL = 'http://appdev.readinggate.com:18081/'
const BASE_VERSION = 'v1'

export function makeRequest({
  customer,
  token,
  path,
  ver,
  option,
}: {
  customer?: string
  token?: string
  path: string
  ver?: string
  option?: HttpRequestOption
}): HttpRequest {
  const baseUrl = `${API_BASE_URL}${ver ? `${ver}/` : `${BASE_VERSION}/`}`
  let wrapOption: HttpRequestOption | undefined = option
  if (token) {
    if (wrapOption) {
      if (wrapOption.headers) {
        wrapOption.headers.Authorization = `Bearer ${token}`
      } else {
        wrapOption.headers = {
          Authorization: `Bearer ${token}`,
        }
      }
    } else {
      wrapOption = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    }
  } else if (customer) {
    if (wrapOption) {
      if (wrapOption.headers) {
        wrapOption.headers.Customer = customer
      } else {
        wrapOption.headers = {
          Customer: customer,
        }
      }
    } else {
      wrapOption = {
        headers: {
          Customer: customer,
        },
      }
    }
  }
  return commonMakeRequest(baseUrl, path, wrapOption)
}

export async function execute(request: HttpRequest): Promise<ApiResponse> {
  const payload: ApiResponse = {
    ok: false,
    status: 500,
  }
  try {
    const response = await http.call(request)
    payload.ok = response.ok
    payload.status = response.status
    if (response.ok) {
      payload.data = await response.json()
    } else {
      payload.extra = await response.json()
    }
  } catch (error) {}
  return payload
}

export interface ApiResponse {
  ok: boolean
  status: number
  data?: any
  extra?: any
}
