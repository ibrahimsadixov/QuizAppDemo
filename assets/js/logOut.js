const logOut = document.querySelector(".logOut")
function logout() {
    
    document.cookie = `usernameQuiz=${encodeURIComponent("")}`;
    document.cookie = `passwordQuiz=${encodeURIComponent("")}`;
    window.location.href = "./index.htm"; 
  }
  
  logOut.addEventListener("click",()=>{
    logout()
  })