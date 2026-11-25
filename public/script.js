const calendar = document.querySelector("#calendar");
const dialog = document.querySelector("#surprise-dialog");
const selectedDay = document.querySelector("#selected-day");
const closeButton = dialog.querySelector(".dialog-close");
const confirmButton = dialog.querySelector(".dialog-button");

for (let day = 1; day <= 24; day += 1) {
  const button = document.createElement("button");
  button.className = "day";
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
