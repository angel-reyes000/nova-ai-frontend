"use client"

import Logo from '../public/images/LogoNovaAI.png';
import Image from 'next/image';
import '../app/styles/all.css';
import { FaCircle, FaSignOutAlt, FaPlus, FaCommentDots, FaSearch, FaCog, FaEdit, FaMicrophone, FaUser, FaLongArrowAltRight, FaExclamationCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import './styles/all.css';
import { useRouter } from 'next/navigation';

interface faceUser {
  id: number
  name: string
  last_name: string
  email: string
  password: string
}

interface faceConversations {
  id: number
  title: string
  user_id: number
}

interface faceMessages {
  id: number
  role: string
  content: string
  conversation_id: number
}

export default function chatNovaAI() {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [inputUser, setInputUser] = useState<string>('');
  const [messages, setMessages] = useState<any>([]);
  const [conversations, setConversations] = useState<any>();
  const [conversationID, setConversationID] = useState<number>(0);
  const [conversationTitle, setConversationTitle] = useState<string>('');
  const [errorGemini, setErrorGemini] = useState<string>('');
  const [search, setSearch] = useState(false);
  const [inputSearch, setInputSearch] = useState('');
  const [userName, setUserName] = useState('');
  const [listening, setListening] = useState(false);

  const [titleModal, setTitleModal] = useState<string>('');
  const [textModal, setTextModal] = useState<string>('');
  const [textButtonModal, setTextButtonModal] = useState<string>('');
  const [waitingResponse, setWaitingResponse] = useState<boolean>(false);

  const [token, setToken] = useState<boolean>(true);

  const refModalPrecuation = useRef<any>(null);
  const refSearch = useRef<HTMLInputElement>(null);

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
    setTextModal('You need to log in to start chatting with NOVA-IA.')
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
        setConversations(data[0]);       
        setUserName(data[1]);
        
      } catch (error) {
        console.log("Error to get conversation");
      }
    }

    getConversations();

    console.log("GET CONVERSATIONS", token)

  }, [token])

  async function postConversation (nothing: boolean) {

    const token = localStorage.getItem('token');
      
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/conversations`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.status !== 200) {
        console.log("Error at create conversation");
      }

      const data = await response.json();

      setConversations([...conversations, {id: data.id, title: data.title ? 'Whitout conversation' : data.title}])
      setConversationID(data.id)
      setConversationTitle(data.title)
      console.log(conversationID)
      console.log(data.id)
      
      if (nothing){
        setMessages([])
      }

      router.refresh()

      return data

    } catch (error) {
      console.log("Error in postConversation")
    }
  }

  async function getMessages (conversation_id: number) {
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

      } catch (error: any) {
        console.log("Error in getMessages", error.message);
      }
    }

  async function postMessages (content: string, conversation_id: number, title: string) {
    try{
      const token = localStorage.getItem('token');

      setMessages([...messages, {id: 0, content: content, role: 'user'}])

      let conversation;
      let conv_id;
      let conv_title;
      if (conversation_id === 0) {
        conversation = await postConversation(false);
        conv_id = await conversation.id
        conv_title = await conversation.title
      }
      console.log("conv_id: ", conv_id);
      console.log("conv_title: ", conv_title);
      console.log("conversation_id", conversation_id)
      console.log("title: ", title)

      setWaitingResponse(true);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: content,
          conversation_id: conversation_id === 0 ? conv_id : conversation_id,
          title: title
        })
      })

      setWaitingResponse(false)

      if (response.status !== 200) {
        console.log("ERROR en fetch");
        console.log(response);
        const data = await response.json();
        console.log(data)
        setErrorGemini(data.error)
        return
      }

      const data = await response.json();
      
      setMessages([...messages, data[0], data[1]])
      console.log(data)

      const AI = data[1].content;
      console.log(AI)
      let iterationText = '';
      for (let i = 0; i < AI.length; i++){
        iterationText += AI[i];
        console.log(iterationText)
        setMessages((prev: any) => prev.map((obj: faceMessages) => obj.id == data[1].id ? {...obj, content: iterationText} : obj))
        await new Promise(r => setTimeout(r, 1))
      }

      // console.log("MESSAGES[[[[0000]]]]]}",messages.slice(-1))
      // console.log("MESSagess", messages)
      // console.log("DATADOS",data[2])

      router.refresh();
      
      setConversations([...conversations, {id: conv_id, title: data[2]}])

      router.refresh();

    } catch(error:any) {
      console.log("Error en postMessages: ", error);
    }
  }

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    const recognition = new SpeechRecognition();

    recognition.lang = 'es-MX';
    recognition.continuous = false;
    recognition.interimResults = false;

    // Empezó a escuchar
    recognition.onstart = () => {
      setListening(true);
    };

    // Resultado obtenido
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputUser(transcript);
    };

    // El usuario dejó de hablar
    recognition.onspeechend = () => {
      console.log('Dejó de hablar');
      recognition.stop();
    };

    // Terminó completamente
    recognition.onend = () => {
      setListening(false);
      console.log('Reconocimiento finalizado');
    };

    recognition.start();
  };


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
        {token ? <FaSignOutAlt size={100} className='text-white' /> : <FaExclamationTriangle size={100} className='text-yellow-500' />}
        <p className='text-lg font-semibold text-white'>{textModal}</p>
        <button onClick={() => {
          localStorage.removeItem('token');
          router.push('/login');
        }} className='py-3 w-full text-white cursor-pointer hover:outline-1 hover:bg-gray-900 active:scale-90'>{textButtonModal}</button>
      </dialog>
      {/*----------------------FAKE MENU-----------------------------*/}
      <div className='flex flex-row bg-linear-to-b from-black to-[rgb(60,0,0)]'>
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
                postConversation(true)
                router.refresh()
                }} className='flex flex-row justify-between gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-[rgb(170,0,0)]' title={openMenu ? '' : 'New chat'}>
                <FaEdit className='w-auto' size={20} />
                <p className={'w-full text-left' + (openMenu ? '' : ' hidden ')}>New chat</p>
              </div>
              <div onClick={(e) => {
                setOpenMenu(true);
                setSearch(!search);
                refSearch.current?.focus();
                }} className={'flex flex-row justify-between gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-[rgb(170,0,0)]' + (search ? ' bg-[rgb(170,0,0)] ' : '')} title={openMenu ? '' : 'Search'}>
                <FaSearch className='w-auto' size={20} />
                {search && openMenu ? (
                  <input onClick={(e) => e.stopPropagation()} 
                        value={inputSearch} 
                        onChange={(e) => {
                          console.log(conversations)
                          setInputSearch(e.target.value); 
                        }} 
                        ref={refSearch} maxLength={25} className='outline-none max-w-[80%]' placeholder='Search...'></input>
                ) : (
                  <p className={'w-full text-left' + (openMenu ? '' : ' hidden ')}>Search</p>
                )}
              </div>
              <div onClick={() => router.push('/settings')} className='flex flex-row justify-between gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-[rgb(170,0,0)]' title={openMenu ? '' : 'Settings'}>
                <FaCog className='w-auto' size={20} />
                <p className={'w-full text-left' + (openMenu ? '' : ' hidden ')}>Settings</p>
              </div>
            </div>
            <div onClick={() => setOpenMenu(true)} className={'flex flex-col justify-center max-h-[55%] gap-1 px-3 py-3 rounded-xl' + (openMenu ? ' items-start ' : ' items-center cursor-pointer hover:bg-[rgb(170,0,0)] ')} title={openMenu ? '' : 'Recents chats'}>
              {openMenu ? (
                <>
                  <div className='font-bold px-1 py-1'>
                    Recents chats
                  </div>
                  <div className='flex flex-col gap-1 overflow-scroll h-[100%] hidden_scroll w-full'>
                    {conversations?.map((obj: faceConversations) => obj.title === '' ? {...obj, title: 'Whitout conversation'} : obj).filter((obj: faceConversations) => obj.title?.toLowerCase().includes(inputSearch.toLowerCase())).sort((a: any, b: any) => b.id - a.id).map((obj: {id: number, title: string}) => (
                      <div onClick={() => {
                        setConversationID(obj.id);
                        setConversationTitle(obj.title);
                        getMessages(obj.id);
                      }} key={obj.id} className={'p-3 rounded-xl min-h-[45px] text-sm cursor-pointer hover:bg-[rgb(170,0,0)] truncate' + (obj.id === conversationID ? ' bg-[rgb(170,0,0)] ' : '')}>
                        {obj.title !== '' ? obj.title : 'Whitout conversation'}
                      </div>
                    ))}
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
            {openMenu ? <FaUser size={20} /> : <FaSignOutAlt size={20} />}
            <h3 className={'' + (openMenu ? '' : ' hidden ')} >Log out</h3>
          </div>
        </div>
        {/*----------------------CHAT-----------------------------*/}
        <div className='flex flex-col h-auto min-h-[100dvh] items-center w-dvw'>
          <div className='flex justify-end p-2 w-full bg-[rgba(0,0,0,1)] md:justify-end'>
            <h1 className='font-semibold text-xl px-6 py-2 text-white bg-[rgb(60,0,0)] rounded-[50px] tracking-widest'>NOVA-IA</h1>
          </div>
          <div className='flex flex-col gap-5 max-h-[100%] justify-center h-full w-full px-4 pt-5 pb-40 lg:w-[900px]'>
            <div className='w-full'>
              <p className='p-3 bg-[rgb(100,100,100)] whitespace-normal break-all max-w-[45%] w-fit rounded-lg'>{`Hello ${userName}, i'm a chatbot with IA API`}</p>
            </div>
            {messages.map((obj: {id: number, role: string, content: string}) => (
              obj?.role === 'user' ? (
                <div key={obj?.id} className='flex justify-end w-full'>
                  <p className='p-3 bg-[rgb(100,100,100)] text-white whitespace-pre-wrap break-all max-w-[80%] w-fit rounded-lg'>{obj?.content}</p>
                </div>
              ) : (
                <div key={obj?.id} className='w-full'>
                  <p className='p-3 bg-[rgb(50,50,50)] text-white whitespace-pre-wrap max-w-[95%] w-fit rounded-lg'>{obj?.content}</p>
                </div>
              )
            ))}  
            {waitingResponse ? (
              <div className='w-full'>
                <p className='flex flex-cols items-end p-3 bg-[rgb(50,50,50)] text-white whitespace-pre-wrap max-w-[95%] w-fit rounded-lg'>
                  Thinking
                  <span className='text-2xl flex flex-cols'>
                    <span className='dot_one'> .</span>
                    <span className='dot_one'> .</span>
                    <span className='dot_one'> .</span>
                  </span>
                </p>
              </div>
            ) : ''}
            <div className='flex flex-rows flex-wrap items-center justify-between w-full fixed left-5 sm:left-10 md:left-15 lg:left-84 bottom-10 max-w-[90%] lg:max-w-[60%]'>
              {listening ? (
                <p className='flex flex-cols w-full text-[0.9rem] ml-4 text-blue-400 gap-1'>
                  Listening
                  <span className='flex flex-cols'>
                    <span className='dot_one'> .</span>
                    <span className='dot_one'> .</span>
                    <span className='dot_one'> .</span>
                  </span>
                </p>
              ) : ''}
              <p className='w-full text-[0.9rem] ml-4 text-red-500 '>{errorGemini}</p>
              <div className='flex flex-cols items-center justify-between bg-[rgb(80,80,80)] border border-red-400 rounded-3xl text-white w-full p-2'>
                <div className='flex justify-center items-center w-[15%] sm:w-[10%] md:w-[7%] lg:w-[5%] py-3 px-1 rounded-4xl bg-[rgb(60,0,0)]'>
                  <FaSearch className='' />
                </div>
                <textarea value={inputUser} onChange={(e) => setInputUser(e.target.value)} 
                className={'outline-none w-[90%] px-2 resize-none scrollbar-none' + (inputUser.length > 0 ? ' min-h-[150px] ' : '')} 
                placeholder='Write your message...'/>
                <div onClick={() => {
                  setInputUser('');
                  inputUser.length > 0 ? postMessages(inputUser, conversationID!, conversationTitle) : startListening()
                }} className={`flex justify-center items-end w-[15%] sm:w-[10%] md:w-[7%] lg:w-[5%] py-3 px-1 rounded-4xl 
                    bg-[rgb(60,0,0)] active:scale-90 cursor-pointer` + (waitingResponse ? ' pointer-events-none opacity-50 ' : '') + (listening ? ' opacity-50 pointer-events-none active_voice ' : '')}>
                  {inputUser.length > 0 ? <FaLongArrowAltRight /> : <FaMicrophone />}
                </div>
              </div>              
            </div>
          </div>  
        </div>
      </div>
    </>
  )
}
