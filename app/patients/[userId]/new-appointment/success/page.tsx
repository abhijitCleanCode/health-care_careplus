import { Doctors } from '@/constants'
import { getAppointment } from '@/lib/actions/appointment.actions'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Success = async ({ params: { userId }, searchParams }: SearchParamProps) => {
  // appointmentId is passed to url as query params
  const appointmentId = (searchParams?.appointmentId as string) || ""
  // get the actual appointment based on appointment ID
  const appointment = await getAppointment(appointmentId);
  const doctor = Doctors.find((doc) => doc.name === appointment.primaryPhysician)

  return (
    <div className='flex h-screen max-h-screen px-[5%]'>
      <div className="success-img">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.svg"
            alt="logo"
            height={1000}
            width={1000}
            className='h-10 w-fit'
          />
        </Link>

        <section className='flex flex-col items-center'>
          <Image
            src="/assets/gifs/success.gif"
            alt="success"
            width={280}
            height={300}
          />
          <h2 className='header mb-6 max-w-[600px] text-center'>
            Your <span className='text-green-500'>appointment request </span> has been successfully submitted!
          </h2>
          <p>We will be in touch shortly to confirm.</p>
        </section>

        <section className='request-details'>
          <p>Requested appointment details</p>
          <div className='flex items-center gap-3'>
            {/* {<Image />} */}
          </div>
        </section>

        <section className='request-details'>
          <p>Requested appointment details</p>
          <div className="flex items-center gap-3">
            <Image
              src={doctor?.image!}
              alt="doctor"
              width={100}
              height={100}
              className='size-6'
            />
          </div>
        </section>
      </div>
    </div>
  )
}

export default Success

// this page is within dynamic folder []. So, we can get access to that dynamic search params
// the url of this page: https://localhost:3000/patients/123/new-appointment/success?appointmentId=123
// appointmentId is query param and u can have as many in URL and u can extract all these from url