import React from 'react'
import Navbar from '@/components/navigation/navbar/navbar'
import { ReactNode } from 'react'
const RootLayout = ({children}:{children:ReactNode}) => {
  return (
    <main>
    <Navbar/>
    <div>{children}</div>
    </main>
  )
}

export default RootLayout