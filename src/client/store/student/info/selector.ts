import { useRootCreateStore } from '../../store'

export const useStudentInfoAction = () => {
  return useRootCreateStore((state) => state.student.info.action)
}

export const useStudentInfo = () => {
  return useRootCreateStore((state) => state.student.info)
}

export const useStudentIsLogin = () => {
  return !!useRootCreateStore((state) => state.student.info).payload.studentId
}
