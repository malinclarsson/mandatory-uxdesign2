//======================================== VARIABLES ========================================//


const modalDialog = document.querySelector(".mds-popup");
const container = document.querySelector (".mds-container");
const menuIcon = document.querySelector (".mds-header-icon ");
const menu = document.querySelector(".mds-menubar");
const menuItems = document.querySelectorAll(".mds-menubar-list-item");
const statsContainer = document.querySelector (".mds-stats");
const aboutContainer = document.querySelector(".mds-about");

let menuTitle = document.querySelector(".mds-header-text");

let stats = {
        gamesplayed: "" ,
        right:"",
        incorrectanswer:"",
        correctpercentage:"",
}
let gamesPlayed = 0;
let numberOfWrong = 0;
let percentage = 0;
let allCorrect = 0;
let count = 1;
let allCorrectAnswer = [];
let playerAnswer = [];
let numOfCorrectAnswer = 0;

//======================================== DATA ========================================//
//========== function getData ==========//
function getData (){
  return fetch("https://opentdb.com/api.php?amount=10&category=20&difficulty=easy&type=multiple")
 .then  (response => response.json())
 .then (response => {return response;})
 .catch (error => console.error ("Error", error));
}

/*
function getData (){
  const baseURL = 'https://opentdb.com/api.php?amount=10&category=20&difficulty=easy&type=multiple';

axios.get(baseURL)
  .then(function (response) {
    console.log(response.status + " " + response.statusText); // <-- "200 OK"
    //console.log(response.data.results);// <-- get the whole object.
    console.log(response.data.results[0].question); //<-- get the first indexed question
    console.log(response.data.results[0].correct_answer); //<-- get the first indexed correct answer
    console.log(response.data.results[0].incorrect_answers); //<-- get the first indexed incorrect answer
    //console.log(response.data.results[0].incorrect_answers[2]); //<--  the indexed incorrect answer
  })
  .catch(function (error) {
    console.log(error);
    console.log(error.response.status);
  });
}
*/
//======================================== BOARD ========================================//
//========== function startQuiz ==========//
const startButton = document.querySelector(".mds-body-button");

startButton.addEventListener ("click", () =>{
  startButton.classList.add ("mds-display-none");
  quizBox.dataset.type = "active";

  getData()
  .then (res => renderQuiz(res));
});

//========== function renderData ==========//
const quizBox = document.querySelector(".mds-body");

function renderQuiz (data){
  let answer = [];
  let quizHeadline = document.createElement("h3");
  quizHeadline.innerHTML = "Quiz "+(gamesPlayed+1);
  quizBox.appendChild (quizHeadline);
  let array = data.results;
  for (let i = 0; i < array.length;i++){
      let question = array[i].question;
      let questionText = document.createElement("h2");
      questionText.innerHTML = question;
      quizBox.appendChild(questionText);
      answer = randomAnswer(array[i].correct_answer,array[i].incorrect_answers);
      renderAnswer(answer);
      count ++;
  }
  let doneButton = document.createElement("button");
  doneButton.className ="mds-body-doneButton";
  doneButton.innerHTML = "Done";
  quizBox.appendChild(doneButton);
  doneButton.addEventListener("click",checkanswer);
}

//========== function randomize ==========//
function randomAnswer(correct,wrong){
  SaveCorrectAnswer (correct);
  wrong.push(correct);
      let j,x,i;
      for (i = wrong.length -1; i > 0; i--){
          j = Math.floor(Math.random() * (i+1));
          x=wrong[i];
          wrong[i] = wrong[j];
          wrong[j] = x;
          return wrong;
      }
  return wrong;
}

//========== function renderAnswers ==========//
function renderAnswer (answer){
  let ulTag = document.createElement("ul");
  quizBox.appendChild(ulTag);
  for(let i = 0; i < answer.length;i++){
      let liTag = document.createElement("li");
      let inputTag = document.createElement ("input");
      let spanTag1 = document.createElement("span");
      let spanTag2 = document.createElement("span");
      let pTag = document.createElement("p");
      giveAttributes(inputTag,{
          type: "radio",
          name: "radio"+count,
          value: answer[i],
      });
      inputTag.className ="mds-radio-input";
      spanTag1.className = "mds-radio-border";
      spanTag2.className = "mds-radio-toogle";
      pTag.innerHTML = answer[i];
      ulTag.appendChild(liTag);
      liTag.appendChild(inputTag);
      liTag.appendChild(spanTag1);
      liTag.appendChild(spanTag2);
      liTag.appendChild(pTag);
  }
  quizBox.scrollIntoView();
}

//========== function getAttributes ==========//
function giveAttributes(element,obj){
  for (let prop in obj){
      if(obj.hasOwnProperty(prop)){
          element[prop] = obj[prop];
      }
  }
}

//========== function checkCorectAnswers ==========//
function SaveCorrectAnswer(correct){
  allCorrectAnswer.push(correct);
}

//========== function checkAnswers ==========//
function checkanswer (){
  let inputTags = document.querySelectorAll("input");
  numOfCorrectAnswer = 0;
  for (let i = 0; i < inputTags.length;i++){
      if (inputTags[i].type === "radio" && inputTags[i].checked){
          playerAnswer.push(inputTags[i].value);
      }
      else {continue;}
  }
 for (let i = 0; i < playerAnswer.length;i++){
      if(playerAnswer[i] === allCorrectAnswer[i]){
          numOfCorrectAnswer++;
      }
 }
 popUpFunction();
}

//========== function quizDone==========// <-- when you click the done-button

//========== function back to start ==========//


//======================================== MODAL DIALOG ========================================//
//========== function modalDialog ==========// <-- correct answers
function popUpFunction (){
  modalDialog.classList.remove("mds-display-none");
  container.style.backgroundColor  = "#ADADAD";
  let dialogtext = document.querySelector(".mds-popup-supporting--text");
  dialogtext.innerHTML = "You answered "+ numOfCorrectAnswer +"/10 questions correct";
  let closeButton = document.querySelector(".close");
  let reStartButton = document.querySelector(".re-start");
  closeButton.addEventListener("click",closeFunction);
  reStartButton.addEventListener("click",reStartFunction);
}

//========== function modalDialog-new game ==========//
function reStartFunction (){
  savePlayerStats();
  numOfCorrectAnswer = 0;
  clearHtmlFunction();
  allCorrectAnswer = [];
  playerAnswer = [];
  getData()
  .then (res => renderQuiz(res));
}

//========== function modalDialog-close ==========//
function closeFunction (){
  clearHtmlFunction();
  menuIcon.dataset.click = "inactive";
  startButton.classList.remove("mds-display-none");

}

//========== function back to start ==========//
// Clear all html to go back to the beginning
function clearHtmlFunction (){
  while (quizBox.firstChild) {
      quizBox.removeChild(quizBox.firstChild);
  }
  modalDialog.classList.add ("mds-display-none");
  container.style.backgroundColor  = "#fff";
}

//======================================== MENU ========================================//
//========== function menu ==========//
menuIcon.addEventListener("click", iconFunction);

function iconFunction(){
    if (menuIcon.dataset.click === "active"){
        statsContainer.classList.add("mds-display-none");
        menu.style.width ="640px";
        quizBox.classList.add("mds-display-none");
        startButton.classList.add("mds-display-none");
        aboutContainer.classList.add("mds-display-none"),
        menuIcon.dataset.click = "inactive";
        container.style.backgroundColor  = "#ADADAD";
    }
    else if (menuIcon.dataset.click === "inactive" ){
        if (menuTitle.textContent === "Stats"){
            statsFunction();
        }  else if (menuTitle.textContent ==="About"){
            aboutFunction();
        }  else {
            menu.style.width ="0px";
            quizBox.classList.remove("mds-display-none");
            if (quizBox.dataset.type != "active"){
            startButton.classList.remove("mds-display-none");
            }
            container.style.backgroundColor  = "#fff";
            menuIcon.dataset.click = "active";
        }
    }

}
for (let bar of menuItems){
    bar.addEventListener("click",function(e){
        if (e.target.innerHTML === "Back to the Game"){
            statsContainer.classList.add("mds-display-none");
            aboutContainer.classList.add("mds-display-none")
            menuTitle.innerHTML = "Sir Quiz-A-Lot";
            iconFunction();
        }
        else if (e.target.innerHTML ==="Stats"){
            statsFunction();
        }
        else if (e.target.innerHTML === "About"){
            aboutFunction();
        }
    })
}

//========== function game screen ==========//

//========== function stats ==========//
// Save stats from game in a object.
function savePlayerStats (){
  gamesPlayed = gamesPlayed + 1;
  allCorrect = allCorrect + numOfCorrectAnswer;
  percentage = percentage + (allCorrect / (10 * gamesPlayed));
  numberOfWrong =  numberOfWrong + (10 - numOfCorrectAnswer);

  stats = {
      gamesplayed: gamesPlayed,
      right: allCorrect,
      incorrectanswer: numberOfWrong,
      correctpercentage: percentage,
  };
  numOfCorrectAnswer = 0;
}
//------------//
function statsFunction (){
  quizBox.classList.add("mds-display-none")
  startButton.classList.add("mds-display-none");
  aboutContainer.classList.add("mds-display-none")
  container.style.backgroundColor= "#fff";
  menuIcon.dataset.click = "active"
  menuTitle.innerHTML = "Stats";
  statsContainer.classList.remove("mds-display-none")
  renderStats();
  menu.style.width ="0px";
}
//------------//
function renderStats (){
  document.querySelector(".played").innerHTML = (stats.gamesplayed);
  document.querySelector(".correct").innerHTML = (stats.right);
  document.querySelector(".incorrect").innerHTML = (stats.incorrectanswer);
  document.querySelector(".percentage").innerHTML = (stats.correctpercentage)*100 +"%";
}

//========== function about ==========//
function aboutFunction (){
  menuTitle.innerHTML = "About";
  quizBox.classList.add("mds-display-none")
  menuIcon.dataset.click = "active"
  startButton.classList.add("mds-display-none");
  container.style.backgroundColor= "#fff";
  menu.style.width ="0px";
  aboutContainer.classList.remove("mds-display-none")
}



/*======================================== MAIN SCREEN ========================================*/
/*======================================== QUIZ SCREEN ========================================*/
/*======================================== MODAL DIALOG ========================================*/
/*======================================== DRAWER MENU ========================================*/
/*======================================== STATS SCREEN ========================================*/
/*======================================== ABOUT SCREEN ========================================*/