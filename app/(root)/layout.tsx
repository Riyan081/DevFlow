import React from 'react'
import Navbar from '@/components/navigation/navbar/navbar'
import { ReactNode } from 'react'
import LeftSidebar from '@/components/navigation/LeftSidebar'
import RightSidebar from '@/components/navigation/RightSidebar'
const RootLayout = ({children}:{children:ReactNode}) => {
  return (
    <main className="bg-white dark:bg-[#0D0D0D] h-[100vh]  relative">
      <Navbar/>
      <div className="flex ">
        <LeftSidebar/>
        <section className="flex-1 flex flex-col  px-6 pt-6 max-md:pd-14 sm:px-14 h-[89vh]">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </section>
        <RightSidebar/>
      </div>
    </main>
  )
}

export default RootLayout