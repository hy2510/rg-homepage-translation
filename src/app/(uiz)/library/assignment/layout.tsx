import SITE_PATH from '@/app/site-path'
import { ReactNode } from 'react'
import { BackLink } from '@/ui/common/common-components'

export default function Layout({ children }: { children?: ReactNode }) {
  return (
    <div className="pd-top-m">
      <BackLink href={SITE_PATH.LIBRARY.HOME} largeFont>
        진행중인 학습
      </BackLink>
      <div className="mg-bottom-m"></div>
      {children}
    </div>
  )
}
