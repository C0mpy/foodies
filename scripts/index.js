var authenticationSuccess = function() {
  console.log('Successful authentication');
  
  currentDate = new Date();
  dayOfWeek = getDayOfWeek(currentDate);
  dayOfMonth = getDayOfMonth(currentDate);
  
  apiKey = "4a92c929bbc155d8a73e38ee08d59085";
  oauthToken = localStorage.getItem("trello_token");
  
  rucakNeparnaNedeljaListID = "5a01ebaf32a94019d96f7cea";
  rucakParnaNedeljaListID = "5a01ebb6a01ad0696d7b3a3a";
  
  var mealsForNextPrep = getMealsForNextPrep();
  console.log("This is what you should prep: ");
  console.log(mealsForNextPrep);
};

var authenticationFailure = function() {
  console.log('Failed authentication');
};

window.Trello.authorize({
  type: 'popup',
  name: 'Getting Started Application',
  scope: {
    read: 'true',
    write: 'true' },
  expiration: 'never',
  success: authenticationSuccess,
  error: authenticationFailure
});

function transform(day) {
  if(day == 0)
    day = 7;
  return day;
}

function getDayOfWeek() {
  var currentDay = currentDate.getDay();
	
  // Because new Date().getDay(); gives 0 for Sunday
  return transform(currentDay);
}

function getDayOfMonth() {
  return currentDate.getDate();
}

function isOddWeek(dayOfMonth) {
  var weeksPassedInMonth = Math.floor(dayOfMonth / 7);
  if(weeksPassedInMonth % 2 == 0)
    return false;
  else
    return true;
}

function isFirstHalfOfWeek(dayOfWeek) {
  if(dayOfWeek <= 4)
    return true;
  else
    return false;
}

function getCardsFromList(listId) {
  var result = null;
  $.ajax({ 
    url: "https://api.trello.com/1/list/" + listId + "/cards?key=" + apiKey + "&token=" + oauthToken, 
    async: false,
    dataType: "json",
    success: function(cards) {
      result = cards;
    }
  });
  return result;
}

function getMealsForNextPrep() {
  
  var ruckoviNeparnaNedelja = getCardsFromList(rucakNeparnaNedeljaListID);
  var ruckoviParnaNedelja = getCardsFromList(rucakParnaNedeljaListID);
  
  if(isOddWeek(dayOfMonth) && isFirstHalfOfWeek(dayOfWeek)) {
    return ruckoviNeparnaNedelja.slice(4, 7);
  }
  else if (isOddWeek(dayOfMonth) && !isFirstHalfOfWeek(dayOfWeek)) {
    return ruckoviParnaNedelja.slice(0, 4);
  }
  else if (!isOddWeek(dayOfMonth) && isFirstHalfOfWeek(dayOfWeek)) {
    return ruckoviParnaNedelja.slice(4, 7);
  }
  else if (!isOddWeek(dayOfMonth) && !isFirstHalfOfWeek(dayOfWeek)) {
    return ruckoviNeparnaNedelja.slice(0, 4);
  }
  
}

