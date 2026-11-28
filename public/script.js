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
const storyTitle = document.querySelector("#story-title");
const storyDayLabel = document.querySelector("#story-day-label");
const gameTitle = document.querySelector("#game-title");
const gameDescription = document.querySelector("#game-description");

const STORAGE_KEY = "diciembre-contigo-opened-days";
const testMode = true;
const calendarYear = 2026;
const supportedScenes = new Set(["window", "lantern", "stars"]);
let currentDayContent;

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

function validateDayContent(content, day) {
  if (!content || typeof content !== "object" || Array.isArray(content)) {
    throw new Error(`El contenido del día ${day} debe ser un objeto JSON.`);
  }

  const hasValidPages = Array.isArray(content.pages)
    && content.pages.length > 0
    && content.pages.every((page) => (
      page
      && typeof page === "object"
      && !Array.isArray(page)
      && Array.isArray(page.paragraphs)
      && page.paragraphs.length > 0
      && page.paragraphs.every((paragraph) => typeof paragraph === "string")
      && (supportedScenes.has(page.scene) || typeof page.image === "string")
      && typeof page.caption === "string"
    ));
  const hasValidGame = content.game
    && content.game.status === "coming-soon"
    && typeof content.game.title === "string"
    && typeof content.game.description === "string";

  if (typeof content.title !== "string" || !hasValidPages || !hasValidGame) {
    throw new Error(`El contenido del día ${day} no cumple el formato esperado.`);
  }

  return content;
}

async function loadDayContent(day) {
  const response = await fetch(`content/days/day-${String(day).padStart(2, "0")}.json`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`No se pudo cargar el contenido del día ${day} (HTTP ${response.status}).`);
  }

  return validateDayContent(await response.json(), day);
}

function renderStoryPage() {
  storyPage.replaceChildren();
  const story = currentDayContent.pages[currentStoryPage];
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

  if (story.image) {
    const image = document.createElement("img");
    image.className = "book-illustration book-illustration--photo";
    image.src = story.image;
    image.alt = story.caption;
    artLeaf.append(image);
  } else {
    const illustration = document.createElement("div");
    illustration.className = `book-illustration book-illustration--${story.scene}`;
    illustration.setAttribute("role", "img");
    illustration.setAttribute("aria-label", story.caption);
    const illustrationParts = [
      ["art-moon"],
      ["art-window"],
      ["art-pine", "art-pine--left"],
      ["art-pine", "art-pine--right"],
      ["art-snow"],
      ["art-lantern"],
      ["art-sparkle", "art-sparkle--one", "✦"],
      ["art-sparkle", "art-sparkle--two", "✧"],
      ["art-sparkle", "art-sparkle--three", "✦"],
    ];
    for (const [partClass, modifierClass, text] of illustrationParts) {
      const part = document.createElement("span");
      part.className = modifierClass ? `${partClass} ${modifierClass}` : partClass;
      if (text) {
        part.textContent = text;
      }
      if (partClass === "art-lantern") {
        part.append(document.createElement("span"));
      }
      illustration.append(part);
    }
    artLeaf.append(illustration);
  }

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

  storyPageCount.textContent = `${pageNumber} / ${currentDayContent.pages.length}`;
  storyProgress.setAttribute("aria-label", `Página ${pageNumber} de ${currentDayContent.pages.length}`);
  storyProgress.style.setProperty("--story-progress", `${(pageNumber / currentDayContent.pages.length) * 100}%`);
  storyPreviousButton.disabled = currentStoryPage === 0;
  const isLastPage = currentStoryPage === currentDayContent.pages.length - 1;
  storyNextButton.textContent = isLastPage ? "Cuento completo" : "Siguiente →";
  storyNextButton.disabled = isLastPage;
  gamePlaceholder.hidden = !isLastPage;
}

async function openDay(day, button) {
  button.disabled = true;
  try {
    const dayContent = await loadDayContent(day);
    if (!dayContent) {
      selectedDay.textContent = String(day).padStart(2, "0");
      dialog.showModal();
      return;
    }

    currentDayContent = dayContent;
    storyTitle.textContent = dayContent.title;
    storyDayLabel.textContent = `${day} DE DICIEMBRE · UN CUENTO PARA TI`;
    gameTitle.textContent = dayContent.game.title;
    gameDescription.textContent = dayContent.game.description;
    currentStoryPage = 0;
    renderStoryPage();
    markDayAsOpened(day, button);
    storyDialog.showModal();
  } catch (error) {
    console.error(`No se pudo abrir el contenido del día ${day}.`, error);
    showStorageNotice(`No se pudo cargar el contenido del día ${day}. Comprueba que su archivo JSON tenga el formato correcto y vuelve a intentarlo.`);
  } finally {
    button.disabled = false;
  }
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
  if (currentDayContent && currentStoryPage < currentDayContent.pages.length - 1) {
    currentStoryPage += 1;
    renderStoryPage();
  }
});
