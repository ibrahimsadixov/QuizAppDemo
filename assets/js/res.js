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
  
  const db = firebase.database();
  const resultsContainer = document.getElementById("results-container");
  const usernameQuiz = getCookie("usernameQuiz");
  
  db.ref("results")
    .orderByKey()
    .once("value")
    .then((snapshot) => {
      loadingPage.remove();
      const results = snapshot.val();
  
      const resultsArray = Object.entries(results);
      const reversedResults = resultsArray.reverse();
  
      const promises = reversedResults.map(([key, result]) => {
        const creatorName = result.creatorName;
        const selectedAnswers = result.selectedAnswers;
        const user = result.user;
        const quizName = result.quizName;
        const correctAnswers = result.correctAnswers;
  
        if (creatorName === usernameQuiz) {
          return db
            .ref("results")
            .child(key)
            .child("quizLength")
            .once("value")
            .then((quizLengthSnapshot) => {
              const quizLength = quizLengthSnapshot.val();
  
              const card = document.createElement("div");
              card.className = "card";
  
              const userTitle = document.createElement("div");
              userTitle.className = "card-title";
              userTitle.textContent = "İstifadəçi Adı: " + user;
  
              const quizNameTitle = document.createElement("div");
              quizNameTitle.className = "card-title";
              quizNameTitle.textContent = "Quiz Adı: " + quizName;
  
              card.appendChild(userTitle);
              card.appendChild(quizNameTitle);
  
              const answersElement = document.createElement("div");
              answersElement.className = "card-answers";
              answersElement.innerHTML = "Verilmiş Cavablar: ";
  
              const selectedAnswerTexts = selectedAnswers.map(
                (answer) => answer.selectedAnswerText
              );
              const answersText = selectedAnswerTexts.join(", ");
  
              const answerItem = document.createElement("span");
              answerItem.className = "answer-item";
              answerItem.textContent = answersText;
  
              answersElement.appendChild(answerItem);
  
              const correctAnswersElement = document.createElement("div");
              correctAnswersElement.className = "correct-answers";
              correctAnswersElement.innerHTML =
                "Düzgün Cavabların Sayı: " + correctAnswers;
  
              const totalQuestionsElement = document.createElement("div");
              totalQuestionsElement.className = "total-questions";
              totalQuestionsElement.innerHTML =
                "Ümumi Sualların sayı: " + quizLength;
  
              card.appendChild(totalQuestionsElement);
              card.appendChild(correctAnswersElement);
              card.appendChild(answersElement);
  
              resultsContainer.appendChild(card);
            });
        }
      });
  
      Promise.all(promises).catch((error) => {
        // Handle error
      });
    })
    .catch((error) => {
      // Handle error
    });
  
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
  