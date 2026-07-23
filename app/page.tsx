"use client"

import Logo from '../public/images/LogoNovaAI.png';
import Image from 'next/image';
import '../app/styles/all.css';
import { FaCircle, FaPlus, FaCommentDots, FaSearch, FaCog, FaEdit, FaMicrophone, FaUser, FaLongArrowAltRight, FaExclamationCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import './styles/all.css';
import { useRouter } from 'next/navigation';

const message_list = [
  {
    user: "algo del userWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    AI: "algo sobre la AIWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"
  },
  {
    user: "algo segundo user",
    AI: "algo segundo sobre la AI"
  },
  {
    user: "tercer text de user",
    AI: "tercer text de la AI"
  },
  {
    user: "algo segundo user",
    AI: "algo segundo sobre la AI"
  },
  {
    user: "tercer text de user",
    AI: "tercer text de la AI"
  }
]

export default function chatNovaAI() {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [inputUser, setInputUser] = useState<string>('');
  const [messages, setMessages] = useState<any>([]);
  const [conversations, setConversations] = useState<any>();
  const [conversationID, setConversationID] = useState<number>();

  const [titleModal, setTitleModal] = useState<string>('');
  const [textModal, setTextModal] = useState<string>('');
  const [textButtonModal, setTextButtonModal] = useState<string>('');

  const [token, setToken] = useState<boolean>(true);

  const refModalPrecuation = useRef<any>(null);

  const router = useRouter();

  // document.addEventListener("keydown", (e) => {
  //   if (e.key === "Enter") {
  //     setMessages([...messages, { user: inputUser, AI: "algo" }]);
  //     setInputUser('');
  //   }
  // })

  function invalidToken (): void {
    setToken(false);
    setTitleModal('Invalid access');
    setTextModal('You need to log in to start chatting with Angel-IA.')
    setTextButtonModal('Log in');
    refModalPrecuation.current.style.display = 'flex';
    refModalPrecuation.current.showModal();
    return
  };

  useEffect(() => {

    const token = localStorage.getItem('token');

    refModalPrecuation.current.style.display = 'none';

    if (!token) {
      invalidToken();
      return
    }

    const getConversations = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/conversations`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (response.status === 400) {
          invalidToken();
          return
        }

        const data = await response.json();
        setConversations(data);        
        
      } catch (error) {
        console.log("Error to get conversation");
      }
    }
    getConversations();

  }, [])

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   const getMessages = async () => {
  //     try {
  //       const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/messages/${conversationID}`, {
  //         method: 'GET',
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })

  //       const data = await response.json();

  //       console.log(data)

  //       setMessages([0,data,]);
  //       router.refresh()
  //       console.log(messages, 'dentro de messages')
        

  //     } catch (error) {
  //       console.log("Error in getMessages")
  //     }
  //   }
  //   getMessages()
  // }, [conversationID])

  async function postConversation () {

    const token = localStorage.getItem('token');
      
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/conversations`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.status !== 201) {
        console.log("Error at create conversation");
      }

      const data = await response.json();

      setConversations([...conversations, {id: data.id, title: data.title}])

    } catch (error) {
      console.log("Error in postConversation")
    }
  }

  const getMessages = async (conversation_id: number) => {
    const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/messages/${conversation_id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json();

        console.log(data)

        if (data.length > 0) {
          setMessages(data);
          console.log(messages, 'dentro de messages')
        } else {
          setMessages([])
        }

      } catch (error) {
        console.log("Error in getMessages")
      }
    }

  return (
    <>
      {/*----------------------INVALID ACCESS MODAL-----------------------------*/}
      <dialog ref={refModalPrecuation} className='flex flex-col justify-center items-center m-auto p-5 rounded-3xl outline-0 bg-black show_modal max-w-[300px] text-center gap-5'>
        {token ? (
          <div className='flex justify-end w-full'>
            <FaPlus onClick={() => {
              refModalPrecuation.current.close();
              refModalPrecuation.current.style.display = 'none';
            }} size={20} className='text-white rotate-45 cursor-pointer' />
          </div>
          ) : null}
        <h1 className='text-2xl font-bold text-white'>{titleModal}</h1>
        <FaExclamationTriangle size={100} className='text-yellow-500' />
        <p className='text-lg font-semibold text-white'>{textModal}</p>
        <button onClick={() => {
          localStorage.removeItem('token');
          router.push('/login');
        }} className='py-3 w-full text-white cursor-pointer hover:outline-1 hover:bg-gray-900 active:scale-90'>{textButtonModal}</button>
      </dialog>
      {/*----------------------FAKE MENU-----------------------------*/}
      <div className='flex flex-row bg-[rgb(103,103,103)]'>
        <div className={'flex flex-col justify-between items-center h-dvh p-1 text-white bg-[rgb(32,0,0)] border-r-1 hidden lg:flex' + (openMenu ? ' animation_menu ' : ' animation_close_menu ')}>
          <div className='flex flex-col justify-start w-full gap-10 max-h-[100%] overflow-hidden'>
            <div className={'flex flex-row px-2 py-3' + (openMenu ? ' justify-between ' : ' justify-center ')}>
              <FaCircle size={30} className='cursor-pointer' />
              <FaCircle size={30} className={openMenu ? '' : 'hidden'} />
            </div>
          </div>
        </div>
        {/*----------------------MENU-----------------------------*/}
        <div className={'flex flex-col justify-between fixed items-center h-dvh p-1 text-white bg-[rgb(32,0,0)] border-r-1 hidden lg:flex' + (openMenu ? ' animation_open_menu ' : ' animation_close_menu ')}>
          <div className='flex flex-col justify-start w-full gap-10 max-h-[100%] overflow-hidden'>
            <div className={'flex flex-row items-center px-2 py-3' + (openMenu ? ' justify-between ' : ' justify-center ')}>
              <Image onClick={() => setOpenMenu(!openMenu)} src={Logo} width={40} height={40} alt='photo' className='cursor-pointer' />
              <FaPlus onClick={() => setOpenMenu(!openMenu)} size={20} className={openMenu ? ' rotate-45 cursor-pointer ' : 'hidden'} />
            </div>
            <div className={'flex flex-col gap-5' + (openMenu ? '' : ' items-center ')}>
              <div onClick={() => {
                postConversation()
                router.refresh()
                }} className='flex flex-row justify-between gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-[rgb(170,0,0)]' title={openMenu ? '' : 'New chat'}>
                <FaEdit className='w-auto' size={20} />
                <p className={'w-full text-left' + (openMenu ? '' : ' hidden ')}>New chat</p>
              </div>
              <div className='flex flex-row justify-between gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-[rgb(170,0,0)]' title={openMenu ? '' : 'Search'}>
                <FaSearch className='w-auto' size={20} />
                <p className={'w-full text-left' + (openMenu ? '' : ' hidden ')}>Search</p>
              </div>
              <div className='flex flex-row justify-between gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-[rgb(170,0,0)]' title={openMenu ? '' : 'Settings'}>
                <FaCog className='w-auto' size={20} />
                <p className={'w-full text-left' + (openMenu ? '' : ' hidden ')}>Settings</p>
              </div>
            </div>
            <div className={'flex flex-col justify-center max-h-[55%] gap-1 px-3 py-3 rounded-xl' + (openMenu ? ' items-start ' : ' items-center cursor-pointer hover:bg-[rgb(170,0,0)] ')} title={openMenu ? '' : 'Recents chats'}>
              {openMenu ? (
                <>
                  <div className='font-bold px-1 py-1'>
                    Recents chats
                  </div>
                  <div className='flex flex-col gap-1 overflow-scroll h-[100%] hidden_scroll w-full'>
                    {conversations.map((obj: {id: number, title: string}) => (
                      <div onClick={() => {
                        setConversationID(obj.id);
                        getMessages(obj.id);
                      }} key={obj.id} className='p-3 rounded-xl min-h-[45px] text-sm cursor-pointer hover:bg-[rgb(170,0,0)]'>
                        {obj.title !== ' ' ? obj.title : 'Whitout conversation'}
                      </div>
                    ))}
                    <div className='p-3 rounded-xl min-h-[45px] text-sm cursor-pointer hover:bg-[rgb(170,0,0)]'>
                      Titulo de chat reciente
                    </div>
                    <div className='p-3 rounded-xl min-h-[45px] text-sm cursor-pointer hover:bg-[rgb(170,0,0)]'>
                      Titulo de chat reciente
                    </div>
                  </div>                
                </>                
              ) : <FaCommentDots size={20} />}
            </div>
          </div>          
          <div onClick={() => {
            setTitleModal('Log out?');
            setTextModal('Are you sure you want to log out?');
            setTextButtonModal('Log out')
            refModalPrecuation.current.style.display = 'flex';
            refModalPrecuation.current.showModal();
          }} className={'flex w-full items-center p-2 mb-2 gap-3 hover:bg-[rgb(170,0,0)] rounded-xl cursor-pointer' + (openMenu ? ' justify-left ' : ' justify-center ')}>
            <FaUser size={20} />
            <h3 className={'' + (openMenu ? '' : ' hidden ')} >Log out</h3>
          </div>
        </div>
        {/*----------------------CHAT-----------------------------*/}
        <div className='flex flex-col items-center w-dvw bg-linear-to-b from-black to-[rgb(60,0,0)]'>
          <div className='flex justify-end p-2 w-full bg-[rgba(0,0,0,1)] md:justify-end'>
            <h1 className='font-semibold text-xl px-6 py-2 text-white bg-[rgb(60,0,0)] rounded-[50px] tracking-widest'>NOVA-IA</h1>
          </div>
          <div className='flex flex-col gap-5 max-h-[100%] justify-center h-full w-full px-4 pt-5 pb-40 lg:w-[900px]'>
            <div className='w-full'>
              <p className='p-3 bg-gray-500 whitespace-normal break-all max-w-[45%] w-fit rounded-lg'>Hello user, i'm a chatbot with IA API</p>
            </div>
            {message_list.map(obj => (
              <>
                <div className='flex justify-end w-full'>
                  <p className='p-3 bg-gray-500 whitespace-pre-wrap break-all max-w-[45%] w-fit rounded-lg'>{obj.user}</p>
                </div>
                <div className='w-full'>
                  <p className='p-3 bg-gray-500 whitespace-pre-wrap break-all max-w-[45%] w-fit rounded-lg'>{obj.AI}</p>
                </div>
              </>                  
            ))}
            {messages.map((obj: {id: number, role: string, content: string}) => (
              obj.role === 'user' ? (
                <>
                  <div key={obj.id} className='flex justify-end w-full'>
                    <p className='p-3 bg-gray-500 whitespace-pre-wrap break-all max-w-[45%] w-fit rounded-lg'>{obj.content}</p>
                  </div>
                </>                
              ) : (
                <>
                  <div key={obj.id} className='w-full'>
                    <p className='p-3 bg-gray-500 whitespace-pre-wrap break-all max-w-[45%] w-fit rounded-lg'>{obj.content}</p>
                  </div>
                </>                
              )
            ))}              
            <div className='flex flex-cols items-center justify-between px-2 py-2 w-full fixed left-5 sm:left-10 md:left-15 lg:left-84 bottom-10 max-w-[90%] lg:max-w-[60%] bg-[rgb(80,80,80)] border border-red-400 rounded-3xl text-white'>
              <div className='flex justify-center items-center w-[5%] py-3 px-1 rounded-4xl bg-[rgb(60,0,0)]'>
                <FaSearch className='' />
              </div>
              <textarea onChange={(e) => setInputUser(e.target.value)} 
              className={'outline-none w-[90%] px-2 resize-none scrollbar-none' + (inputUser.length > 0 ? ' min-h-[150px] ' : '')} 
              placeholder='Write your message...'/>
              <div className='flex justify-center items-end w-[5%] py-3 px-1 rounded-4xl bg-[rgb(60,0,0)] active:scale-90 cursor-pointer'>
                {inputUser.length > 0 ? <FaLongArrowAltRight /> : <FaMicrophone />}
              </div>
            </div>
          </div>  
        </div>
      </div>
    </>
  )
}
