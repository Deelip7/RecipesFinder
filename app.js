const btn = document.getElementById("submitBtn");
const search = document.getElementById("searchField");
const display = document.getElementById("displayDiv");

const getRecipe = async (searchRecipe) => {
  let mealArray = [];
  const alertMsg = `<h1 class="display-5 text-white p-2">Search Not Found</h1>`;
  try {
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchRecipe}`);
    let data = await res.json();
    mealArray = Object.values(data.meals);

    let findMatch = mealArray.filter((el) => {
      return el;
    });

    display.innerHTML = "";
    findMatch.forEach((element) => {
      display.innerHTML += `<button id="${element.idMeal}"type="submit" class="display-5 p-3 m-2 bg-white rounded-pill h4">${element.strMeal}</button>`;
    });
  } catch (err) {
    // catches errors both in fetch and response.json
    display.innerHTML = alertMsg;
    console.log(err);
  }

  searchRecipe.length === 0 ? (display.innerHTML = "") : showMeal(mealArray);
};

search.addEventListener("input", () => getRecipe(search.value));

//   <img src="${data.meals[0].strMealThumb}" class="img-fluid" alt="Responsive image" width="200px">

function showMeal(mealList) {
  let buttonList = document.querySelectorAll("button");
  buttonList.forEach((btnElement) => {
    btnElement.addEventListener("click", (el) => {
      mealList.forEach((meal) => {
        if (meal.idMeal === el.target.id) {
          console.log(meal.strMealThumb);
        }
      });
    });
  });
}
