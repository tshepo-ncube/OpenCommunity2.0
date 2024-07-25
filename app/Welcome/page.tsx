import React from 'react'
import Image from 'next/image'
import SkyLine from "@/lib/images/CitySkyLine.png";
import OBLogo from "@/lib/images/OBLogo.png";
import OCLogo from "@/lib/images/Logo1.png";
import { Button } from '@mui/material';


const Welcome = () => {
  return (
    <div className='relatie min-h-screen bg-white flex flex-col items-center pt-14'>
            <div className="mb-4">
                <Image
                    src={OCLogo}
                    alt='Open Box Logo'
                    width={400}
                    height={400}
                />
            </div>
            <div className="mt-4 px-6 py-2 bg-openbox-green text-white rounded-md">
                Get Started
            </div>
            <div className='absolute bottom-0 w-full'>
                <Image
                    src={SkyLine}
                    alt='Open Box Skyline'
                    layout='responsive'
                    width={1920}
                    height={1080}
                    className='object-cover'
                />
            </div>
    </div>
  )
}

export default Welcome