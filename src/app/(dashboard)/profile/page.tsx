'use client'

import { Button } from '@/components/ui/button';
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import React from 'react'

export default function ProfilePage() {
  
  const { data: session, status } = useSession();

  const userMail = session?.user?.email;

  return (
    <div className='flex flex-col gap-10 items-center justify-center w-full h-full'>
      {/* head */}
        <div className='mx-auto flex flex-col items-center gap-2 justify-center'>
          <Image
            src={`https://avatar.iran.liara.run/public/15`}
            className=" flex-shrink-0 rounded-full"
            width={100}
            height={100}
            alt="Avatar"
          />
          <p className='text-xl font-semibold text-gray-700'>{userMail}</p>
        </div>

        <div className=' flex w-2/6 items-center justify-between bg-slate-200 hover:bg-slate-300 transition-all  p-2 rounded-lg '>
          <p>Email:</p>
          <p>{userMail}</p>
        </div>

        <Button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex-shrink-0 relative inline-flex h-10 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full px-4 cursor-pointer items-center justify-center rounded-full bg-slate-100 p-2 text-sm font-medium text-black backdrop-blur-3xl">
              Logout
          </span>
        </Button>
    </div>
  )
}
