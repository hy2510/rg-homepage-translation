import { executeWithAuth, makeRequest } from '../utils'
import { ApiResponse } from '@/http/common/response'
import { StudyReport, makeStudyReport } from '../object/study-report'

type Input = {
  startDate: string
  endDate: string
  status: string
}

type Output = StudyReport[]

async function action(input: Input): Promise<ApiResponse<Output>> {
  const request = makeRequest(
    `api/history/study?type=Date&startDate=${input.startDate}&endDate=${input.endDate}&status=${input.status}`,
    {
      method: 'get',
    }
  )
  return await executeWithAuth(request, (json): Output => {
    return json.History.map((item: any) => {
      return makeStudyReport(item)
    })
  })
}

export { action as getStudyReport }
export type { Output as StudyReportResponse }

function newInstance(): Output {
  return []
}
export { newInstance as newStudyReport }
