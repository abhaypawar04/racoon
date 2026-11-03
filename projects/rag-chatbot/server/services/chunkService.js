const chunkText = (text, chunkSize = 500, overlap = 100) => {
  const chunks = [];

  if (!text || !text.trim()) {
    return chunks;
  }

  let start = 0;
  let chunkIndex = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);

    const content = text.slice(start, end).trim();

    if (content) {
      chunks.push({
        chunkIndex,
        content,
      });

      chunkIndex++;
    }

    if (end === text.length) {
      break;
    }

    start += chunkSize - overlap;
  }

  return chunks;
};

module.exports = chunkText;
