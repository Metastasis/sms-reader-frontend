import {useEffect} from 'react';
import useSWR from 'swr'
import Head from "next/head"
import Image from "next/image"
import {useAuth} from '../features/auth';
import styles from "./PhoneList.module.css";
import Link from 'next/link';

const PhoneList = () => {
  const auth = useAuth();
  if (!auth.session) return null;
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.sidebar}>
        <PhonesList />
      </div>

      <main className={styles.main}>
        <p className={styles.description}>
          <Link href="/">Главная</Link>
        </p>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default PhoneList

function PhonesList() {
  const {data} = useSWR('phone_list', () => searchDevice());
  return (
    <ul className={styles.list}>
      {data?.map(device => (
        <li key={device.phoneNumber}>{device.phoneNumber}</li>
      ))}
    </ul>
  )
}

interface SearchDevice {
  mobileNumber: string
  countryCode: string
}

type SearchDeviceResult = Array<SearchDevice & {phoneNumber: string}>;

function searchDevice(params: any = {page: 1}): Promise<SearchDeviceResult> {
  const opts: RequestInit = {
    body: JSON.stringify(params),
    method: 'post',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  return fetch(`${process.env.SMS_READER_API}/device/search`, opts)
    .then(r => r.json()).then((data) => data.map((d: any) => ({...d, phoneNumber: formatPhone(d)})));
}

function formatPhone(device: SearchDevice) {
  return `${device.countryCode}${device.mobileNumber}`;
}
