//========== variables ==========//

//========== function getData ==========//

const baseURL = 'https://opentdb.com/api.php?amount=10&category=20&difficulty=easy&type=multiple';

axios.get(baseURL)
  .then(function (response) {
    console.log(response.status + " " + response.statusText); // <-- "200 OK"
    //console.log(response.data.results);// <-- get the whole object.
    console.log(response.data.results[0].question); //<-- get the first indexed question
    console.log(response.data.results[0].correct_answer); //<-- get the first indexed correct answer
    console.log(response.data.results[0].incorrect_answers); //<-- get the first indexed incorrect answer
    console.log(response.data.results[0].incorrect_answers[2]); //<--  the indexed incorrect answer
  })
  .catch(function (error) {
    console.log(error);
    console.log(error.response.status);
  });
  

//========== function createData ==========//

//========== function renderData ==========//
const renderQuestions = () => {
    
let question = document.createElement('h3');
let right = document.createElement('input');
let wrong1 = document.createElement('input');
let wrong2 = document.createElement('input');
let wrong3 = document.createElement('input');
right.setAttribute('type', 'radio');
wrong1.setAttribute('type', 'radio');
wrong2.setAttribute('type', 'radio');
wrong3.setAttribute('type', 'radio');
}

//========== function startQuiz ==========//

//========== function menu ==========//

//========== function stats ==========//

//========== function about ==========//

//========== function doneWithQuiz==========// <-- when you click the done-button

//========== function popUp ==========// <-- correct answers

//========== function popUp-restart ==========//

//========== function popUp-close ==========//