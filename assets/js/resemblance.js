/* resemblance.js – find which Georgian player the user resembles */

document.addEventListener("DOMContentLoaded", () => {
  const form       = document.getElementById("resemblanceForm");
  const resultBox  = document.getElementById("resemblanceResult");

  /* ------------------------------------------------------------------
     Handle form submit
  ------------------------------------------------------------------ */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const height = +document.getElementById("height").value.trim();
    const weight = +document.getElementById("weight").value.trim();
    const age    = +document.getElementById("age").value.trim();
    const gender = document.querySelector("input[name='gender']:checked")?.value;

    if (!height || !weight || !age || !gender) {
      resultBox.innerHTML = `<p style="color:red;">გთხოვთ შეავსოთ ყველა ველი სწორად.</p>`;
      return;
    }

    try {
      /* Fetch every player (you already expose GET /api/players) */
      const res     = await fetch("http://localhost:3000/api/players");
      const players = await res.json();

      if (!Array.isArray(players)) throw new Error("Invalid players data");

      /* Find best similarity score */
      let bestMatch = null;
      let bestScore = 0;

      players.forEach(p => {
        const sim = similarity({ height, weight, age }, p);
        if (sim > bestScore) { bestScore = sim; bestMatch = p; }
      });

      if (bestMatch) {
        /* ① resolve image path safely */
        const imgPath =
          bestMatch.image ||                    // preferred single-field
          bestMatch.images?.[0] ||              // first image in array
          "/assets/images/players/placeholder.jpg"; // guaranteed fallback

        /* ② build the card-like result */
        resultBox.innerHTML = `
          <h3>თქვენ ყველაზე მეტად ჰგავხართ:<br>${bestMatch.firstName} ${bestMatch.lastName}</h3>
          <p>სიმაღლე: ${bestMatch.height} სმ | წონა: ${bestMatch.weight} კგ | ასაკი: ${calcAge(bestMatch.birthDate)} წ.</p>
          <p>მსგავსება: ${bestScore.toFixed(1)}%</p>
          <img src="${imgPath}"
               alt="${bestMatch.firstName}"
               style="max-width:200px; border-radius:10px; margin-top:1rem;"
               onerror="this.src='/assets/images/players/placeholder.jpg';">
        `;
      } else {
        resultBox.innerHTML = "<p>შესატყვისი ფეხბურთელი ვერ მოიძებნა.</p>";
      }
    } catch (err) {
      console.error("⚠️ Similarity check failed:", err);
      resultBox.innerHTML = `<p style="color:red;">შეცდომა მოხდა მონაცემების დამუშავებისას.</p>`;
    }
  });

  /* ------------------------------------------------------------------
     Helper functions
  ------------------------------------------------------------------ */
  function similarity(input, player) {
    const pAge = calcAge(player.birthDate);

    const hDiff = Math.abs(input.height - player.height);
    const wDiff = Math.abs(input.weight - player.weight);
    const aDiff = Math.abs(input.age    - pAge);

    const hScore = 1 - Math.min(hDiff / 40, 1); // 40 cm max deviation
    const wScore = 1 - Math.min(wDiff / 30, 1); // 30 kg max deviation
    const aScore = 1 - Math.min(aDiff / 20, 1); // 20 yrs max deviation

    return ((hScore + wScore + aScore) / 3) * 100;
  }

  function calcAge(birthDate) {
    const d = new Date(birthDate);
    const n = new Date();
    let age = n.getFullYear() - d.getFullYear();
    const m = n.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && n.getDate() < d.getDate())) age--;
    return age;
  }
});
