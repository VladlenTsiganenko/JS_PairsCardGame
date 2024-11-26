let game = document.getElementById("game");
let playAgainButton = document.getElementById("play-again");
let settingsForm = document.getElementById("settings-form");
let gameStartBtn = document.getElementById("start-btn");
let firstCard = null;
let secondCard = null;
let gameActive = true;
let rowsInput = document.getElementById("rows");
let columnsInput = document.getElementById("columns");
let defaultRows = 2;
let defaultColumns = 2;

let timerElement = document.getElementById("timer");
let timeLeftElement = document.getElementById("time-left");
let timerInterval; // Для хранения идентификатора интервала таймера
let timeLeft = 60; // Время в секундах

function createNumbersArray(rows, columns) {
  const numbersArray = [];
  const count = rows * columns;

  for (let i = 1; i <= count / 2; i++) {
    numbersArray.push(i, i);
  }

  return numbersArray;
}

function resetGame() {
  game.innerHTML = ""; // Очищаем поле игры
  gameActive = true; // Возвращаем активность игры
  firstCard = null; // Сбрасываем первую открытую карточку
  secondCard = null; // Сбрасываем вторую открытую карточку
}

function goGame(game, rows, columns) {
  // Установка пользовательских значений для переменных --rows и --columns
  game.style.setProperty("--rows", rows);
  game.style.setProperty("--columns", columns);

  const pairedArray = createNumbersArray(rows, columns);

  // алгоритм Фишера — Йетса
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const shuffledArray = shuffle(pairedArray);

  function startGame() {
    for (const cardNumber of shuffledArray) {
      let card = document.createElement("div");
      card.textContent = cardNumber;
      card.classList.add("card");

      card.addEventListener("click", function () {
        if (!gameActive) {
          alert("Время вышло! Игра завершена!");
          return;
        }

        if (
          card.classList.contains("open") ||
          card.classList.contains("success")
        ) {
          alert("Эта карточка уже открыта");
          return;
        }

        if (firstCard !== null && secondCard !== null) {
          firstCard.classList.remove("open");
          secondCard.classList.remove("open");
          firstCard = null;
          secondCard = null;
        }

        card.classList.add("open");

        if (firstCard === null) {
          firstCard = card;
        } else {
          secondCard = card;
        }

        if (firstCard !== null && secondCard !== null) {
          let firstCardNumber = firstCard.textContent;
          let secondCardNumber = secondCard.textContent;

          if (firstCardNumber === secondCardNumber) {
            firstCard.classList.add("success");
            secondCard.classList.add("success");
          }
        }

        if (
          shuffledArray.length === document.querySelectorAll(".success").length
        ) {
          setTimeout(function () {
            alert("Победа!!!");
            gameActive = false; // Завершаем игру после победы
            playAgainButton.style.display = "block"; // Показываем кнопку "Сыграть ещё раз"
          }, 400);
          timeLeftElement.textContent = "1:00";
        }
      });

      game.append(card);
    }
  }

  startGame();

  // Таймер на одну минуту
  timerInterval = setInterval(function () {
    timeLeft--; // Уменьшаем оставшееся время на одну секунду
    if (timeLeft <= 0) {
      document.getElementById("alertField");
      alertField.textContent = "Время вышло!";
      clearInterval(timerInterval); // Останавливаем таймер
      // alert("Время вышло!");

      gameActive = false; // Завершаем игру после истечения времени
      playAgainButton.style.display = "block"; // Показываем кнопку "Сыграть ещё раз"
    }
    let minutes = Math.floor(timeLeft / 60); // Получаем количество минут
    let seconds = timeLeft % 60; // Получаем остаток секунд
    timeLeftElement.textContent = `${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`; // Обновляем отображение времени
  }, 1000); // Обновляем каждую секунду
}

settingsForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Предотвращаем отправку формы
  let rows = parseInt(rowsInput.value);
  let columns = parseInt(columnsInput.value);

  // Проверяем, соответствует ли введенное значение требованиям
  if (
    isNaN(rows) ||
    rows < 2 ||
    rows > 10 ||
    isNaN(columns) ||
    columns < 2 ||
    columns > 10 ||
    rows % 2 !== 0 ||
    columns % 2 !== 0
  ) {
    alert(
      "Некорректное количество карточек. Установлено значение по умолчанию: 4x4."
    );
    rowsInput.value = defaultRows;
    columnsInput.value = defaultColumns;
    rows = defaultRows;
    columns = defaultColumns;
  }

  resetGame(); // Сбрасываем игру
  clearInterval(timerInterval); // Останавливаем предыдущий таймер, если есть
  timeLeft = 60; // Сбрасываем время на 1 минуту
  timeLeftElement.textContent = "1:00"; // Обновляем отображение времени
  goGame(game, rows, columns); // Начинаем новую игру с указанным количеством карточек
});

gameStartBtn.addEventListener("click", function () {
  resetGame(); // Сбрасываем игру
  clearInterval(timerInterval); // Останавливаем предыдущий таймер, если есть
  timeLeft = 60; // Сбрасываем время на 1 минуту
  timeLeftElement.textContent = "1:00"; // Обновляем отображение времени
  goGame(game, defaultRows, defaultColumns); // Начинаем новую игру с количеством карточек по умолчанию
  alertField.textContent = "";
});

playAgainButton.addEventListener("click", function () {
  resetGame(); // Сбрасываем игру
  clearInterval(timerInterval); // Останавливаем предыдущий таймер, если он был запущен
  timeLeft = 60; // Сбрасываем время на 1 минуту
  timeLeftElement.textContent = "1:00"; // Обновляем отображение времени
  timerInterval = null; // Сбрасываем переменную интервала таймера
  goGame(game, defaultRows, defaultColumns); // Начинаем новую игру с количеством карточек по умолчанию
  alertField.textContent = "";
});
