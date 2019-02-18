//========== variables ==========//

//========== function getData ==========//

const baseURL = 'https://opentdb.com/api.php?amount=10&category=20&difficulty=easy&type=multiple';

axios.get(baseURL)
  .then(function (response) {
    console.log(response.status + " " + response.statusText); // <-- "200 OK"
    //console.log(response.data.results);// <-- get the whole object.
    //console.log(response.data.results[0].question); <-- get the first indexed question
    //console.log(response.data.results[0].correct_answer); <-- get the first indexed correct answer
    //console.log(response.data.results[0].incorrect_answers); <-- get the first indexed incorrect answer
  })
  .catch(function (error) {
    console.log(error);
    console.log(error.response.status);
  });
  

//========== function createData ==========//

//========== function renderData ==========//
const renderQuestions = () => {
    

    // questions         = response.data.results[0].question
    // correct_answer    = response.data.results[0].correct_answer
    // incorrect_answers = response.data.results[0].incorrect_answers
}
renderQuestions();


//========== function startQuiz ==========//

//========== function menu ==========//

//========== function stats ==========//

//========== function about ==========//

//========== function doneWithQuiz==========// <-- when you click the done-button

//========== function popUp ==========// <-- correct answers

//========== function popUp-restart ==========//

//========== function popUp-close ==========//