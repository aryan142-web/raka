"use client"
import Colors from '@/app/data/Colors'
import Lookup from '@/app/data/Lookup'
import PricingModel from '@/components/ui/custom/PricingModel'
import { UserDetailContext } from '@/context/UserDetailContext'
import React, { useContext, useState } from 'react'

function Pricing() {
    const {userDetail,setUserDetail}=useContext(UserDetailContext)
  return (
    <div className='mt-10 flex flex-col items-center w-full p-10 md:px-32 lg:px-48'>  
    <h2 className='font-bold text-5xl'> Pricing </h2>
    <p className='text-gray-400 max-w-xl text-center mt-4'>{Lookup.PRICING_DESC}</p>

    <div className='p-5 border rounded-xl w-full flex justify-between mt-7 items-center'
    style={{
        backgroundColor:Colors.BACKGROUND
    }}>
        <h2 className='text-lg'><span className='font-bold'>{userDetail?.token}</span> Token Left</h2>
        <div className='w-full flex justify-between'>
            <h2 className='font-medium'>Need more token?</h2>
            <p>Upgrade your plan below</p>
        </div>

    </div>
    <PricingModel/>
     </div>
  )
}

export default Pricing
