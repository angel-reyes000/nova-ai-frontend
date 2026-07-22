"use client"

import '../styles/all.css';
import Image from 'next/image';
import Logo from '../../public/images/LogoNovaAI.png'
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [access, setAccess] = useState<string>('');

  const router = useRouter();

  async function loginUser (e: any) {
    e.preventDefault();
    setAccess('Logging in...');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/loginUser`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      })

      localStorage.removeItem('token');

      if (response.status === 200) {
        const data = await response.json()
        localStorage.setItem('token', data.token);
        router.push('/');
      } else {
        setAccess('Invalid access.');
        console.log("ERROR: NO EXIST USER");
        setTimeout(() => setAccess(''), 3000);
      }
    } catch (error) {
      console.log("Error: ", error)
    }
  }

  return (
    <>
      <div className='flex items-center justify-center h-auto min-h-screen py-10 text-white bg_circles'>
        <div className='grid grid-rows-auto max-w-[90%] sm:max-w-[80%] md:max-w-[50%] lg:max-w-[25%] gap-5'>
          <div className='flex flex-col text-center gap-6'>
            <div className='flex items-center justify-center gap-2'>
              <Image src={Logo} width={80} height={80} alt='photo' />
              <h1 className='text-5xl flex flex-row font-bold tracking-widest'>NOVA-<span style={{color: 'rgb(231,8,11)'}}>IA</span></h1>
            </div>
            <div>
              <h2 className='text-3xl'>You're welcome!</h2>
              <p className='text-sm whitespace-nowrap'>Log in to continue chatting with your AI assistant.</p>
            </div>
          </div>
          <form onSubmit={loginUser} className='flex flex-col gap-3 bg-[rgba(108,0,0,0.20)] border-1 border-gray-800 rounded-2xl p-5'>
            <div className='flex flex-wrap justify-between gap-3'>
              <label className='flex flex-col text-medium font-medium w-full gap-1'>
                Email:
                <input value={email} onChange={(e) => setEmail(e.target.value)} maxLength={50} className='text-sm font-normal py-2 px-1 outline-2 outline-red-800 focus:outline-red-800 rounded-sm' type='email' placeholder='email' />
              </label>
              <label className='flex flex-col text-medium font-medium w-full gap-1'>
                Password:
                <input value={password} onChange={(e) => setPassword(e.target.value)} maxLength={100} className='text-sm font-normal py-2 px-1 outline-2 outline-red-800 focus:outline-red-800 rounded-sm' type='password' placeholder='password'/>
                <p className={'text-right text-[0.9rem] font-normal' + (access === 'Logging in...' ? ' text-blue-400 ' : ' text-red-500 ')}>{access}</p>
              </label>
            </div>
            <div className='h-full mt-8'>
              <button type='submit' className='h-full w-full bg-red-600 font-medium text-lg p-2 rounded-lg cursor-pointer active:scale-95 hover:bg-red-800'>Log in</button>
            </div>
            <div className='text-center'>
              <p>or</p>
            </div>
            <div className='flex items-cenetr justify-center'>
              <button className='w-full'>Cuadro google</button>
            </div>
            <div className='text-center'>
              <p>Don't have an account? <Link href='/signup' className='text-blue-400 underline'>Sign up.</Link></p>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
