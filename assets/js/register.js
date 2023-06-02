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
  
  const register = document.getElementById("register");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  
  register.addEventListener('submit', (e) => {
    e.preventDefault();
  
    const username = usernameInput.value;
    const password = passwordInput.value;
    if (username === '' || password === '') {
      alert('Xahiş olunur bütün sahələri doldurun');
      return;
    }
  
    const user = {
      username: username,
      password: password,
    };
  
    const quizAppDb = firebase.database().ref('users');
    quizAppDb.orderByChild('username').equalTo(username).once('value')
      .then((snapshot) => {
        if (snapshot.exists()) {
          alert("İstifadəçi adı artıq mövcuddur");
          return;
        }
  
        
        document.cookie = `usernameQuiz=${encodeURIComponent(username)}`;
        document.cookie = `passwordQuiz=${encodeURIComponent(password)}`;
  
        quizAppDb.push(user)
          .then(() => {
            document.cookie = `usernameQuiz=${encodeURIComponent(username)}`;
            document.cookie = `passwordQuiz=${encodeURIComponent(password)}`;
            window.location.href = "/main.htm";
          });
      });
  });
  