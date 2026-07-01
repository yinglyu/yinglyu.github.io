import React from 'react';
import styled from '@emotion/styled';

const GameWrapper = styled.div`
  min-height: 100vh;
  padding: 6rem 1.5rem 2rem;
  background-color: skyBlue;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
`;

const GameTitle = styled.h1`
  margin: 0 0 0.5rem;
  font-size: 2rem;
`;

const GameDescription = styled.p`
  margin: 0 0 1.5rem;
  font-size: 1rem;
  text-align: center;
  max-width: 36rem;
`;

const ScoreBadge = styled.div`
  position: fixed;
  top: 8rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.35);
  padding: 0.75rem 1rem;
  border-radius: 999px;
  font-weight: 700;
  z-index: 20;
`;

const Arena = styled.div`
  position: relative;
  width: min(92vw, 54rem);
  height: min(70vh, 42rem);
  border-radius: 1.25rem;
  border: 2px solid rgba(255, 255, 255, 0.35);
  background: linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.02));
  overflow: hidden;
  cursor: none;
`;

const Player = styled.img`
  position: absolute;
  bottom: 0;
  transform: translateX(-50%);
  width: 96px;
  height: 96px;
  pointer-events: none;
  z-index: 5;
`;

const Coin = styled.img`
  position: absolute;
  width: 48px;
  height: 48px;
  pointer-events: none;
  z-index: 4;
`;

const initialCoins = [];

export const Game = () => {
  const [score, setScore] = React.useState(0);
  const [playerX, setPlayerX] = React.useState(0);
  const [coins, setCoins] = React.useState(initialCoins);
  const arenaRef = React.useRef(null);
  const playerXRef = React.useRef(0);

  React.useEffect(() => {
    const arena = arenaRef.current;
    if (!arena) return undefined;

    const handleMove = (event) => {
      const rect = arena.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const nextValue = Math.min(Math.max(x, 48), rect.width - 48);
      playerXRef.current = nextValue;
      setPlayerX(nextValue);
    };

    const updateFromTouch = (event) => {
      const touch = event.touches[0];
      if (!touch) return;
      const rect = arena.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const nextValue = Math.min(Math.max(x, 48), rect.width - 48);
      playerXRef.current = nextValue;
      setPlayerX(nextValue);
    };

    const spawnCoin = () => {
      const rect = arena.getBoundingClientRect();
      const left = Math.random() * Math.max(rect.width - 48, 0);
      const newCoin = {
        id: Date.now() + Math.random(),
        left,
        top: -48,
      };
      setCoins((prev) => [...prev, newCoin]);
    };

    const spawnIntervalId = window.setInterval(spawnCoin, 1500);

    let animationFrameId = null;
    let lastFrameTime = 0;

    const animate = (timestamp) => {
      if (!lastFrameTime) {
        lastFrameTime = timestamp;
      }

      const deltaTime = Math.min(0.03, (timestamp - lastFrameTime) / 1000);
      lastFrameTime = timestamp;

      setCoins((prev) => prev.flatMap((coin) => {
        if (coin.top > 10000) return [coin];

        const nextTop = coin.top + 180 * deltaTime;
        const coinLeft = coin.left;
        const coinRight = coin.left + 48;
        const coinTop = nextTop;
        const coinBottom = nextTop + 48;

        const playerWidth = 96;
        const playerHeight = 96;
        const arenaHeight = arenaRef.current?.clientHeight ?? 0;
        const playerLeft = playerXRef.current - playerWidth / 2;
        const playerRight = playerLeft + playerWidth;
        const playerTop = Math.max(0, arenaHeight - playerHeight);
        const playerBottom = playerTop + playerHeight;

        const overlap = coinLeft < playerRight && coinRight > playerLeft && coinTop < playerBottom && coinBottom > playerTop;

        if (overlap) {
          setScore((value) => value + 1);
          return [];
        }

        return [{ ...coin, top: nextTop }];
      }));

      animationFrameId = window.requestAnimationFrame(animate);
    };

    animationFrameId = window.requestAnimationFrame(animate);
    arena.addEventListener('mousemove', handleMove);
    arena.addEventListener('touchmove', updateFromTouch, { passive: true });

    return () => {
      window.clearInterval(spawnIntervalId);
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
      arena.removeEventListener('mousemove', handleMove);
      arena.removeEventListener('touchmove', updateFromTouch);
    };
  }, []);

  return (
    <GameWrapper>
      <ScoreBadge>Score: {score}</ScoreBadge>
      <GameTitle>Catch Douzhi</GameTitle>
      <GameDescription>Move your mouse to catch the falling douzhi cats before they disappear.</GameDescription>
      <Arena ref={arenaRef}>
        <Player src="images/mark-color.png" alt="player" style={{ left: playerX }} />
        {coins.map((coin) => (
          <Coin
            key={coin.id}
            src="images/douzhi.ico"
            alt="douzhi"
            style={{ left: coin.left, top: coin.top }}
          />
        ))}
      </Arena>
    </GameWrapper>
  );
};
