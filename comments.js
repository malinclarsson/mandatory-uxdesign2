/*======================================== VARIABLES ========================================*/
let count = 1; //number of questions rendered - in total
let allCorrect = 0;  //number of correct answers in currrent game
let playerAnswer = []; //array for answers
let allCorrectAnswer = []; // //array for all the correct answers
//===== stats =====//
let gamesPlayed = 0; //number of games played
let rightAnswers = 0; //number of right answers in currrent game
let wrongAnswers = 0; //number of wrong answers in currrent game
let percentage = 0; //persentage of right answers



/*======================================== MAIN SCREEN =========================================*/
//========== function startQuiz ==========//                                                                        --> 1. start the quiz
const container = document.querySelector (".mds-container"); //header + game board
const startButton = document.querySelector(".mds-body-button"); //start button for game

startButton.addEventListener ("click", () =>{ //when the start button is clicked
  startButton.classList.add ("mds-display-none"); //give it another class - which hides it.
  quizBox.dataset.type = "active"; // <---------------------------

  getData() //calling function getData
  .then (response => renderData(response));//wait for getData to return, then call the function renderData
});




/*======================================== QUIZ SCREEN =========================================*/
//========== function getData ==========//                                                                          --> 2. get data from api
function getData (){ //function getData
  return fetch("https://opentdb.com/api.php?amount=10&category=32&difficulty=easy&type=multiple") //request data from this url
 .then  (response => response.json()) //parse
 .then (response => {return response;}) //return object
 .catch (error => console.error ("Error", error)); // if there is an error - log the "Error"-message, instead of crashing
}

//========== function randomize ==========//                                                                    --> 3. randomize questions                                  
function randomizer(correct,wrong){                                                                                 
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

//========== function renderData ==========//                                                                     --> 4. render data to game board
const quizBox = document.querySelector(".mds-body"); //point to the game board in the DOM

function renderData (data){ //function renderData - use data as an argument
  let answer = []; //empty aray for answers
  let quizTitle = document.createElement("h3"); //creates a new title for how many quizzez have been played
  quizTitle.innerHTML = "Quiz "+(gamesPlayed+1); //sets text to "quiz"+number of games played
  quizBox.appendChild (quizTitle); //set title inside game board
  let array = data.results; //
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
  quizBox.appendChild(doneButton);
  doneButton.addEventListener("click",done);
}

//========== function renderOptions ==========//                                                              --> 5. render options to radiobuttons
function renderOptions (answer){
  let options = document.createElement("ul");
  quizBox.appendChild(options);
  for(let i = 0; i < answer.length;i++){
      let list = document.createElement("li");
      let input = document.createElement ("input");
      let radioBorder = document.createElement("span");
      let radioToggle = document.createElement("span");
      let option = document.createElement("p");
      setAttributes(input,{
          type: "radio",
          name: "radio"+count,
          value: answer[i],
      });
      radioButtons();
  }
}

//========== function radioButtons ==========//                                                             --> 6. render options to radiobuttons
function radioButtons() {                                                                             
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

//========== function getAttributes ==========//
function giveAttributes(element,obj){
  for (let prop in obj){
      if(obj.hasOwnProperty(prop)){
          element[prop] = obj[prop];
      }
  }
}

//========== function checkAnswers ==========//                                                             --> 7. check all the answers 
function checkAnswer (){
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
 modalDialogFunction(); // call the popup-function
}

//========== function saveRightAnswer ==========//                                                         --> 8. save the correct answers
function saveRightAnswer(correct){
  allCorrectAnswer.push(correct); //push all the right ansers to the array
}

//========== function done ==========//                                                                   --> 9. done with quiz
function done() {
  doneButton.className ="mds-body-doneButton";
  doneButton.innerHTML = "Done";

  checkAnswer()
}



/*======================================== MODAL DIALOG ========================================*/
const modalDialog = document.querySelector(".mds-popup");

//========== function modalDialog ==========//                                                          --> 10. popup - "x /10 answes rigt!"   NEW GAME/CLOSE
function modalDialogFunction (){
  let dialogtext = document.querySelector(".mds-popup-supporting--text");
  dialogtext.innerHTML = "You got "+ rightAnswers +"/10 questions right";

  modalDialog.classList.remove("mds-display-none");
  container.style.backgroundColor  = "#ADADAD";

  let reStartButton = document.querySelector(".re-start");
  let closeButton = document.querySelector(".close");
  
  reStartButton.addEventListener("click",reStartFunction);
  closeButton.addEventListener("click",closeFunction);
}

//========== function modalDialog-new game ==========//                                                --> 10.1 popup - NEW GAME
function reStartFunction (){
  saveStats();
  rightAnswers = 0;
  clearAll();
  allCorrectAnswer = [];
  playerAnswer = [];
  getData()
  .then (res => renderData(res));
}

//========== function modalDialog-close ==========//                                                --> 10.2 popup - CLOSE
function closeFunction (){
  clearAll();
  
  menuIcon.dataset.click = "inactive";
  startButton.classList.remove("mds-display-none");

}

//========== function clearAll (back to start) ==========//                                         --> 11. clear board
function clearAll (){
  while (quizBox.firstChild) {
      quizBox.removeChild(quizBox.firstChild);
  }
  modalDialog.classList.add ("mds-display-none");
  container.style.backgroundColor  = "#fff";
}



/*======================================== DRAWER MENU =========================================*/
const menuIcon = document.querySelector (".mds-header-icon ");
const menu = document.querySelector(".mds-menusel");
const menuItems = document.querySelectorAll(".mds-menusel-list-item");
let menuTitle = document.querySelector(".mds-header-text");

menuIcon.addEventListener("click", hamburger);

//========== function hamburger - click on menu-button==========//                                  --> 12. meu button
function hamburger(){
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
            about();
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

//========== function select ==========//                                                           --> 13. select an option: GAME/STATS/ABOUT
function select () {
  for (let sel of menuItems){
    sel.addEventListener("click",function(e){
        if (e.target.innerHTML === "Back to the Game"){                                           //--> 14.1. Back to game 
            statsContainer.classList.add("mds-display-none");
            aboutContainer.classList.add("mds-display-none")
            menuTitle.innerHTML = "Sir Quiz-A-Lot";
            hamburger();
        }
        else if (e.target.innerHTML ==="Stats"){
            statsFunction();
        }
        else if (e.target.innerHTML === "About"){
            about();
        }
    })
}
}


/*======================================== STATS SCREEN ========================================*/ //--> 14.2. Stats 
const statsContainer = document.querySelector (".mds-stats");
let stats = {
  gamesplayed: "" ,
  right:"",
  incorrectanswer:"",
  correctpercentage:"",
}
//========== function saveStats ==========// 
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

//========== function statsFunction ==========// 
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

//========== function renderStats ==========// 
function renderStats (){
  document.querySelector(".played").innerHTML = (stats.gamesplayed); //set the value of 
  document.querySelector(".correct").innerHTML = (stats.right);
  document.querySelector(".incorrect").innerHTML = (stats.incorrectanswer);
  document.querySelector(".percentage").innerHTML = (stats.correctpercentage)*100 +"%";
}



/*======================================== ABOUT SCREEN ========================================*/  //--> 14.3. About
const aboutContainer = document.querySelector(".mds-about");

//========== function about ==========// 
function about (){
  menuTitle.innerHTML = "About";
  quizBox.classList.add("mds-display-none")
  menuIcon.dataset.click = "active"
  startButton.classList.add("mds-display-none");
  container.style.backgroundColor= "#fff";
  menu.style.width ="0px";
  aboutContainer.classList.remove("mds-display-none")
}
