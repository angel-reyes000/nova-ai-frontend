'use client';

import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';

export default function GoogleLoginButton() {
  const router = useRouter();

  const handleSuccess = async (credentialResponse: any) => {
    const googleToken = credentialResponse.credential;

    console.log('Credential:', googleToken);
    console.log("ENV: ", process.env.NEXT_PUBLIC_BACKEND)

    try {
      console.log("ENTRE FETCH")
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/api/auth/google`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: credentialResponse.credential,
          }),
        }
      );
      console.log("SALE FETCH")

      console.log('STATUS:', res.status);



      const responseText = await res.text();
      console.log('TEXT:', responseText);
      
      const data = await res.json();
      console.log("PASA DATA: ", data)

      if (res.ok) {
        localStorage.setItem('token', data.token);
        router.push('/');
      } else {
        console.log("BAD DATA:", data);
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  return <GoogleLogin onSuccess={handleSuccess} onError={() => console.log('Login Failed')} />;
}
