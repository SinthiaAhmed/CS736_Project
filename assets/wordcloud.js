async function generateWordCloud(mostCommonSkills) {
  console.log("mostCommonSkills", mostCommonSkills);

  const canvas = document.getElementById("wordCloud");
  const ctx = canvas.getContext("2d");

  const maxCount = Math.max(...mostCommonSkills.map((d) => d.count));

  const fontSizeFactor = 30; // Adjust to change font size
  const fontFamily = "Arial"; // Change font family if needed

  canvas.width = 400;
  canvas.height = 500;
  // Find the word with the highest count (optional, for centering)
  const highestCountWord = mostCommonSkills.reduce((maxWord, currentWord) =>
    currentWord.count > maxWord.count ? currentWord : maxWord
  );

  let totalWidth = 0;
  let totalHeight = 0;

  mostCommonSkills.forEach((item) => {
    const words = item.skill.split(", ");

    words.forEach((word) => {
      const fontSize = Math.ceil((item.count / maxCount) * fontSizeFactor);
      const fontSizeClamped = Math.max(fontSize, 10); // Ensure minimum font size of 10
      ctx.font = `${fontSizeClamped}px ${fontFamily}`;
      const textWidth = ctx.measureText(word).width;
      const textHeight = fontSizeClamped + 5; // Adjust spacing

      totalWidth = Math.max(totalWidth, textWidth); // Track the widest word
      totalHeight += textHeight; // Accumulate total height
    });
  });

  // Calculate starting position for centered placement
  let startX = (canvas.width - totalWidth) / 2;
  let startY = (canvas.height - totalHeight) / 2;

  let currentY = startY;

  mostCommonSkills.forEach((item) => {
    const words = item.skill.split(", ");

    words.forEach((word) => {
      const fontSize = Math.ceil((item.count / maxCount) * fontSizeFactor);
      const fontSizeClamped = Math.max(fontSize, 12); // Ensure minimum font size of 10
      ctx.font = `${fontSizeClamped}px ${fontFamily}`;
      const textWidth = ctx.measureText(word).width;
      const textHeight = fontSizeClamped + 5; // Adjust spacing

      ctx.fillStyle = "black"; //`hsl(${Math.random() * 360}, 100%, 50%)`; // Random color

      // Draw the word at the calculated position
      ctx.fillText(word, startX, currentY);

      // Update position for next word
      startX += textWidth + 10; // Adjust horizontal spacing

      // Move to the next line if reaching the end of the canvas
      if (startX + textWidth > canvas.width) {
        startX = (canvas.width - textWidth) / 2; // Reset horizontal position for next line
        currentY += textHeight + 5; // Move down for next line
      }
    });
  });
}
