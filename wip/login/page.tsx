'use client';

import { signIn } from 'next-auth/react';
import React, { useEffect } from 'react';

export default function LoginPage(): React.JSX.Element {

  useEffect(() => {
    document.title = "PRAJÑĀ 2026: Signin with Google"
    signIn('google')
  }, [])

  return (
    <div></div>
  )
}