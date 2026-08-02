"use client"

import { FaUser, FaLock, FaInfo } from "react-icons/fa";
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FaExclamationTriangle, FaCheck } from 'react-icons/fa';
import '../styles/all.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useRouter } from "next/navigation";

const list_tools = (
    <ul className="list-disc px-6">
        <li><strong>Frontend: </strong>Next.js with TypeScript and Tailwind CSS, deployed on Vercel.</li>
        <li><strong>Backend: </strong>Node.js with TypeScript using Express.js, deployed on Railway.</li>
        <li><strong>DataBase: </strong>PostgreSQL managed with pgAdmin, deployed on Railway.</li>
        <li><strong>Authentication & Security:</strong> Implemented secure user authentication with JWT, password encryption using bcrypt, and Google OAuth 2.0 integration.</li>
    </ul>
)

const description = (
<p className="text-[0.9rem] text-gray-400 whitespace-pre-wrap px-2 max-w-[90%]">
{`This application was created for the purpose of practicing and using the Gemini API.
The technologies used were:`}{list_tools}
{`
Thanks for reading!
`}
</p>
)

export default function Settings () {
    const [name, setName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [sessionCreated, setSessionCreated] = useState<string>('');

    const [detailsVersion, setDetailsVersion] = useState<boolean>(false);
    const [detailsContact, setDetailsContact] = useState<boolean>(false);
    const [detailsInfo, setDetailsInfo] = useState<boolean>(false);
    const [messageDelete, setMessageDelete] = useState<boolean>(false);

    const refModalClearAll = useRef<any>(null);

    const router = useRouter();

    useEffect(() => {

        refModalClearAll.current.style.display = 'none';

        const token = localStorage.getItem('token')

        // if (!token) {
        //     router.push('/');
        //     return
        // }

        AOS.init({
            once: true,
        })

        async function getCurrentUser () {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/currentUser`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                const data = await response.json();
                console.log(data)

                setName(data.name);
                setLastName(data.last_name);
                setEmail(data.email);
                setSessionCreated(data.date?.replace('T', ' ').slice(0, 19))

            } catch (error: any) {
                console.log("error in getCurrentUser: ", error.message)
            }
        }
        getCurrentUser();
    }, [])

    async function deleteConversations () {

        const token = localStorage.getItem('token');

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/conversations`, {
            method: 'DELETE',
            headers: {
                authorization: `Bearer ${token}`,
            }
        })

        if (response.status != 200) {
            console.log("error in deleteConversation");
            return;
        };

        const data = await response.json();

        refModalClearAll.current?.close()
        refModalClearAll.current.style.display = 'none';
        setMessageDelete(true);

        setTimeout(() => setMessageDelete(false), 5000);

        console.log("DELETED", data);

    }

    return (
        <>
            <div className="min-h-full">
                <div className={"flex flex-cols items-center justify-center fixed right-[20px] top-20 py-1 px-2 text-white bg-green-800 rounded-xl border-1" + (messageDelete ? ' message_delete ' : ' hidden ')}>
                    <FaCheck size={15} />
                    <h1 className="p-2 text-[0.9rem]">Your conversations were deleted successfully</h1>
                </div>
                <dialog ref={refModalClearAll} data-aos="fade-up" className="flex flex-col items-center max-w-[400px] text-center p-3 m-auto rounded-lg bg-black text-white">
                    <h1 className="font-bold">Delete conversations?</h1>
                    <div className="flex justify-center w-full my-4">
                        <FaExclamationTriangle size={70} />
                    </div>
                    <p>Are you sure you want to clear all conversations? This action will permanently delete all your conversations.</p>
                    <div className="flex justify-around w-full my-4">
                        <button onClick={() => {
                            refModalClearAll.current?.close()
                            refModalClearAll.current.style.display = 'none';
                        }} className="p-2 w-1/3 border-2 border-gray-400 rounded-lg cursor-pointer active:scale-90 hover:bg-gray-800">Cancel</button>
                        <button onClick={() => deleteConversations()} className="p-2 w-1/3 bg-red-400 rounded-lg cursor-pointer active:scale-90 hover:bg-red-900">Delete</button>
                    </div>
                </dialog>
                <div className="flex flex-col p-10 gap-5 h-full min-h-fit text-white bg-linear-to-b from-black to-[rgb(60,0,0)]">
                    <div>
                        <p className="p-0 m-0 w-fit text-[1.1rem] hover:cursor-pointer hover:underline hover:text-blue-400"><Link href={'/'}>{'< return'}</Link></p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h1 className="text-5xl">Settings</h1>
                        <p className="text-md">Customize your experience and manage your preferences.</p>
                    </div>
                    <div className="flex flex-col lg:flex-row flex-wrap gap-5">
                        <div className="flex flex-col bg-[rgb(30,30,30)] w-full lg:w-[45%] p-3 gap-3 rounded-xl">
                            <div className="flex flex-col">
                                <h2 className="flex items-center gap-2 font-bold text-[1.2rem]" ><FaUser className="inline" />Account</h2>
                            </div>
                            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                                <div className="w-[45%]">
                                    <h3 className="font-semibold text-[1.1rem]">Name</h3>
                                    <p className="text-gray-400">{name}</p>
                                </div>
                                <div className="w-[45%]">
                                    <h3 className="font-semibold text-[1.1rem]">Last name</h3>
                                    <p className="text-gray-400">{lastName}</p>
                                </div>
                                <div className="w-[45%]">
                                    <h3 className="font-semibold text-[1.1rem]">Email</h3>
                                    <p className="text-gray-400">{email}</p>
                                </div>
                                <div className="w-[45%]">
                                    <h3 className="font-semibold text-[1.1rem]">Session created</h3>
                                    <p className="text-gray-400">{sessionCreated}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col bg-[rgb(30,30,30)] w-full lg:w-[45%] p-3 gap-3 rounded-xl">
                            <div className="flex flex-col">
                                <h2 className="flex items-center gap-2 font-bold text-[1.2rem]" ><FaLock className="inline" />Data & privacity</h2>
                            </div>
                            <div className="flex flex-col flex-wrap">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-[100%] gap-3">
                                    <div className="w-full">
                                        <h3 className="font-semibold text-[1.1rem]">Clear all conversations</h3>
                                        <p className="text-gray-400">This will permanently delete all your conversations</p>
                                    </div>
                                    <div className="border-1 border-red-500 rounded-lg active:scale-90 w-[40%] sm:w-[15%] hover:bg-[rgb(25,25,25)]">
                                        <button onClick={() => {
                                            refModalClearAll.current?.showModal()
                                            refModalClearAll.current.style.display = 'block'
                                        }} className="w-full h-full p-2 cursor-pointer">Clear</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col bg-[rgb(30,30,30)] w-full lg:w-[45%] p-3 gap-3 rounded-xl">
                            <div className="flex flex-col">
                                <h2 className="flex items-center gap-2 font-bold text-[1.2rem]">
                                    <span className="flex justify-center items-center p-2 border-2 border-red-500 rounded-3xl">
                                        <FaInfo className="inline" size={15} />
                                    </span>About
                                </h2>
                            </div>
                            <div className="flex flex-col flex-wrap gap-3">
                                <details onClick={() => setDetailsVersion(!detailsVersion)} className="cursor-pointer">
                                    <summary className="flex justify-between items-center list-none">Version
                                        <span className={"text-[1.2rem]" + (detailsVersion ? ' rotate-90 ' : '')} >{'>'}</span>
                                    </summary>
                                    <p className="text-[0.9rem] text-gray-400 px-2">Version 1.0.0</p>
                                </details>
                                <details onClick={() => setDetailsContact(!detailsContact)} className="cursor-pointer">
                                    <summary className="flex justify-between items-center list-none">Contact and suggestions
                                        <span className={"text-[1.2rem]" + (detailsContact ? ' rotate-90 ' : '')} >{'>'}</span>
                                    </summary>
                                    <p className="text-[0.9rem] text-gray-400 w-fit px-2">Contact me: <a href="mailto:ar731684@gmail.com" className="hover:underline" style={{color: 'rgb(107, 169, 255)'}}>ar731684@gmail.com</a></p>
                                </details>
                                <details onClick={() => setDetailsInfo(!detailsInfo)} className="cursor-pointer">
                                    <summary className="flex justify-between items-center list-none">Description
                                        <span className={"text-[1.2rem]" + (detailsInfo ? ' rotate-90 ' : '')} >{'>'}</span>
                                    </summary>
                                    <p className="text-[0.9rem] text-gray-400 whitespace-pre-wrap px-2 max-w-[100%]">
                                        {description}
                                    </p>
                                </details>
                            </div>
                        </div>
                    </div>
                </div>  
            </div>
            
        </>
    )
}