import React from 'react'
import BlurFade from '../magicui/blur-fade'
import Link from 'next/link';
import { Cover } from "@/components/ui/cover";
import { FlipWords } from '../ui/flip-words';

const HeroSection = () => {
    const BLUR_FADE_DELAY = 0.04;

    const words = ["Tasks", "Time"];

  return (
    <div className=' flex w-full mx-auto items-center p-2 justify-center h-[80vh] md:h-[100vh]'>
        <BlurFade delay={BLUR_FADE_DELAY * 15}>
            <div className=' flex flex-col gap-5'>
                <div className=' flex flex-col gap-5'>
                    <h2 className="text-3xl md:text-5xl text-center md:text-left font-bold">
                        <span className='text-red-500'>Timetaskr</span> - Master Your <br />
                        <FlipWords words={words} /> <br />
                        {/* <Cover>Tasks</Cover>, Master Your Time */}
                    </h2>
                    <p className='text-gray-600 text-base text-center md:text-lg'>
                        Effortless task and time management for organized, productive days.
                    </p>
                </div>
                <div className=' w-3/5 mx-auto flex flex-col gap-5'>
                    <Link href='/sign-in'>
                        <button className="w-full relative inline-flex h-10 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                            <span className="inline-flex h-full w-full px-4 cursor-pointer items-center justify-center rounded-full bg-slate-100 p-2 text-sm font-medium text-black backdrop-blur-3xl">
                                Get Started for Free ✨
                            </span>
                        </button>
                    </Link>
                    <p className=' text-gray-600 text-xs text-center md:text-base'>Unlimited free trial. No credit card required.</p>
                </div>
            </div>
        </BlurFade>
    </div>
  )
}

export default HeroSection