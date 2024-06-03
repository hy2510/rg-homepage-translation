'server-only'

import { makeRequest, execute } from './utils'

const BASIC_PATH = 'readingking'
const getPath = (path: string): string => {
  return `${BASIC_PATH}/${path}`
}

async function eventList(token: string) {
  const request = makeRequest({
    token,
    path: getPath('event'),
    option: {
      method: 'get',
    },
  })
  return await execute(request)
}

async function prizeList(token: string, input: { eventId: string }) {
  const request = makeRequest({
    token,
    path: getPath(`event/prize/${input.eventId}`),
    option: {
      method: 'get',
    },
  })
  return await execute(request)
}

async function setPrize(
  token: string,
  input: { eventId: string; prizeId: string }
) {
  const request = makeRequest({
    token,
    path: getPath('event/prize'),
    option: {
      method: 'post',
      body: {
        eventId: input.eventId,
        eventPrizeId: input.prizeId,
      },
    },
  })
  return await execute(request)
}

async function eventDetail(token: string, input: { eventId: string }) {
  const request = makeRequest({
    token,
    path: getPath(`event/${input.eventId}`),
    option: {
      method: 'get',
    },
  })
  return await execute(request)
}

const ReadingKing = {
  eventList,
  prizeList,
  setPrize,
  eventDetail,
}
export default ReadingKing
