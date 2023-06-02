const loadingPage = document.getElementById("loadingIndicator")

const firebaseConfig = {
  apiKey: "AIzaSyBphsYbi_PpOEDnrDuT-GtLNilguBS5y3g",
  authDomain: "quizapp-c4093.firebaseapp.com",
  databaseURL: "https://quizapp-c4093-default-rtdb.firebaseio.com",
  projectId: "quizapp-c4093",
  storageBucket: "quizapp-c4093.appspot.com",
  messagingSenderId: "378931628353",
  appId: "1:378931628353:web:88d2f50e1b6b930394f9c0",
  measurementId: "G-NNXLXZNHBS"
};
firebase.initializeApp(firebaseConfig);

const quizList = document.getElementById("quizList");

function createQuizCard(quizData) {
  const card = document.createElement("div");
  card.classList.add("quizCard");

  const name = document.createElement("h3");
  name.textContent = quizData.quizName + " : " + quizData.username;

  name.addEventListener("click", () => {
    document.body.innerHTML = "";

    const back = document.createElement("a");
    back.setAttribute("href", "./main.htm");
    back.innerHTML = "X";
    back.classList.add("back");

    const quizContainer = document.createElement("div");
    quizContainer.classList.add("quizContainer");

    const quizTitle = document.createElement("h2");
    quizTitle.textContent = quizData.quizName;
    quizContainer.appendChild(quizTitle);

    const creatorName = document.createElement("h4");
    creatorName.textContent = "Creator: " + quizData.username;
    quizContainer.appendChild(creatorName);
    creatorName.classList.add("creator");

    quizData.questions.forEach((question) => {
      const questionContainer = document.createElement("div");
      questionContainer.classList.add("questionContainer");

      const questionTitle = document.createElement("h4");
      questionTitle.textContent = question.questionTitle;
      questionContainer.appendChild(questionTitle);

      question.answers.forEach((answer, index) => {
        const answerLabel = document.createElement("label");
        const answerInput = document.createElement("input");
        answerInput.type = "radio";
        answerInput.name = `question-${question.questionIndex}`;
        answerInput.value = index;
        answerLabel.appendChild(answerInput);
        answerLabel.appendChild(document.createTextNode(answer.answer));
        questionContainer.appendChild(answerLabel);
      });

      quizContainer.appendChild(questionContainer);
    });

    const submitButton = document.createElement("button");
    submitButton.classList.add("submitBtn");

    submitButton.textContent = "Təsdiqlə";
    quizContainer.appendChild(submitButton);

    submitButton.addEventListener("click", () => {
      let correctAnswers = 0;
      const selectedAnswers = [];

      quizData.questions.forEach((question) => {
        const selectedAnswerInput = quizContainer.querySelector(
          `input[name="question-${question.questionIndex}"]:checked`
        );

        if (selectedAnswerInput) {
          const selectedAnswerIndex = parseInt(selectedAnswerInput.value);
          const correctAnswerIndex = question.correctAnswerIndex;

          if (selectedAnswerIndex === correctAnswerIndex) {
            correctAnswers++;
             (`Correct answer for question ${question.questionIndex}`);
          } else {
             (`Incorrect answer for question ${question.questionIndex}`);
          }

          const selectedAnswerText = question.answers[selectedAnswerIndex].answer;

          selectedAnswers.push({
            questionIndex: question.questionIndex,
            selectedAnswerIndex: selectedAnswerIndex,
            selectedAnswerText: selectedAnswerText,
          });
        } else {
           (`No answer selected for question ${question.questionIndex}`);
        }
      });

      const userName = getCookie("usernameQuiz");
      const quizResult = {
        quizName: quizData.quizName,
        creatorName: quizData.username,
        user: userName,
        correctAnswers: correctAnswers,
        selectedAnswers: selectedAnswers,
        quizLength: quizData.questions.length,
      };
      const resultRef = firebase.database().ref("results");

   
resultRef
.push(quizResult)
.then(() => {
  document.body.innerHTML = "";
  const resultDiv = document.createElement("div");
  const resultCard = document.createElement("div");
  const totalQuestions = document.createElement("p");
  totalQuestions.textContent = `Ümumi sualların sayı: ${quizData.questions.length}`;
  resultCard.appendChild(totalQuestions);

  const correctAnswersInfo = document.createElement("p");
  correctAnswersInfo.textContent = `Doğru cavabların sayı: ${correctAnswers}`;
  resultCard.appendChild(correctAnswersInfo);

  resultDiv.classList.add("resultDiv");
  resultCard.classList.add("resultCard");

  resultDiv.appendChild(resultCard);

  const backButton = document.createElement("button");
  backButton.classList.add("backResult");
  backButton.textContent = "Geri qayıt";
  backButton.addEventListener("click", () => {
    location.href = "./main.htm";
  });
  resultDiv.appendChild(backButton);

  document.body.appendChild(resultDiv);
})
.catch((error) => {
  console.error("Error saving quiz result:", error);
});
    });

    quizContainer.appendChild(back);
    document.body.appendChild(quizContainer);
  });

  card.appendChild(name);
  quizList.appendChild(card);
}

function retrieveQuizzes() {
  const quizAppDb = firebase.database().ref("quizz");

  quizAppDb
    .once("value")
    .then((snapshot) => {
      const quizzes = [];
      snapshot.forEach((childSnapshot) => {
        const quizData = childSnapshot.val();
        quizzes.push(quizData);
      });
      quizzes.reverse(); 

      quizzes.forEach((quizData) => {
        createQuizCard(quizData);
      });

      loadingPage.remove();
    })
    .catch((error) => {
      console.error("Error retrieving quizzes:", error);
    });
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].split("=");
    const cookieName = cookie[0];
    const cookieValue = cookie[1];
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
}
const searchInput = document.getElementById("search");

searchInput.addEventListener("input", () => {
  const searchQuery = searchInput.value.toLowerCase();
  const quizCards = document.getElementsByClassName("quizCard");

  for (let i = 0; i < quizCards.length; i++) {
    const quizCard = quizCards[i];
    const quizName = quizCard.getElementsByTagName("h3")[0].textContent.toLowerCase();

    if (quizName.includes(searchQuery)) {
      quizCard.style.display = "block";
    } else {
      quizCard.style.display = "none";
    }
  }
});


window.onload = retrieveQuizzes;

