import RegisterForm from '@/components/forms/RegisterForm'
import { getUser } from '@/lib/actions/patients.actions'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

// get the user Id from params
const Register = async ({params: {userId}}: SearchParamProps) => {
  // get the already entered info like email, name, phone of registaring user
    const user = await getUser(userId);

    return (
        <div className="flex h-screen max-h-screen">
            <section className="remove-scrollbar container">
                <div className="sub-container max-w-[860px] flex-1 flex flex-col py-10">
                    <Image
                        src="/assets/icons/logo-full.svg"
                        alt="doctor"
                        height={1000}
                        width={1000}
                        className="mb-12 h-10 w-fit"
                    />

                    {/* now that we have the user passed it to the register form */}
                    <RegisterForm user={user}/>

                    <p className="copyright py-12">@ 2024 Care Plus</p>
                </div>
            </section>

            <Image
                src="/assets/images/register-img.png"
                alt="patient"
                height={1000}
                width={1000}
                className="side-img max-w-[390px]"
            />
        </div>
    )
}

export default Register