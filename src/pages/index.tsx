"use client";

import { Suspense } from "react";
import useSWR from "swr";

async function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function fetcher(url: string) {
  const response = await fetch(url);
  await delay(1000);

  return response.json();
}

const dummy = { id: 1, title: "ダミー" };

function Component() {
  const { data } = useSWR(
    "https://api.github.com/repos/vercel/swr/issues",
    fetcher,
    { suspense: true, fallbackData: [dummy] }
  );

  return (
    <ul>
      {data.map((v: any) => {
        return <li key={v.id}>{v.title}</li>;
      })}
    </ul>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>"loading..."</div>}>
      <Component />
    </Suspense>
  );
}
