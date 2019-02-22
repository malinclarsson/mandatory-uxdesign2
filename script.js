/*======================================== VARIABLES ========================================*/
let count = 1;
let allCorrect = 0;
let playerAnswer = [];
let allCorrectAnswer = [];
//===== stats =====//
let gamesPlayed = 0;
let rightAnswers = 0;
let wrongAnswers = 0;
let percentage = 0;

/*======================================== MAIN SCREEN =========================================*/
//========== function startQuiz ==========//
const container = document.querySelector (".mds-container");
const startButton = document.querySelector(".mds-body-button");

startButton.addEventListener ("click", () =>{
  startButton.classList.add ("mds-display-none");
  quizBox.dataset.type = "active";

  getData()
  .then (response => renderData(response));
});
/*======================================== QUIZ SCREEN =========================================*/
//========== function getData ==========//
function getData (){
  return fetch("https://opentdb.com/api.php?amount=10&category=32&difficulty=easy&type=multiple")
 .then  (response => response.json())
 .then (response => {return response;})
 .catch (error => console.error ("Error", error));
}

//========== function renderData ==========//
const quizBox = document.querySelector(".mds-body");

function renderData (data){
  let answer = [];
  let quizTitle = document.createElement("h3");
  quizTitle.innerHTML = "Quiz "+(gamesPlayed+1);
  quizBox.appendChild (quizTitle);
  let array = data.results;
  for (let i = 0; i < array.length;i++){
      let question = array[i].question;
      let questionText = document.createElement("h2");
      questionText.innerHTML = question;
      quizBox.appendChild(questionText);
      answer = randomizer(array[i].correct_answer,array[i].incorrect_answers);
      renderOptions(answer);
      count ++;
  }
  let doneButton = document.createElement("button");
  doneButton.className ="mds-body-doneButton";
  doneButton.innerHTML = "Done";
  quizBox.appendChild(doneButton);
  doneButton.addEventListener("click",checkanswer);
}

//========== function randomize ==========//
function randomizer(correct,wrong){
  SaveRightAnswer (correct);
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

//========== function renderOptions ==========//
function renderOptions (answer){
  let options = document.createElement("ul");
  quizBox.appendChild(options);
  for(let i = 0; i < answer.length;i++){
      let list = document.createElement("li");
      let input = document.createElement ("input");
      let radioBorder = document.createElement("span");
      let radioToggle = document.createElement("span");
      let option = document.createElement("p");
      giveAttributes(input,{
          type: "radio",
          name: "radio"+count,
          value: answer[i],
      });
      input.className ="mds-radio-input";
      radioBorder.className = "mds-radio-border";
      radioToggle.className = "mds-radio-toogle";
      option.innerHTML = answer[i];
      options.appendChild(list);
      list.appendChild(input);
      list.appendChild(radioBorder);
      list.appendChild(radioToggle);
      list.appendChild(option);
  }
  quizBox.scroll();
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
function SaveRightAnswer(correct){
  allCorrectAnswer.push(correct);
}

//========== function checkAnswers ==========//
function checkanswer (){
  let inputs = document.querySelectorAll("input");
  rightAnswers = 0;
  for (let i = 0; i < inputs.length;i++){
      if (inputs[i].type === "radio" && inputs[i].checked){
          playerAnswer.push(inputs[i].value);
      }
      else {continue;}
  }
 for (let i = 0; i < playerAnswer.length;i++){
      if(playerAnswer[i] === allCorrectAnswer[i]){
          rightAnswers++;
      }
 }
 modalDialogFunction();
}
/*======================================== MODAL DIALOG ========================================*/
const modalDialog = document.querySelector(".mds-popup");

function modalDialogFunction (){
  modalDialog.classList.remove("mds-display-none");
  container.style.backgroundColor  = "#ADADAD";
  let dialogtext = document.querySelector(".mds-popup-supporting--text");
  dialogtext.innerHTML = "You answered "+ rightAnswers +"/10 questions correct";
  let closeButton = document.querySelector(".close");
  let reStartButton = document.querySelector(".re-start");
  closeButton.addEventListener("click",closeFunction);
  reStartButton.addEventListener("click",reStartFunction);
}

//========== function modalDialog-new game ==========//
function reStartFunction (){
  saveStats();
  rightAnswers = 0;
  clearAll();
  allCorrectAnswer = [];
  playerAnswer = [];
  getData()
  .then (res => renderData(res));
}

//========== function modalDialog-close ==========//
function closeFunction (){
  clearAll();
  menuIcon.dataset.click = "inactive";
  startButton.classList.remove("mds-display-none");

}

//========== function back to start ==========//

function clearAll (){
  while (quizBox.firstChild) {
      quizBox.removeChild(quizBox.firstChild);
  }
  modalDialog.classList.add ("mds-display-none");
  container.style.backgroundColor  = "#fff";
}
/*======================================== DRAWER MENU =========================================*/
const menuIcon = document.querySelector (".mds-header-icon ");
const menu = document.querySelector(".mds-menubar");
const menuItems = document.querySelectorAll(".mds-menubar-list-item");
let menuTitle = document.querySelector(".mds-header-text");

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
/*======================================== STATS SCREEN ========================================*/
const statsContainer = document.querySelector (".mds-stats");
let stats = {
  gamesplayed: "" ,
  right:"",
  incorrectanswer:"",
  correctpercentage:"",
}

function saveStats (){
  gamesPlayed = gamesPlayed + 1;
  allCorrect = allCorrect + rightAnswers;
  percentage = percentage + (allCorrect / (10 * gamesPlayed));
  wrongAnswers =  wrongAnswers + (10 - rightAnswers);

  stats = {
      gamesplayed: gamesPlayed,
      right: allCorrect,
      incorrectanswer: wrongAnswers,
      correctpercentage: percentage,
  };
  rightAnswers = 0;
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
/*======================================== ABOUT SCREEN ========================================*/
const aboutContainer = document.querySelector(".mds-about");

function aboutFunction (){
  menuTitle.innerHTML = "About";
  quizBox.classList.add("mds-display-none")
  menuIcon.dataset.click = "active"
  startButton.classList.add("mds-display-none");
  container.style.backgroundColor= "#fff";
  menu.style.width ="0px";
  aboutContainer.classList.remove("mds-display-none")
}
