'use client';

import { useEffect } from 'react';
import './love-island.css';

export default function LoveIslandPage() {
  useEffect(() => {
    let cleanup;
    let cancelled = false;
    // three.js touches window/document — load the game only in the browser
    import('@/lib/love-island').then((m) => {
      if (!cancelled) cleanup = m.startGame();
      else if (cleanup) cleanup();
    });
    return () => {
      cancelled = true;
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <div className="game-root">
      <canvas id="c" />
      <div id="vignette" />
      <div id="hud">
        <div id="hearts" className="pill"><span className="msr">favorite</span><span id="heartCount">0</span></div>
        <div id="timer" className="pill"><span className="msr">timer</span><span id="timeLeft">60</span></div>
        <div id="fuelWrap"><canvas id="fuelCanvas" width="184" height="184" style={{ width: 92, height: 92 }} /></div>
        <div id="fuelLamp" />
        <div id="fuelBanner" className="pill"><span className="msr">local_gas_station</span>Low fuel — find the gas station!</div>
        <div id="refuelBar"><div id="refuelFill" /></div>
        <div id="hint" className="pill"><b>W/S</b>: Throttle &amp; Brake&nbsp;&nbsp;<b>A/D</b>: Steer</div>
        <div id="card"><img id="cardImg" alt="" /><div id="cardName" /><div id="cardPts" /></div>
      </div>
      <div id="joy"><div id="joyKnob" /></div>
      <button id="tiltBtn" className="pill"><span className="msr">screen_rotation</span><span id="tiltState">Tilt: OFF</span></button>

      <div className="overlay" id="title">
        <div className="panel">
          <h1><span className="msr">favorite</span> Love Island</h1>
          <p>How many girls can you charm in 60 seconds?<br />Drive with <b>W / A / S / D</b> — and watch your fuel!</p>
          <button className="bigbtn" id="startBtn">START</button>
        </div>
      </div>
      <div className="overlay" id="results">
        <div className="panel">
          <h1>Time&apos;s Up!</h1>
          <div id="resHearts" />
          <div id="resRank" />
          <div id="resGrid" />
          <button className="bigbtn" id="againBtn">PLAY AGAIN</button>
        </div>
      </div>
    </div>
  );
}
