'use client';

import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';

export default function GoogleLoginButton() {
    const router = useRouter();

  const handleSuccess = async (credentialResponse: any) => {
    const token = credentialResponse.credential;
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/auth/google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
            });

        const data = await res.json();

        localStorage.setItem('token', data.token);

        router.push('/')

        console.log(data);

    } catch (error: any) {
        console.log("error en GoogleLoginBotton")
    }
  }

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log('Login Failed')}
    />
    );
}