
let currentLevel = null;
let timeout = 10000;
let currentIndex = 0;
let correctCount = 0;
let tasks = [];
let timer = null;

function startGame(level) {
  currentLevel = level;
  timeout = level === "basic" ? 15000 : level === "intermediate" ? 10000 : 5000;
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "block";
  generateTasks();
  showTask();
}

function generateTasks() {
  const all = [];
  for (let i = 0; i <= 20; i++) {
    for (let j = 0; j <= 20; j++) {
      if (i + j <= 20) all.push({ q: `${i} + ${j}`, a: i + j });
    }
  }
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
      if (i - j > -10 && i - j < 20) all.push({ q: `${i} - ${j}`, a: i - j });
    }
  }
  for (let i = 0; i <= 10; i++) {
    for (let j = 0; j <= 10; j++) {
      all.push({ q: `${i} × ${j}`, a: i * j });
    }
  }
  shuffle(all);
  tasks = all.slice(0, 20);
}

function showTask() {
  if (currentIndex >= tasks.length) {
    endGame();
    return;
  }
  const task = tasks[currentIndex];
  document.getElementById("task").textContent = task.q + " = ?";
  const correct = task.a;
  const options = [correct];
  while (options.length < 3) {
    let wrong = correct + Math.floor(Math.random() * 10) - 5;
    if (!options.includes(wrong) && wrong >= -10 && wrong <= 100) {
      options.push(wrong);
    }
  }
  shuffle(options);
  document.getElementById("answers").innerHTML = options.map(opt =>
    `<button onclick="selectAnswer(${opt})">${opt}</button>`
  ).join("");
  timer = setTimeout(() => {
    flashScreen(false);
    nextTask();
  }, timeout);
}

function selectAnswer(ans) {
  clearTimeout(timer);
  const correct = tasks[currentIndex].a;
  const isCorrect = ans === correct;
  if (isCorrect) correctCount++;
  flashScreen(isCorrect);
  setTimeout(nextTask, 1500);
}

function flashScreen(correct) {
  const screen = document.body;
  screen.classList.remove("flash-correct", "flash-wrong");
  void screen.offsetWidth; // trigger reflow
  
  const smiley = document.getElementById("smiley");
  if (smiley) {
    smiley.src = correct ? "smiley_smiling.png" : "smiley_neutral.png";
    smiley.style.display = "block";
    setTimeout(() => { smiley.style.display = "none"; }, 1500);
  }

  screen.classList.add(correct ? "flash-correct" : "flash-wrong");
}

function nextTask() {
  currentIndex++;
  showTask();
}

function endGame() {
  document.getElementById("game-screen").style.display = "none";
  document.getElementById("end-screen").style.display = "block";
  const percent = Math.round((correctCount / tasks.length) * 100);
  document.getElementById("final-score").textContent =
    `Level: ${currentLevel}, Correct: ${percent}%`;
}

function resetGame() {
  currentIndex = 0;
  correctCount = 0;
  document.body.className = "";
  document.getElementById("end-screen").style.display = "none";
  document.getElementById("start-screen").style.display = "block";
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
