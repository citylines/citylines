const downloadImgFromMapCanvas = (urlName, mapCanvas, format = "image/png", quality = 0.9) => {
  // Create a copy
  const copy = document.createElement('canvas');
  copy.width = mapCanvas.width;
  copy.height = mapCanvas.height;
  const copyCtx = copy.getContext('2d');
  copyCtx.drawImage(mapCanvas, 0, 0);

  // Add watermark to the copy
  const watermark = `citylines.co/${urlName}`;
  copyCtx.font = "35px Arial";
  const coords = getWatermarkCoords(copyCtx, watermark);
  copyCtx.fillStyle = getContrastingColor(copyCtx, coords[0], coords[1]);
  copyCtx.fillText(watermark, coords[0], coords[1]);

  copy.toBlob(blob => {
    const anchor = document.createElement('a');
    anchor.download = `${urlName}.png`;
    anchor.href = URL.createObjectURL(blob);
    anchor.click();
    URL.revokeObjectURL(anchor.href);
  },
  format,
  quality,
  );
}

const getWatermarkCoords = (context, watermark) => {
  const width = context.measureText(watermark).width;
  const x = context.canvas.width - width - 90;
  const y = context.canvas.height - 70;
  return [x, y];
}

const getContrastingColor = (context, x, y) => {
  const rgb = context.getImageData(x, y, 1, 1).data;
  const luma = (0.2126 * rgb[0]) + (0.7152 * rgb[1]) + (0.0722 * rgb[2]);
  return luma >= 165 ? "#000" : "#fff";
}

export default downloadImgFromMapCanvas
