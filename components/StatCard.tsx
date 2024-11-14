import clsx from 'clsx'
import React from 'react'
import Image from 'next/image'

interface StatCardProps {
    type: 'appointments' | 'pending' | 'cancelled',
    count: number,
    label: string,
    icon: string,
}

// clsx allow us to modify the card depending on dynamic property

const StatCard = ({count = 0, label, type, icon}: StatCardProps) => {
  return (
    <div className={clsx('stat-card', {
        'bg-appointments': type === 'appointments',
        'bg-pending': type === 'pending',
        'bg-cancelled': type === 'cancelled'
    })}>
        <div className="flex items-center gap-4">
            <Image
                src={icon}
                alt={label}
                width={32}
                height={32}
                className='size-8 w-fit'
            />
            <h2 className='text-32-bold text-white'>{count}</h2>
        </div>

        <p className="text-14-regular">{label}</p>
    </div>
  )
}

export default StatCard