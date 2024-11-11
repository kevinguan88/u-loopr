"use client";
import React, { useState, useRef, useEffect } from 'react';
import Image from "next/image";
import YouTube from 'react-youtube';
import { timeToSeconds } from './utils/timeToSeconds.js';
import { secondsToTimeStamp } from './utils/secondsToTimeStamp.js';

export default function Home() {

  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const startInput = useRef(null);
  const endInput = useRef(null);

  const handleStartTimeChange = (e) => {
    const timeStamp = e.target.value;
    const time = timeStampToSeconds(timeStamp);
    console.log('start time is: ' + time);
    setStartTime(time);
  };

  const handleEndTimeChange = (e) => {
    const timeStamp = e.target.value;
    const time = timeStampToSeconds(timeStamp);
    console.log('end time is: ' + time);
    setEndTime(time);
  };

  //converts string of timestamp to seconds
  const timeStampToSeconds = (timeStamp) => {
    console.log(timeStamp);
    const timeStampArray = timeStamp.split(':');
    console.log('timestamp array: ' + timeStampArray);
    switch (timeStampArray.length) {
      case 1:
        return timeToSeconds(0, 0, timeStampArray[0]);
      case 2:
        return timeToSeconds(0, timeStampArray[0], timeStampArray[1]);
      case 3:
        return timeToSeconds(timeStampArray[0], timeStampArray[1], timeStampArray[2]);
    }
  };

  const resetLoop = () => {
    if (playerRef.current) {
      setStartTime(0);
      startInput.current.value = "00:00:00";
      setEndTime(playerRef.current.getDuration());
      endInput.current.value = secondsToTimeStamp(playerRef.current.getDuration());
    }
  };

  //handles the loop as the current time changes
  useEffect(() => {
    // if the player is ready
    if (playerRef.current) {
      const player = playerRef.current;
      console.log(currentTime);
      if ((startTime >= 0) && endTime) {
        console.log('start and end time are set');
        console.log('start time: ' + startTime + ' end time: ' + endTime);
        if (startTime >= endTime) {
          //TODO: eventually change this to setting time to previous time
          console.log("Start time should be less than end time.");
          alert("Start time should be less than end time.");
          resetLoop();
          return;
        }
        // seeks to start time when current time is outside of loop range
        if ((currentTime >= endTime) || (currentTime < startTime)) {
          console.log("seeking to " + startTime);
          player.seekTo(startTime);
        }
      }
    }
  }, [currentTime]);

  const handleLoop = () => {
    console.log("handle loop");
    setCurrentTime(Math.floor(playerRef.current.getCurrentTime()));

  };

  const handlePlayerStateChange = (e) => {
    const player = e.target;
    if (player.getPlayerState() === 1) {
      intervalRef.current = setInterval(handleLoop, 100);
    } else {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    clearInterval(intervalRef.current); // Clear interval on component unmount
  }, []);


  //TODO: set default end time to the duration of the video
  useEffect(() => { 
    if (playerRef.current) {
      endInput.current.value = timeToSeconds(0, 0, playerRef.current.getDuration());
    }
  }, [endInput])

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="text-xl font-[family-name:var(--font-geist-mono)]">
          <h1 text-xl>U-Loopr</h1>
        </div>
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by pasting the link of the YouTube video you want to
            loop.
          </li>
          <li>Specify the section you want to loop.</li>
        </ol>
        <YouTube
          videoId="DSBBEDAGOTc"
          onReady={(e) => {
            playerRef.current = e.target;
            resetLoop();
          }}
          onStateChange={handlePlayerStateChange}
        />
        <div className='w-full flex justify-between'>
          <input onBlur={handleStartTimeChange} className='text-black text-center w-24' ref={startInput}/>
          <input onBlur={handleEndTimeChange} className='text-black text-center w-24' ref={endInput} />
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="https://nextjs.org/icons/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
