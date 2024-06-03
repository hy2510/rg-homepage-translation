'server-only'
import { makeRequest, execute } from './utils'

const BASIC_PATH = 'ranking'
const getPath = (path: string): string => {
  return `${BASIC_PATH}/${path}`
}

async function pointMonthly(token?: string, customer?: string) {
  const request = makeRequest({
    token,
    customer,
    path: getPath('point/monthly'),
    option: {
      method: 'get',
    },
  })
  return await execute(request)
}

async function pointTotal(token?: string, customer?: string) {
  const request = makeRequest({
    token,
    customer,
    path: getPath('point/total'),
    option: {
      method: 'get',
    },
  })
  return await execute(request)
}

async function readingking(
  token?: string,
  customer?: string,
  input?: {
    eventId: string
  }
) {
  const request = makeRequest({
    token,
    customer,
    path: getPath('readingking'),
    option: {
      method: 'get',
      queryString: {
        eventId: input?.eventId,
      },
    },
  })
  return await execute(request)
}

const Ranking = {
  pointMonthly,
  pointTotal,
  readingking,
}
export default Ranking
