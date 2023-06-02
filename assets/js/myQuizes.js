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

function getCookie(name) {
  const cookieValue = document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)");
  return cookieValue ? cookieValue.pop() : "";
}

function fetchUserQuizzes(username) {
  const quizAppDb = firebase.database().ref("quizz");
  const userQuizzes = [];

  quizAppDb
    .orderByChild("timestamp") 
    .once("value")
    .then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const quizData = childSnapshot.val();

        if (quizData.username === username) {
          userQuizzes.push({
            key: childSnapshot.key,
            data: quizData,
          });
        }
      });

      
      const reversedQuizzes = userQuizzes.reverse();

      displayQuizzes(reversedQuizzes);
      loadingPage.remove();
    })
    .catch((error) => {
   
    });
}

function deleteQuiz(quizKey) {
  const confirmDelete = confirm("Silmək istədiyinizə əminsinizmi?");
  if (!confirmDelete) {
    return;
  }

  const quizAppDb = firebase.database().ref("quizz");

  quizAppDb
    .child(quizKey)
    .remove()
    .then(() => {
      const username = getCookie("usernameQuiz");
      fetchUserQuizzes(username);
    })
    .catch((error) => {
  
    });
}

function displayQuizzes(quizzes) {
  const quizContainer = document.getElementById("quizContainer");

  quizContainer.innerHTML = "";

  quizzes.forEach((quiz) => {
    const quizElement = document.createElement("div");
    quizElement.classList.add("quiz");

    const quizNameElement = document.createElement("h3");
    quizNameElement.textContent = quiz.data.quizName;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Quizi Sil";
    deleteButton.addEventListener("click", () => {
      deleteQuiz(quiz.key);
    });

    quizElement.appendChild(quizNameElement);
    quizElement.appendChild(deleteButton);

    quizContainer.appendChild(quizElement);
  });
}

const username = getCookie("usernameQuiz");
fetchUserQuizzes(username);
