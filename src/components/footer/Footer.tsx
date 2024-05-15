import React from 'react'

const Footer = () => {
  return (
    <div className='bg-slate-900 text-white'>
        <div className='w-[95%] md:w-[80%]  mx-auto grid grid-cols-2 md:grid-cols-4 py-6 gap-2'>
        <div>
            <h1 className='text-xl'>Books</h1>
            <p className='text-sm text-gray-500'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Blanditiis dolore, neque at saepe officiis dignissimos</p>
        </div>
        <div>
            Category
        </div>
        <div>
            contact
        </div>
        <div>
            About
        </div>
        </div>
    </div>
  )
}

export default Footer