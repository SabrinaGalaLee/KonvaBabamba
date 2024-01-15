import React, { useState, useRef } from 'react';
import { Stage, Layer, Line } from 'react-konva';

const Whiteboard = () => {
  const [lines, setLines] = useState([]);
  const [removedLines, setRemovedLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineColor, setLineColor] = useState('black');
  const [lineWidth, setLineWidth] = useState(15);
  const [eraserMode, setEraserMode] = useState(false);

  const layerRef = useRef();

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { id: lines.length + 1, points: [pos.x, pos.y], color: lineColor, width: lineWidth }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const stage = e.target.getStage();
    const pointerPos = stage.getPointerPosition();
    const lastLine = lines[lines.length - 1];

    setLines([
      ...lines.slice(0, lines.length - 1),
      {
        ...lastLine,
        points: [...lastLine.points, pointerPos.x, pointerPos.y],
      },
    ]);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleColorChange = (e) => {
    setEraserMode(false); // Disable eraser mode when changing color
    setLineColor(e.target.value);
  };

  const handleWidthChange = (e) => {
    setEraserMode(false); // Disable eraser mode when changing line width
    setLineWidth(parseInt(e.target.value, 10));
  };

  const handleClear = () => {
    setLines([]);
    setRemovedLines([]);
    setEraserMode(false); // Disable eraser mode when clearing
  };

  const handleEraser = () => {
    setEraserMode(true);
    setLineColor('#ffffff'); // Set color to white for eraser effect
    setLineWidth(10); // Adjust width for eraser
  };

  const handleUndo = () => {
    if (eraserMode && removedLines.length > 0) {
      setLines([...lines, ...removedLines.pop()]);
    } else {
      setLines(lines.slice(0, lines.length - 1));
      if (eraserMode) {
        setEraserMode(false); // Disable eraser mode when undoing
      }
    }
  };

  const handleLineClick = (lineId) => {
    if (eraserMode) {
      const removedLine = lines.find((line) => line.id === lineId);
      setRemovedLines([...removedLines, [removedLine]]);
      setLines(lines.filter((line) => line.id !== lineId));
    }
  };

  const handleEraserToggle = () => {
    setEraserMode(!eraserMode);
  };

  return (
    <div>
      <div>
        <label>Color:</label>
        <input type="color" value={lineColor} onChange={handleColorChange} />
        <label>Line Width:</label>
        <input
          type="number"
          value={lineWidth}
          onChange={handleWidthChange}
          min="1"
          max="10"
        />
        <button onClick={handleClear}>Clear</button>
        <button onClick={handleEraser}>Eraser</button>
        <button onClick={handleUndo}>Undo</button>
        <button onClick={handleEraserToggle}>
          {eraserMode ? 'Disable Eraser' : 'Enable Eraser'}
        </button>
      </div>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight - 40} // Adjusted height to accommodate controls
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
      >
        <Layer ref={layerRef}>
        {console.log(lines)}
          {lines.map((line) => (
            <Line
              key={line.id}
              points={line.points}
              stroke={line.color}
              strokeWidth={line.width}
              onClick={() => handleLineClick(line.id)}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default Whiteboard;
