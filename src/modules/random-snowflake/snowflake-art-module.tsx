import React, { useRef, useEffect } from 'react';

function Snowflake() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Generate a random snowflake design
    function createSnowflake() {
      ctx.beginPath();
      ctx.arc(75, 75, 50, 0, Math.PI * 2, true);
      ctx.moveTo(110, 75);
      ctx.arc(75, 75, 35, 0, Math.PI, false);
      ctx.moveTo(65, 65);
      ctx.arc(60, 65, 5, 0, Math.PI * 2, true);
      ctx.moveTo(95, 65);
      ctx.arc(90, 65, 5, 0, Math.PI * 2, true);
      ctx.stroke();
    }

    createSnowflake();
  }, []);

  return <canvas ref={canvasRef} width={150} height={150} />;
}

export default Snowflake;
