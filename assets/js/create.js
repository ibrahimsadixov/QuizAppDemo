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

const create = document.getElementById("create");
const quizCount = document.getElementById("questionCount");
const questionAdd = document.getElementById("questionAdd");
const quizName = document.getElementById("quizName");

let questionCounter = 0;
let questionIdCounter = 0;

questionAdd.addEventListener("click", () => {
  const creatingPage = document.querySelector(".creatingPage");

  const questionDiv = document.createElement("div");
  questionDiv.classList.add("question");
  questionDiv.id = `question_${questionIdCounter}`; // Add unique ID to the question div

  const questionTitle = document.createElement("input");
  questionTitle.classList.add("title");
  questionTitle.placeholder = "Sual";

  const answerContainer = document.createElement("div");
  answerContainer.classList.add("answerContainer");


  const createAnswer = (questionDiv) => {
    const answerContainer = questionDiv.querySelector(".answerContainer");
  
    const answerLabel = document.createElement("label");
    answerLabel.classList.add("answer");
  
    const answerInput = document.createElement("input");
    answerInput.type = "text";
    answerInput.classList.add("answerInput");
    answerInput.name = `answer_${questionDiv.id.split("_")[1]}`; // Set the name attribute based on the parent question ID
  
    const correctAnswerRadio = document.createElement("input");
    correctAnswerRadio.type = "radio";
    correctAnswerRadio.name = `correctAnswer${questionDiv.id.split("_")[1]}`;
    correctAnswerRadio.classList.add("correctAnswerRadio");
    correctAnswerRadio.value = questionDiv.id.split("_")[1];
  
    const deleteAnswerButton = document.createElement("button");
    deleteAnswerButton.classList.add("button");
    deleteAnswerButton.classList.add("deleteAnswer");
    deleteAnswerButton.textContent = "X";
    deleteAnswerButton.addEventListener("click", () => {
      answerLabel.remove();
      deleteAnswerButton.remove();
    });
  
    answerLabel.appendChild(answerInput);
    answerLabel.appendChild(correctAnswerRadio);
    answerLabel.appendChild(deleteAnswerButton);
  
    answerContainer.appendChild(answerLabel);
    answerLabel.scrollIntoView({ behavior: 'smooth' });
  };
  
  const addAnswerButton = document.createElement("button");
  addAnswerButton.classList.add("button");
  addAnswerButton.classList.add("answerAdd");
  addAnswerButton.textContent = "Cavab Əlavə Et";
  addAnswerButton.addEventListener("click", () => createAnswer(questionDiv));
  
  const deleteQuestionButton = document.createElement("button");
  deleteQuestionButton.classList.add("button");
  deleteQuestionButton.classList.add("deleteQuestion");
  deleteQuestionButton.textContent = "X";
  deleteQuestionButton.addEventListener("click", () => {
    questionDiv.remove();
  });
  
  questionDiv.appendChild(questionTitle);
  questionDiv.appendChild(answerContainer);
  questionDiv.appendChild(addAnswerButton);
  questionDiv.appendChild(deleteQuestionButton);
  creatingPage.insertBefore(questionDiv, questionAdd);
  
  questionCounter++;
  questionIdCounter++; 
  questionDiv.scrollIntoView({ behavior: 'smooth' });
});

create.addEventListener("click", () => {
  const storedPassword = getCookie("passwordQuiz");
  const storedUsername = getCookie("usernameQuiz");

  if (storedPassword && storedUsername) {
    firebase
      .database()
      .ref("users")
      .orderByChild("username")
      .equalTo(storedUsername)
      .once("value")
      .then((snapshot) => {
        const userData = snapshot.val();
        const users = Object.values(userData);

        const matchingUser = users.find((user) => user.password === storedPassword);

        if (matchingUser) {
          const questions = document.querySelectorAll(".question");
          const quizData = {
            quizName: quizName.value,
            username: matchingUser.username,
            questions: [],
          };

          let isFormValid = true;

          if (quizData.quizName.trim() === "") {
            isFormValid = false;
            console.error("Quiz adı boş olmamılıdır.");
          }

          if (questions.length === 0) {
            isFormValid = false;
            console.error("Ən az bir sual əlavə olunmalıdır.");
          }

          questions.forEach((question, index) => {
            const questionTitle = question.querySelector(".title").value;
            const answerInputs = question.querySelectorAll(".answerInput");
            const correctAnswerRadioInputs = question.querySelectorAll(".correctAnswerRadio");

            const answers = Array.from(answerInputs).map((input, answerIndex) => ({
              answerIndex: answerIndex + 1,
              answer: input.value,
            }));

            const selectedCorrectAnswer = Array.from(correctAnswerRadioInputs).find(
              (radioInput) => radioInput.checked
            );

            if (!selectedCorrectAnswer) {
              isFormValid = false;
            } else {
              const correctAnswerIndex = Array.from(correctAnswerRadioInputs).indexOf(selectedCorrectAnswer);
              const questionData = {
                questionIndex: index,
                questionTitle,
                answers,
                correctAnswerIndex,
              };

              quizData.questions.push(questionData);
            }
          });

          const quizAppDb = firebase.database().ref("quizz");

          if (isFormValid) {
            quizAppDb
              .push(quizData)
              .then(() => {
                alert("Quiz əlavə olundu.");
              })
              .catch((error) => {
                alert("Quiz əlavə olunması zamanı xəta baş verdi.");
              });
          } else {
            alert("Xahiş olunur bütün sahələri doldurun.");
          }

        } 
      })
      .catch((error) => {
      });

  } else {
    alert("Xahiş olunur hesab yaradın və sonra yenidən yoxlayın.");
  }
});


function getCookie(name) {
  const cookieValue = document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)");
  return cookieValue ? cookieValue.pop() : "";
}

