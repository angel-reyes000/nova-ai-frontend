"use client"

import '../styles/all.css';
import Image from 'next/image';
import Logo from '../../public/images/LogoNovaAI.png';
import Link from 'next/link';
import { useState } from 'react';

export default function Signup() {
  const [name, setName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  async function postUser (e: any) {
    e.preventDefault();
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          last_name: lastName,
          email: email,
          password: password
        })
      })
    } catch (error: any) {
      console.log("Error in postUser", error.message);
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
              <p className='text-sm whitespace-nowrap'>Sign up to continue chatting with your AI assistant.</p>
            </div>
          </div>
          <form onSubmit={postUser} className='flex flex-col gap-3 bg-[rgba(108,0,0,0.20)] border-1 border-gray-800 rounded-2xl p-5'>
            <div className='flex flex-wrap justify-between gap-3'>
              <label className='flex flex-col text-medium font-medium w-full gap-1'>
                Name:
                <input value={name} onChange={(e) => setName(e.target.value)} className='text-sm font-normal py-2 px-1 outline-2 outline-red-800 focus:outline-red-800 rounded-sm' placeholder='name' />
              </label>
              <label className='flex flex-col text-medium font-medium w-full gap-1'>
                Last name:
                <input value={lastName} onChange={(e) => setLastName(e.target.value)} className='text-sm font-normal py-2 px-1 outline-2 outline-red-800 focus:outline-red-800 rounded-sm' placeholder='last name' />
              </label>
              <label className='flex flex-col text-medium font-medium w-full gap-1'>
                Email:
                <input value={email} onChange={(e) => setEmail(e.target.value)} className='text-sm font-normal py-2 px-1 outline-2 outline-red-800 focus:outline-red-800 rounded-sm' type='email' placeholder='email' />
              </label>
              <label className='flex flex-col text-medium font-medium w-full gap-1'>
                Password:
                <input value={password} onChange={(e) => setPassword(e.target.value)} className='text-sm font-normal py-2 px-1 outline-2 outline-red-800 focus:outline-red-800 rounded-sm' type='password' placeholder='password'/>
              </label>
            </div>
            <div className='h-full mt-8'>
              <button type='submit' className='h-full w-full bg-red-600 font-medium text-lg p-2 rounded-lg cursor-pointer active:scale-95 hover:bg-red-800'>Sign up</button>
            </div>
            <div className='text-center'>
              <p>or</p>
            </div>
            <div className='flex items-cenetr justify-center'>
              <button className='w-full'>Cuadro google</button>
            </div>
            <div className='text-center'>
              <p>Already have an account? <Link href='/login' className='text-blue-400 underline'>Log in</Link></p>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}