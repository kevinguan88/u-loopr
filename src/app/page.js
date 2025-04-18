"use client";
import React, { useState, useRef, useEffect } from 'react';
import Image from "next/image";
import YouTube from 'react-youtube';
import { timeToSeconds } from './utils/timeToSeconds.js';
import { secondsToTimeStamp } from './utils/secondsToTimeStamp.js';
import ReactSlider from 'react-slider'
import styled from 'styled-components';
import supabase from '../config/supabaseClient.js';
import Link from 'next/link';

const StyledSlider = styled(ReactSlider)`
  width: 618px;
  height: 7px;
`;
const StyledThumb = styled.div`
  margin-top: -4px;
  height: 17px;
  line-height: 50px;
  width: 17px;
  text-align: center;
  background-color: #f00;
  color: #fff;
  border-radius: 50%;
  cursor: grab;
`;
const StyledTrack = styled.div`
  top: 0;
  bottom: 0;
  background: ${props => (props.index === 2 ? '#ddd' : props.index === 1 ? '#f00' : '#ddd')};
  border-radius: 999px;
`;

export default function Home() {
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [vidId, setVidId] = useState('DSBBEDAGOTc');
  const [videoDuration, setVideoDuration] = useState(0);
  const linkInput = useRef(null);
  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const startInput = useRef(null);
  const endInput = useRef(null);

  //playlist stuff, will seperate this to backend later
  const [fetchError, setFetchError] = useState(null);
  const [playlist, setPlaylist] = useState(null);

  const insertNewVid = async () => {
    console.log('inserting video: ' + vidId);
    const { data, error } = await supabase
      .from('playlist')
      .insert([{ video_id: vidId }]);
    if (error) {
      setFetchError(error);
      setPlaylist(null);
      console.log("Error inserting new video", error);
    } 
    if (data) {
      setPlaylist(data);
      setFetchError(null);
      console.log("Successfully inserted new video", data);
    }
  };

  //fetches playlist
  useEffect(() => {
    const fetchPlaylist = async () => {
      const { data, error } = await supabase
        .from('playlist')
        .select('*');
      if (error) {
        setFetchError(error);
        setPlaylist(null);
        console.log("Error fetching playlist", error);
      } 
      if (data) {
        setPlaylist(data);
        setFetchError(null);
        console.log("Successfully fetched playlist", data);
      }
    };

    fetchPlaylist();
  }, []);

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

  const getVideoId = (url) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const id = url.match(regex);
    console.log(id);
    setVidId(id[1]);
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

const Thumb = (props, state) => <StyledThumb {...props}></StyledThumb>;

const Track = (props, state) => <StyledTrack {...props} index={state.index} />;

const handleSliderChange = (value) => {
  handleStartSliderChange(value[0]);
  handleEndSliderChange(value[1]);
};

const handleStartSliderChange = (value) => {
  const time = secondsToTimeStamp(value);
  console.log('start timestamp is: ' + time);
  startInput.current.value = time
  setStartTime(value);
};

const handleEndSliderChange = (value) => {
  const time = secondsToTimeStamp(value);
  console.log('end timestamp is: ' + time);
  endInput.current.value = time
  setEndTime(value);
};


  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen pb-20 gap-10 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className='flex flex-row-reverse w-full items-center gap-4'>
          <nav className="flex items-center gap-4">
            <button className="text-sm text-center text-white px-2 py-1 rounded bg-neutral-950 transition-colors hover:bg-neutral-800">
              <Link href="/signup">Sign Up</Link>
            </button>
            <button className="text-sm text-center text-white px-2 py-1 rounded bg-neutral-950 transition-colors hover:bg-neutral-800">
              <Link href="/login">Log In</Link>
            </button>
          </nav>
        </div>
        <div className="text-xl font-[family-name:var(--font-geist-mono)]">
          <h1 text-xl>U-Loopr</h1>
        </div>
        <div>
          {fetchError && <p>{fetchError}</p>}
          {playlist && (
            <div>
              {playlist.map((video) => (
                <p>{video.video_id}</p>
              ))}
            </div>
          )}
        </div>
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by pasting the link of the YouTube video you want to
            loop.
          </li>
          <li>Specify the section you want to loop.</li>
        </ol>
        <div className='flex w-96' style={{width: '28rem'}}>
          <input className='text-black px-2 w-96 rounded' ref={linkInput} style={{width: '28rem'}} placeholder='Paste YouTube link here'></input>
          <button className="relative inline-flex h-8 w-12 items-center justify-center rounded-md bg-neutral-950 transition-colors hover:bg-neutral-800 ms-2" onClick={() => {getVideoId(linkInput.current.value)}}><div><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-200"><path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg></div></button>
          <button onClick={() => {insertNewVid()}}>Insert New Video</button>
        </div>
        <YouTube
          videoId={vidId}
          onReady={(e) => {
            playerRef.current = e.target;
            setVideoDuration(playerRef.current.getDuration());
            resetLoop();
          }}
          onStateChange={handlePlayerStateChange}
        />
        <div className='w-full flex justify-center'>
          <StyledSlider 
            value={[startTime, endTime]}
            max={videoDuration} 
            renderTrack={Track} 
            renderThumb={Thumb} 
            onChange={handleSliderChange}
            step={1} 
          />
        </div>
        <div className='w-full flex justify-between'>
          <input onBlur={handleStartTimeChange} className='text-black text-center w-24 rounded' ref={startInput}/>
          <input onBlur={handleEndTimeChange} className='text-black text-center w-24 rounded' ref={endInput} />
        </div>
      </main>
    </div>
  );
}
