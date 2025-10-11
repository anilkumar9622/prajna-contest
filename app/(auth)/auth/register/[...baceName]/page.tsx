
"use client"
import Login from '@/components/auth/login';
import ComponentsAuthRegisterForm from '@/components/auth/register';
import IconFacebookCircle from '@/components/icon/icon-facebook-circle';
import IconGoogle from '@/components/icon/icon-google';
import IconInstagram from '@/components/icon/icon-instagram';
import IconTwitter from '@/components/icon/icon-twitter';
import Link from 'next/link';
import React, { useState } from 'react';

const BoxedSignUp = () => {
 const [loader, setLoader] = useState(false); 

    return (
        <>
        {loader && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999999]">
      <div className="w-16 h-16 border-4 border-gray-200 border-t-[#4f46e5] rounded-full animate-spin"></div>
    </div>}
            <header className="z-40 fixed top-0 left-0 w-full">
                <div className="relative flex w-full items-center justify-between px-5 py-2 
                  bg-white/60 dark:bg-black/30 
                  backdrop-blur-md shadow-sm
                   border-b md:border-0">
                    <div className="horizontal-logo flex items-center">
                        <Link href="/" className="flex items-center">
                            <img
                                src="/assets/images/auth/logo-mob.png"
                                alt="logo"
                                className="w-8"
                            />
                        </Link>
                    </div>

                    {/* Subtitle / Large Text */}
                    <div className="ml-4 text-lg font-extrabold text-[#493f8f] dark:text-white">
                        {/* Show only on mobile (smaller than md) */}
                        <span className="block md:hidden">BACE</span>

                        {/* Show on md+ (tablet/desktop) */}
                        <span className="hidden md:block">
                            Bhaktivedanta Academy for Culture and Education
                        </span>
                    </div>
                    <div className="ml-auto text-sm">
                        {" "}
                    <button type="button" className="underline text-primary font-bold cursor-pointer">
                       <Login isToggle={true}/>
                    </button>
                        {/* <Login /> */}
                    </div>
                </div>
            </header>
            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat lg:px-6 md:px-4 py-10 dark:bg-[#060818] px-0 ">
                <div className="absolute inset-0">
                    <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
                </div>
                <img src="/assets/images/auth/coming-soon-object1.png" alt="image" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
                <img src="/assets/images/auth/coming-soon-object2.png" alt="image" className="absolute left-24 top-0 h-40 md:left-[30%]" />
                <img src="/assets/images/auth/coming-soon-object3.png" alt="image" className="absolute right-0 top-0 h-[300px]" />
                <img src="/assets/images/auth/polygon-object.svg" alt="image" className="absolute bottom-0 end-[28%]" />
                <div className="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)] lg:mt-10 md:mt-8">

                    <div
                        className="relative flex flex-col justify-center rounded-md bg-white px-6  backdrop-blur-lg dark:bg-black/50 lg:min-h-[658px]"
                    >
                        <div className="mx-auto w-full max-w-[640px] ">
                            <div className="py-10">
                                <h1 className="text-xl font-extrabold uppercase !leading-snug text-primary md:text-xl lg:text-xl" style={{ color: "#493f8f" }}>Registration - PRAJÑĀ CONTEST 2026</h1>
                                <p className="text-base font-bold leading-normal text-white-dark text-sm md:text-md lg:text-md">A Value Education Contest for Students</p>
                            </div>

                            <ComponentsAuthRegisterForm setLoader={setLoader}/>

                            <div className="relative my-7 text-center md:mb-9">
                                <span className="absolute inset-x-0 top-1/2 h-px w-full -translate-y-1/2 bg-white-light dark:bg-white-dark"></span>
                                <span className="relative bg-white px-2 font-bold uppercase text-white-dark dark:bg-dark dark:text-white-light">or</span>
                            </div>
                            <div className="mb-10 md:mb-[20px]">
                                <ul className="flex justify-center gap-3.5 text-white">
                                    <li>
                                        <Link
                                            href="#"
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-full p-0 transition hover:scale-110"
                                            style={{ background: 'linear-gradient(135deg, rgba(239, 18, 98, 1) 0%, rgba(67, 97, 238, 1) 100%)' }}
                                        >
                                            <IconInstagram />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="#"
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-full p-0 transition hover:scale-110"
                                            style={{ background: 'linear-gradient(135deg, rgba(239, 18, 98, 1) 0%, rgba(67, 97, 238, 1) 100%)' }}
                                        >
                                            <IconFacebookCircle />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="#"
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-full p-0 transition hover:scale-110"
                                            style={{ background: 'linear-gradient(135deg, rgba(239, 18, 98, 1) 0%, rgba(67, 97, 238, 1) 100%)' }}
                                        >
                                            <IconTwitter fill={true} />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="#"
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-full p-0 transition hover:scale-110"
                                            style={{ background: 'linear-gradient(135deg, rgba(239, 18, 98, 1) 0%, rgba(67, 97, 238, 1) 100%)' }}
                                        >
                                            <IconGoogle />
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BoxedSignUp;
