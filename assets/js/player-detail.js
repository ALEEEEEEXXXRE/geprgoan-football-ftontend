import { getPlayerById } from './api.js';

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    document.querySelector(".container").innerHTML = "<p>მოთამაშის ID არ მოიძებნა URL-ში.</p>";
    return;
  }

  const player = await getPlayerById(id);

  if (!player || player.error) {
    document.querySelector(".container").innerHTML = "<p style='color:red;'>მოთამაშის მონაცემების მიღება ვერ მოხერხდა.</p>";
    return;
  }

  // ✅ Select containers
  const imgEl = document.querySelector(".model");
  const nameEl = document.querySelector(".marvel");
  const details = document.querySelector(".details");

  // ✅ Make sure elements exist
  if (!imgEl || !nameEl || !details) {
    alert("DOM ელემენტები ვერ მოიძებნა — HTML-შია პრობლემა");
    return;
  }

  // ✅ Set image
  imgEl.src = player.images?.[0] || "/georgian-football/assets/images/players/placeholder.jpg";
  imgEl.alt = `${player.firstName} ${player.lastName}`;
  imgEl.onerror = () => {
    imgEl.src = "/georgian-football/assets/images/players/placeholder.jpg";
  };

  // ✅ Set name
  nameEl.textContent = `${player.firstName} ${player.lastName}`;

  // ✅ Set all other fields
  details.innerHTML = `
    <h3 class="marvel">${player.firstName} ${player.lastName}</h3>
    <p>პოზიცია: ${player.position || "-"}</p>
    <p>კლუბი: ${player.club || "-"}</p>
    <p>დაბადების თარიღი: ${player.birthDate?.split("T")[0] || "-"}</p>
    <p>სიმაღლე: ${player.height ? player.height + " სმ" : "-"}</p>
    <p>წონა: ${player.weight ? player.weight + " კგ" : "-"}</p>
    <p>გოლები ნაკრებში: ${player.goalsNational ?? "-"}</p>
    <p>გოლები კლუბში: ${player.goalsClub ?? "-"}</p>
  `;
});
