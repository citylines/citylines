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
  const width = copyCtx.measureText(watermark).width;
  copyCtx.fillText(watermark, copy.width - width - 90, copy.height - 70);

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

export default downloadImgFromMapCanvas
