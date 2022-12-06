import Head from 'next/head';
import Image from 'next/image';
import { useContextualRouting } from '../views/routes.views';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useClient } from '../components';

export default function Terms() {

  const router = useRouter();
  const client = useClient();
  const { constructLink } = useContextualRouting();
  const [count, setCount] = useState(0);

  return (
    <div>
      <Head>
        <title>Terms</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Link href="/"><a>Home</a></Link>
      <br />
      <Link {...constructLink({ pathname: '/account/signin' })}><a>Sign In</a></Link>
      <br />
      <Link {...constructLink({ pathname: '/account/signup' })}><a>Sign Up</a></Link>
      <br />
      <Link {...constructLink('/account/password/change')}><a>Change Password</a></Link>
      <br />
      <br />
      <Link {...constructLink('/account/password/reset')}><a>Reset Password</a></Link>
      <br />
      <br />
    </div>
  )
}