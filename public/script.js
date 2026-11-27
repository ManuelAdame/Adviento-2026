const calendar = document.querySelector("#calendar");
const dialog = document.querySelector("#surprise-dialog");
const selectedDay = document.querySelector("#selected-day");
const closeButton = dialog.querySelector(".dialog-close");
const confirmButton = dialog.querySelector(".dialog-button");
const progressTrack = document.querySelector("#progress-track");
const progressFill = document.querySelector("#progress-fill");
const progressCount = document.querySelector("#progress-count");
const storageNotice = document.querySelector("#storage-notice");
const entryScreen = document.querySelector("#entry-screen");
const calendarScreen = document.querySelector("#calendar-screen");
const openCalendarButton = document.querySelector("#open-calendar");
const backHomeLink = document.querySelector("#back-home");
const pageTitle = document.querySelector("#page-title");
const storyDialog = document.querySelector("#day-one-dialog");
const storyPage = document.querySelector("#story-page");
const storyPageCount = document.querySelector("#story-page-count");
const storyProgress = document.querySelector("#story-progress");
const storyPreviousButton = document.querySelector("#story-previous");
const storyNextButton = document.querySelector("#story-next");
const gamePlaceholder = document.querySelector("#game-placeholder");

const STORAGE_KEY = "diciembre-contigo-opened-days";
const testMode = true;
const calendarYear = 2026;
const storyPages = [
  {
    paragraphs: [
      "La noche del 1 de diciembre, el invierno dejó una lucecita encendida junto a la ventana.",
      "Era pequeña, cálida y un poco tímida. Nadie sabía de dónde había venido, pero parecía estar esperando a alguien."
    ],
    scene: "window",
    caption: "La primera noche de diciembre"
  },
  {
    paragraphs: [
      "Al otro lado del cristal, la nieve cubría los tejados y el pueblo dormía bajo una manta blanca.",
      "La lucecita brilló un poquito más. Sabía que los mejores regalos no siempre vienen envueltos: a veces son momentos, palabras y personas que hacen que todo se sienta como en casa."
    ],
    scene: "lantern",
    caption: "Una luz en la nieve"
  },
  {
    paragraphs: [
      "Y así empezó diciembre: con veinticuatro días por descubrir y una sorpresa guardada detrás de cada uno.",
      "Esta primera lucecita es para ti. Gracias por llenar de magia hasta los días más normales."
    ],
    scene: "stars",
    caption: "Veinticuatro pequeñas sorpresas"
  }
];

function showStorageNotice(message) {
  storageNotice.textContent = message;
  storageNotice.hidden = false;
}

function loadOpenedDays() {
  try {
    const storedDays = window.localStorage.getItem(STORAGE_KEY);
    if (storedDays === null) {
      return new Set();
    }

    const parsedDays = JSON.parse(storedDays);
    if (
      !Array.isArray(parsedDays)
      || parsedDays.some((day) => !Number.isInteger(day) || day < 1 || day > 24)
    ) {
      throw new Error("El progreso guardado no tiene un formato válido.");
    }
    return new Set(parsedDays);
  } catch (error) {
    console.error("No se pudo leer el progreso guardado del calendario.", error);
    showStorageNotice("No se pudo cargar el progreso guardado en este navegador.");
    return new Set();
  }
}

const openedDays = loadOpenedDays();

function saveOpenedDays() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...openedDays]));
  } catch (error) {
    console.error("No se pudo guardar el progreso del calendario.", error);
    showStorageNotice("El progreso se conserva mientras esta página siga abierta, pero no se pudo guardar en este navegador.");
  }
}

function getUnlockedDay() {
  if (testMode) {
    return 1;
  }

  const today = new Date();
  if (today.getFullYear() !== calendarYear || today.getMonth() !== 11) {
    return 0;
  }
  return Math.min(24, today.getDate());
}

function updateProgress() {
  const completedDays = openedDays.size;
  const progressPercent = (completedDays / 24) * 100;
  progressFill.style.width = `${progressPercent}%`;
  progressTrack.style.setProperty("--progress", `${progressPercent}%`);
  progressCount.textContent = `${completedDays} de 24 días abiertos`;
  progressTrack.setAttribute("aria-valuenow", String(completedDays));
}

function markDayAsOpened(day, button) {
  if (openedDays.has(day)) {
    return;
  }

  openedDays.add(day);
  button.classList.add("day--opened");
  button.setAttribute("aria-label", `Volver a abrir el día ${day}, ya abierto`);
  saveOpenedDays();
  updateProgress();
}

let currentStoryPage = 0;

function renderStoryPage() {
  storyPage.replaceChildren();
  const story = storyPages[currentStoryPage];
  const textLeaf = document.createElement("article");
  textLeaf.className = "book-leaf book-leaf--text";

  const textLabel = document.createElement("span");
  textLabel.className = "book-leaf-label";
  textLabel.textContent = "UN CUENTO PARA TI";
  textLeaf.append(textLabel);

  for (const paragraphText of story.paragraphs) {
    const paragraph = document.createElement("p");
    paragraph.textContent = paragraphText;
    textLeaf.append(paragraph);
  }

  const pageNumber = currentStoryPage + 1;
  const textFolio = document.createElement("span");
  textFolio.className = "book-folio";
  textFolio.textContent = String((pageNumber * 2) - 1).padStart(2, "0");
  textLeaf.append(textFolio);

  const artLeaf = document.createElement("div");
  artLeaf.className = "book-leaf book-leaf--art";

  const illustration = document.createElement("div");
  illustration.className = `book-illustration book-illustration--${story.scene}`;
  illustration.setAttribute("role", "img");
  illustration.setAttribute("aria-label", story.caption);
  illustration.innerHTML = `
    <span class="art-moon"></span>
    <span class="art-window"></span>
    <span class="art-pine art-pine--left"></span>
    <span class="art-pine art-pine--right"></span>
    <span class="art-snow"></span>
    <span class="art-lantern"><span></span></span>
    <span class="art-sparkle art-sparkle--one">✦</span>
    <span class="art-sparkle art-sparkle--two">✧</span>
    <span class="art-sparkle art-sparkle--three">✦</span>
  `;
  artLeaf.append(illustration);

  const caption = document.createElement("span");
  caption.className = "book-art-caption";
  caption.textContent = story.caption;
  artLeaf.append(caption);

  const artFolio = document.createElement("span");
  artFolio.className = "book-folio";
  artFolio.textContent = String(pageNumber * 2).padStart(2, "0");
  artLeaf.append(artFolio);

  if (pageNumber % 2 === 0) {
    storyPage.classList.add("book-spread--art-left");
    storyPage.append(artLeaf, textLeaf);
  } else {
    storyPage.classList.remove("book-spread--art-left");
    storyPage.append(textLeaf, artLeaf);
  }

  storyPageCount.textContent = `${pageNumber} / ${storyPages.length}`;
  storyProgress.setAttribute("aria-label", `Página ${pageNumber} de ${storyPages.length}`);
  storyProgress.style.setProperty("--story-progress", `${(pageNumber / storyPages.length) * 100}%`);
  storyPreviousButton.disabled = currentStoryPage === 0;
  storyNextButton.textContent = currentStoryPage === storyPages.length - 1 ? "Cuento completo" : "Siguiente →";
  storyNextButton.disabled = currentStoryPage === storyPages.length - 1;
  gamePlaceholder.hidden = currentStoryPage !== storyPages.length - 1;
}

function openDay(day, button) {
  markDayAsOpened(day, button);
  if (day === 1) {
    currentStoryPage = 0;
    renderStoryPage();
    storyDialog.showModal();
    return;
  }

  selectedDay.textContent = String(day).padStart(2, "0");
  dialog.showModal();
}

function showCalendar() {
  entryScreen.hidden = true;
  calendarScreen.hidden = false;
  calendarScreen.classList.remove("screen-arrive");
  void calendarScreen.offsetWidth;
  calendarScreen.classList.add("screen-arrive");
  window.scrollTo({ top: 0, behavior: "smooth" });
  pageTitle.focus({ preventScroll: true });
}

function showEntryScreen(event) {
  event.preventDefault();
  calendarScreen.hidden = true;
  entryScreen.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
  openCalendarButton.focus({ preventScroll: true });
}

pageTitle.tabIndex = -1;
openCalendarButton.addEventListener("click", showCalendar);
backHomeLink.addEventListener("click", showEntryScreen);

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

const unlockedDay = getUnlockedDay();

for (const { day, size } of calendarDays) {
  const button = document.createElement("button");
  const isLocked = day > unlockedDay;
  button.className = `day${size ? ` day--${size}` : ""}${isLocked ? " day--locked" : ""}${openedDays.has(day) ? " day--opened" : ""}`;
  button.type = "button";
  button.textContent = String(day).padStart(2, "0");
  button.setAttribute(
    "aria-label",
    isLocked
      ? `Día ${day}, próximamente`
      : openedDays.has(day)
        ? `Volver a abrir el día ${day}, ya abierto`
        : `Abrir el día ${day}`
  );
  button.addEventListener("click", () => {
    if (isLocked) {
      selectedDay.textContent = String(day).padStart(2, "0");
      dialog.showModal();
      return;
    }

    openDay(day, button);
  });
  calendar.append(button);
}

updateProgress();
closeButton.addEventListener("click", () => dialog.close());
confirmButton.addEventListener("click", () => dialog.close());
storyDialog.querySelector(".story-close").addEventListener("click", () => storyDialog.close());
storyPreviousButton.addEventListener("click", () => {
  if (currentStoryPage > 0) {
    currentStoryPage -= 1;
    renderStoryPage();
  }
});
storyNextButton.addEventListener("click", () => {
  if (currentStoryPage < storyPages.length - 1) {
    currentStoryPage += 1;
    renderStoryPage();
  }
});
