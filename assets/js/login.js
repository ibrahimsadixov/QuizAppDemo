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

  const loginForm = document.getElementById("loginForm");
  const usernameInput = document.getElementById("usernameLogin");
  const passwordInput = document.getElementById("passwordLogin");
  
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
  
    const username = usernameInput.value;
    const password = passwordInput.value;
  
    if (username === '' || password === '') {
      alert('Xahiş olunur bütün sahələri doldurun');
      return;
    }
  
    const quizAppDb = firebase.database().ref('users');
    quizAppDb.orderByChild('username').equalTo(username).once('value')
      .then((snapshot) => {
        if (!snapshot.exists()) {
          alert("İstifadəçi tapılmadı");
          return;
        }
  
        let userExists = false;
  
        snapshot.forEach((childSnapshot) => {
          const userData = childSnapshot.val();
          if (userData.password === password) {
            userExists = true;
            return;
          }
        });
  
        if (!userExists) {
          alert("Şifrə yanlışdır");
          return;
        }
  
        document.cookie = `usernameQuiz=${encodeURIComponent(username)}`;
        document.cookie = `passwordQuiz=${encodeURIComponent(password)}`;
  
         ('User logged in:', username);
        window.location.href = "/main.htm";
      })
      .catch((error) => {
      });
  });
  
  const username = getCookie("usernameQuiz");
  const password = getCookie("passwordQuiz");
  firebase
  .database()
  .ref("users")
  .orderByChild("username")
  .equalTo(username)
  .once("value")
  .then((snapshot) => {
    if (snapshot.exists()) {
      const userData = snapshot.val();
      const user = Object.values(userData)[0];

      if (user.password === password) {
        window.location.href = "./main.htm";
      } else {
      
      }
    } else {
 
    }
  })
  .catch((error) => {
  });
  function getCookie(name) {
    const cookieValue = document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)");
    return cookieValue ? cookieValue.pop() : "";
  }
  