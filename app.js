// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand(); // Раскрываем на весь экран

// Настройка Canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Подгоняем размер Canvas под экран
function resizeCanvas() {
  canvas.width = window.innerWidth * 0.9;
  canvas.height = window.innerHeight * 0.7;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Переменные для рисования
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Цвет и толщина кисти
ctx.strokeStyle = "#000000";
ctx.lineWidth = 4;
ctx.lineCap = "round";

// Обработчики событий (для мыши и касаний)
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("touchstart", handleTouchStart);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("touchmove", handleTouchMove);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("touchend", stopDrawing);

// Функции рисования
function startDrawing(e) {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
}

function handleTouchStart(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  isDrawing = true;
  [lastX, lastY] = [touch.clientX - rect.left, touch.clientY - rect.top];
}

function draw(e) {
  if (!isDrawing) return;
  const x = e.offsetX;
  const y = e.offsetY;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();
  [lastX, lastY] = [x, y];
}

function handleTouchMove(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;
  if (!isDrawing) return;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();
  [lastX, lastY] = [x, y];
}

function stopDrawing() {
  isDrawing = false;
}

// Очистка Canvas
document.getElementById("clear-btn").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Сохранение в группу Telegram
document.getElementById("save-btn").addEventListener("click", async () => {
  const imageData = canvas.toDataURL("image/png");
  const blob = await (await fetch(imageData)).blob();
  const formData = new FormData();

  // Получаем chat_id группы, откуда запущен Mini App
  const chatId = tg.initDataUnsafe.chat?.id;
  if (!chatId) {
    tg.showAlert("Запустите мини-приложение из группы, чтобы сохранить рисунок.");
    return;
  }

  formData.append("chat_id", chatId);
  formData.append("photo", blob, "drawing.png");

  const botToken = "7575940912:AAGZadQi6Ua0T-WwL6uL4ZZY0trR_DTbnY8"; // Замените на токен бота!
  const apiUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;

  try {
    await fetch(apiUrl, { method: "POST", body: formData });
    tg.showAlert("Рисунок сохранён в группу! 🎉");
    tg.close();
  } catch (error) {
    tg.showAlert("Ошибка при отправке. Попробуйте ещё раз.");
  }
});