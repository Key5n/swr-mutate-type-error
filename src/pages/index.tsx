"use client";

import { Suspense } from "react";
import useSWR from "swr";

async function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function fetcher(url: string) {
  console.log(url);
  const response = await fetch(url);
  await delay(1000);

  return response.json();
}

const dummy = { id: 1, title: "ダミー" };

function Component() {
  const { data: swrIssues } = useSWR(
    "https://api.github.com/repos/vercel/swr/issues?per_page=3",
    fetcher,
    { suspense: true, fallbackData: [dummy] },
  );
  const { data: nextjsIssues } = useSWR(
    "https://api.github.com/repos/vercel/next.js/issues?per_page=3",
    fetcher,
    { suspense: true, fallbackData: [dummy] },
  );
  const { data: swrIssueTopUser } = useSWR(
    () => swrIssues[0].user.url,
    fetcher,
    {
      suspense: true,
      fallbackData: [dummy],
    },
  );
  const { data: nextjsIssueTopUser } = useSWR(
    () => nextjsIssues[0].user.url,
    fetcher,
    {
      suspense: true,
      fallbackData: [dummy],
    },
  );

  return (
    <div>
      <ul>
        {swrIssues.map((v: any) => {
          return (
            <li key={v.id} style={{ color: "red" }}>
              {v.title}
            </li>
          );
        })}
      </ul>
      <ul>
        {nextjsIssues.map((v: any) => {
          return (
            <li key={v.id} style={{ color: "blue" }}>
              {v.title}
            </li>
          );
        })}
      </ul>
      <div style={{ color: "red" }}>
        Top user name in swr: {swrIssueTopUser.name}
      </div>
      <div style={{ color: "blue" }}>
        Top user name in Next.js: {nextjsIssueTopUser.name}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>"loading..."</div>}>
      <Component />
    </Suspense>
  );
}
