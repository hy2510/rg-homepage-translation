import { executeWithAuth, makeRequest } from '../../utils'
import { ApiResponse } from '@/http/common/response'
import { Todo, makeTodo } from '../../object/todo'

type Input = {
  sortColumn?: string
  page?: number
}

type Output = {
  todo: Todo[]
  count: number
}

async function action(input?: Input): Promise<ApiResponse<Output>> {
  const page = input?.page || 1
  const sortColumn = input?.sortColumn || 'RegistDate'
  const request = makeRequest(
    `api/library/todo?page=${page}&sortColumn=${sortColumn}`,
    {
      method: 'get',
    }
  )
  return await executeWithAuth(request, (json): Output => {
    return {
      todo: json.Todo.map((item: any): Todo => makeTodo(item)),
      count: Number(json.Todo.length),
    }
  })
}

export { action as getTodo }
export type { Output as TodosResponse }

function newInstance(): Output {
  return {
    todo: [],
    count: 0,
  }
}
export { newInstance as newTodo }
