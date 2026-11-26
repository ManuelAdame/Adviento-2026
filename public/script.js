const calendar = document.querySelector("#calendar");
const dialog = document.querySelector("#surprise-dialog");
const selectedDay = document.querySelector("#selected-day");
const closeButton = dialog.querySelector(".dialog-close");
const confirmButton = dialog.querySelector(".dialog-button");
const progressTrack = document.querySelector("#progress-track");
const progressFill = document.querySelector("#progress-fill");
const progressCount = document.querySelector("#progress-count");

// Set this to the latest day you want to show as reached (0–24).
const currentDay = 0;
const calendarDays = [
  { day: 12, size: "tall" },
  { day: 3, size: "wide" },
  { day: 21, size: "" },
  { day: 7, size: "" },
  { day: 18, size: "feature" },
  { day: 1, size: "" },
  { day: 15, size: "tall" },
  { day: 23, size: "" },
  { day: 5, size: "wide" },
  { day: 10, size: "" },
  { day: 2, size: "" },
  { day: 19, size: "" },
  { day: 8, size: "" },
  { day: 14, size: "tall" },
  { day: 24, size: "" },
  { day: 6, size: "" },
  { day: 17, size: "wide" },
  { day: 11, size: "" },
  { day: 4, size: "" },
  { day: 20, size: "" },
  { day: 9, size: "tall" },
  { day: 16, size: "" },
  { day: 22, size: "" },
  { day: 13, size: "" },
];

const reachedDays = Math.min(24, Math.max(0, currentDay));
const progressPercent = (reachedDays / 24) * 100;
progressFill.style.width = `${progressPercent}%`;
progressTrack.style.setProperty("--progress", `${progressPercent}%`);
progressCount.textContent = `${reachedDays} de 24 días`;
progressTrack.setAttribute("aria-valuenow", String(reachedDays));

for (const { day, size } of calendarDays) {
  const button = document.createElement("button");
  button.className = `day${size ? ` day--${size}` : ""}`;
  button.type = "button";
  button.textContent = String(day).padStart(2, "0");
  button.setAttribute("aria-label", `Abrir el día ${day}`);
  button.addEventListener("click", () => {
    selectedDay.textContent = String(day).padStart(2, "0");
    dialog.showModal();
  });
  calendar.append(button);
}

closeButton.addEventListener("click", () => dialog.close());
confirmButton.addEventListener("click", () => dialog.close());
