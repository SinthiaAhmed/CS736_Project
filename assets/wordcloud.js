async function generateWordCloud(mostCommonSkills) {
    console.log("mostCommonSkills", mostCommonSkills);

    const canvas = document.getElementById('wordCloud');
    const ctx = canvas.getContext('2d');

    const maxCount = Math.max(...mostCommonSkills.map(d => d.count));

    const fontSizeFactor = 40; // Adjust to change font size
    const fontFamily = 'Arial'; // Change font family if needed

    canvas.width = 400;
    canvas.height = 1400;

    let currentX = 0;
    let currentY = 0;

    mostCommonSkills.forEach(item => {
        const words = item.skill.split(', ');

        words.forEach(word => {
            const fontSize = Math.ceil((item.count / maxCount) * fontSizeFactor);
            ctx.font = `${fontSize}px ${fontFamily}`;
            const textWidth = ctx.measureText(word).width;

            if (currentX + textWidth > canvas.width) {
                currentX = 0;
                currentY += fontSize + 15; // Adjust vertical spacing
            }

            ctx.fillText(word, currentX, currentY);
            currentX += textWidth + 20; // Adjust horizontal spacing
        });
    })
}