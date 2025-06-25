document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("resemblanceForm");
  const resultBox = document.getElementById("resemblanceResult");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const height = parseInt(document.getElementById("height").value.trim(), 10);
    const weight = parseInt(document.getElementById("weight").value.trim(), 10);
    const age = parseInt(document.getElementById("age").value.trim(), 10);
    const gender = document.querySelector("input[name='gender']:checked")?.value;

    if (isNaN(height) || isNaN(weight) || isNaN(age) || !gender) {
      resultBox.innerHTML = `<p style="color:red;">გთხოვთ შეავსოთ ყველა ველი სწორად.</p>`;
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/players");
      const players = await res.json();

      if (!Array.isArray(players)) throw new Error("Invalid players data");

      let bestMatch = null;
      let bestScore = 0;

      players.forEach(player => {
        const similarity = calculateSimilarity({ height, weight, age }, player);
        if (similarity > bestScore) {
          bestScore = similarity;
          bestMatch = player;
        }
      });

      if (bestMatch) {
        resultBox.innerHTML = `
          <h3>თქვენ ყველაზე მეტად ჰგავხართ: ${bestMatch.firstName} ${bestMatch.lastName}</h3>
          <p>სიმაღლე: ${bestMatch.height} სმ | წონა: ${bestMatch.weight} კგ | ასაკი: ${getAge(bestMatch.birthDate)} წ.</p>
          <p>სიმსგავსე: ${bestScore.toFixed(1)}%</p>
          <img src="/assets/images/players/${bestMatch.image}" style="max-width:200px; margin-top:1rem; border-radius:10px;">
        `;
      } else {
        resultBox.innerHTML = "<p>შესატყვისი ფეხბურთელი ვერ მოიძებნა.</p>";
      }
    } catch (err) {
      console.error("⚠️ Similarity check failed:", err);
      resultBox.innerHTML = "<p style='color:red;'>შეცდომა მოხდა მონაცემების დამუშავებისას.</p>";
    }
  });

  function calculateSimilarity(input, player) {
    const playerAge = getAge(player.birthDate);

    const heightDiff = Math.abs(input.height - player.height);
    const weightDiff = Math.abs(input.weight - player.weight);
    const ageDiff    = Math.abs(input.age - playerAge);

    const maxHeightDiff = 40; // reasonable max deviation
    const maxWeightDiff = 30;
    const maxAgeDiff    = 20;

    const heightScore = 1 - Math.min(heightDiff / maxHeightDiff, 1);
    const weightScore = 1 - Math.min(weightDiff / maxWeightDiff, 1);
    const ageScore    = 1 - Math.min(ageDiff / maxAgeDiff, 1);

    return ((heightScore + weightScore + ageScore) / 3) * 100;
  }

  function getAge(birthDate) {
    const birth = new Date(birthDate);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    return age;
  }
});
