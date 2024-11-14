'use client'

import { decryptKey, encryptKey } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"



const PasskeyModal = () => {
    const router = useRouter(); // when a dialog is closed, then set admin to false
    const path = usePathname();
    const [open, setOpen] = useState(false);
    const [passkey, setPasskey] = useState("");
    const [error, setError] = useState("");

    // if user is at browser, get the encrypted passkey.
    const encryptedKey = typeof window !== "undefined" ? window.localStorage.getItem("accessKey") : null
    // using useEffect check whether the encrypted key exist, if yes then decrypt it
    useEffect(() => {
        // decrypt the enctypted pass key
        const accessKey = encryptedKey && decryptKey(encryptedKey);

        // if it exist then we are at client side
        if (path) {
            if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
                setOpen(false);
                router.push("/admin");
            } else {
                setOpen(true);
            }
        }
    }, [encryptKey]) // must call on every encrypted key change


    const validatePasskey = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        // for the time being passkey is stored in env variable
        if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
            const encryptedKey = encryptKey(passkey);

            localStorage.setItem('accessKey', encryptedKey);

            setOpen(false);
        } else {
            setError("Invalid passkey. Please try again");
        }
    }

    const closeModal = () => {
        setOpen(false);
        router.push("/"); // to go home without admin = true
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className="shad-alert-dialog">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-start justify-between">
                        Admin Access Verification
                        <Image
                            src="/assets/icons/close.svg"
                            alt="close"
                            width={20}
                            height={20}
                            onClick={() => closeModal()}
                            className="cursor-pointer"
                        />
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        To access the admin page, please enter the passkey.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div>
                    <InputOTP
                        maxLength={6}
                        value={passkey}
                        onChange={(value) => setPasskey(value)}
                    >
                        <InputOTPGroup className="shad-otp">
                            <InputOTPSlot className="shad-otp-slot" index={0} />
                            <InputOTPSlot className="shad-otp-slot" index={1} />
                            <InputOTPSlot className="shad-otp-slot" index={2} />
                            <InputOTPSlot className="shad-otp-slot" index={3} />
                            <InputOTPSlot className="shad-otp-slot" index={4} />
                            <InputOTPSlot className="shad-otp-slot" index={5} />
                        </InputOTPGroup>
                    </InputOTP>

                    {error && (
                        <p className="shad-error text-14-regular mt-4 flex justify-center">
                            {error}
                        </p>
                    )}
                </div>
                <AlertDialogFooter>
                    <AlertDialogAction
                        onClick={(e) => validatePasskey(e)}
                        className="shad-primary-btn w-full"
                    >
                        Enter Admin Passkey
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default PasskeyModal