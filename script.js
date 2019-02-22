/*======================================== VARIABLES ========================================*/
let count = 1;
let allCorrect = 0;
let answer = [];
let allCorrectAnswer = [];
//===== stats =====//
let gamesPlayed = 0;
let rightAnswers = 0;
let wrongAnswers = 0;
let percentage = 0;

/*======================================== MAIN SCREEN =========================================*/
//========== function startQuiz ==========//                                                                        --> 1. start the quiz
const container = document.querySelector (".mds-container");
const startButton = document.querySelector(".mds-body-button");

startButton.addEventListener ("click", () =>{         
  console.log("start button");

  startButton.classList.add ("mds-display-none");
  quizBox.dataset.type = "active";

  getData()
  .then (response => renderData(response));
});


/*======================================== QUIZ SCREEN =========================================*/
//========== function getData ==========//                                                                          --> 2. get data from api
function getData (){         
  console.log("function getData");

  return fetch("https://opentdb.com/api.php?amount=10&category=32&difficulty=easy&type=multiple")
 .then  (response => response.json())
 .then (response => {return response;})
 .catch (error => console.error ("Error", error));
}

//========== function renderData ==========//                                                                   --> 3. render data to game board
const quizBox = document.querySelector(".mds-body");

function renderData (data){         
  console.log("function renderData");

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
  doneButton.addEventListener("click",checkAnswer);                                                           //--> 9. done with quiz
}

//========== function randomize ==========//                                                                    --> 4. randomize questions
function randomizer(correct,wrong){
  console.log("function randomizer");

  saveRightAnswer (correct);

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

//========== function renderOptions ==========//                                                              --> 5. render options
function renderOptions (answer){
  console.log("function renderOptions");

  let options = document.createElement("ul");
  quizBox.appendChild(options);

  for(let i = 0; i < answer.length;i++){
      let list = document.createElement("li");
      let input = document.createElement ("input");
      let radioBorder = document.createElement("span");
      let radioToggle = document.createElement("span");
      let option = document.createElement("p");

      setAttribute(input,{
          type: "radio",
          name: "radio"+count,
          value: answer[i],
      });
      //========== radiobuttons ==========//                                                              --> 6. render radiobuttons
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
                                                         
function setAttribute(element,obj){
  console.log("function setAttribute");

  for (let prop in obj){
      if(obj.hasOwnProperty(prop)){ 
          element[prop] = obj[prop];
      }
  }
}

//========== function checkAnswers ==========//                                                             --> 7. check all the answers 
function checkAnswer (){
  console.log("function checkAnswer");

  let inputs = document.querySelectorAll("input");

  rightAnswers = 0;
  for (let i = 0; i < inputs.length;i++){
      if (inputs[i].type === "radio" && inputs[i].checked){
          answer.push(inputs[i].value);
      }
      else {continue;}
  }
 for (let i = 0; i < answer.length;i++){
      if(answer[i] === allCorrectAnswer[i]){
          rightAnswers++;
      }
 }
 modalDialogFunction();
}

//========== function saveRightAnswers ==========//                                                         --> 8. save the correct answers
function saveRightAnswer(correct){
  console.log("function saveRightAnswer");

  allCorrectAnswer.push(correct);
}


/*======================================== MODAL DIALOG ========================================*/
const modalDialog = document.querySelector(".mds-popup");

//========== function modalDialog ==========//                                                           --> 10.1 popup - "x /10 answes rigt!"   NEW GAME/CLOSE
function modalDialogFunction (){
  console.log("function modalDialogFunction");

  let dialogtext = document.querySelector(".mds-popup-supporting--text");
  dialogtext.innerHTML = "You got "+ rightAnswers +"/10 questions right";

  modalDialog.classList.remove("mds-display-none");
  container.style.backgroundColor  = "#ADADAD";

  let reStartButton = document.querySelector(".re-start");
  let closeButton = document.querySelector(".close");
  
  reStartButton.addEventListener("click",reStartFunction);
  closeButton.addEventListener("click",closeFunction);
}

//========== function modalDialog - new game ==========//                                                --> 10.2 popup - NEW GAME
function reStartFunction (){
  console.log("function reStartFunction");

  saveStats();
  rightAnswers = 0;
  clearAll();
  allCorrectAnswer = [];
  answer = [];

  getData()
  .then (res => renderData(res));
}

//========== function modalDialog - close ==========//                                                 --> 10.3 popup - CLOSE
function closeFunction (){
  console.log("function closeFunction");

  clearAll();

  menuIcon.dataset.click = "inactive";
  startButton.classList.remove("mds-display-none");

}

//========== function back to start ==========//                                                      --> 11. clear board
function clearAll (){
  console.log("function clearAll");

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

menuIcon.addEventListener("click", hamburger);

//========== function hamburger - click on menu-button==========//                                  --> 12. meu button
function hamburger(){
  console.log("function hamburger - menu icon");

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

//========== select ==========//                                                           --> 13. select an option: GAME/STATS/ABOUT
for (let bar of menuItems){
    bar.addEventListener("click",function(e){
      console.log("menu - pick a list item");

        if (e.target.innerHTML === "Back to the Game"){ //                                 --> 14.1. Back to game 
            statsContainer.classList.add("mds-display-none");
            aboutContainer.classList.add("mds-display-none")
            menuTitle.innerHTML = "Sir Quiz-A-Lot";
            hamburger();
        }
        else if (e.target.innerHTML ==="Stats"){
            statsFunction();
        }
        else if (e.target.innerHTML === "About"){
            aboutFunction();
        }
    })
} 

/*======================================== STATS SCREEN ========================================*/ //--> 14.2. Stats 
const statsContainer = document.querySelector (".mds-stats");
let stats = { //oject with all stats-info
  gamesplayed: "" ,
  right:"",
  incorrectanswer:"",
  correctpercentage:"",
}

//========== function saveStats ==========// 
function saveStats (){
  console.log("function saveStats");

  gamesPlayed = gamesPlayed + 1;
  allCorrect = allCorrect + rightAnswers;
  percentage = percentage + (allCorrect / (10 * gamesPlayed));
  wrongAnswers =  wrongAnswers + (10 - rightAnswers);

  stats = { //oject with all stats-info
      gamesplayed: gamesPlayed,
      right: allCorrect,
      incorrectanswer: wrongAnswers,
      correctpercentage: percentage,
  };
  rightAnswers = 0;
}
//========== function statsFunction ==========// 
function statsFunction (){
  console.log("function statsFunction");

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
//========== function renderStats ==========// 
function renderStats (){
  console.log("function renderStats");

  document.querySelector(".played").innerHTML = (stats.gamesplayed);
  document.querySelector(".correct").innerHTML = (stats.right);
  document.querySelector(".incorrect").innerHTML = (stats.incorrectanswer);
  document.querySelector(".percentage").innerHTML = (stats.correctpercentage)*100 +"%";
}

/*======================================== ABOUT SCREEN ========================================*/  //--> 14.3. About
const aboutContainer = document.querySelector(".mds-about");

//========== function about ==========//
function aboutFunction (){
  console.log("function aboutFunction");

  quizBox.classList.add("mds-display-none")
  startButton.classList.add("mds-display-none");

  menuTitle.innerHTML = "About";
  menuIcon.dataset.click = "active"
  container.style.backgroundColor= "#fff";
  menu.style.width ="0px";

  aboutContainer.classList.remove("mds-display-none")
}