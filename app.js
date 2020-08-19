const btn = document.getElementById("submitBtn");
const search = document.getElementById("searchField");
const displayAutoComplete = document.getElementById("displaySuggestions");
const displayResult = document.getElementById("displayResult");

const getRecipe = async (searchRecipe) => {
  let mealArray = [];
  const alertMsg = `<h1 class="display-5 text-white p-2 border border-danger">Search Not Found</h1>`;
  try {
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchRecipe}`);
    let data = await res.json();
    mealArray = Object.values(data.meals);

    let findMatch = mealArray.filter((el) => {
      return el;
    });

    displayAutoComplete.innerHTML = "";
    findMatch.forEach((element) => {
      displayAutoComplete.innerHTML += `<button id="${element.idMeal}"type="submit" class="display-5 p-3 m-2 bg-white rounded-pill h4">${element.strMeal}</button>`;
    });
  } catch (err) {
    // catches errors both in fetch and response.json
    displayAutoComplete.innerHTML = alertMsg;
    console.log(err);
  }
  if (searchRecipe.length === 0) {
    displayAutoComplete.innerHTML = "";
  } else {
    displayAutoComplete.classList.remove("hidden");
    showMeal(mealArray);
  }
};

search.addEventListener("input", () => getRecipe(search.value));

function showMeal(mealList) {
  document.querySelectorAll("button").forEach((btnElement) => {
    btnElement.addEventListener("click", (el) => {
      mealList.forEach((meal) => {
        meal.idMeal === el.target.id ? UI(meal) : null;
        displayAutoComplete.classList.add("hidden");
      });
    });
  });
}

function UI(mealUI) {
  let filteredIngredient = filtered_keys(mealUI, /strIngredient/);
  let filteredMeasure = filtered_keys(mealUI, /strMeasure/);

  console.log(filteredIngredient);
  console.log(filteredMeasure);
  search.value = "";
  displayResult.innerHTML = `<img src="${mealUI.strMealThumb}" class="img-fluid m-4 rounded-pill" alt="Responsive image" width="200px">
                             <h1 class="text-white mb-3"> ${mealUI.strMeal}</h1> 
                             <h4 class="text-white mb-5 mx-auto"> 
                                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-geo" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 4a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                <path d="M7.5 4h1v9a.5.5 0 0 1-1 0V4z"/>
                                <path fill-rule="evenodd" d="M6.489 12.095a.5.5 0 0 1-.383.594c-.565.123-1.003.292-1.286.472-.302.192-.32.321-.32.339 0 .013.005.085.146.21.14.124.372.26.701.382.655.246 1.593.408 2.653.408s1.998-.162 2.653-.408c.329-.123.56-.258.701-.382.14-.125.146-.197.146-.21 0-.018-.018-.147-.32-.339-.283-.18-.721-.35-1.286-.472a.5.5 0 1 1 .212-.977c.63.137 1.193.34 1.61.606.4.253.784.645.784 1.182 0 .402-.219.724-.483.958-.264.235-.618.423-1.013.57-.793.298-1.855.472-3.004.472s-2.21-.174-3.004-.471c-.395-.148-.749-.336-1.013-.571-.264-.234-.483-.556-.483-.958 0-.537.384-.929.783-1.182.418-.266.98-.47 1.611-.606a.5.5 0 0 1 .595.383z"/>
                                </svg>
                                ${mealUI.strArea}  |  
                                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-egg-fried" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M13.665 6.113a1 1 0 0 1-.667-.977L13 5a4 4 0 0 0-6.483-3.136 1 1 0 0 1-.8.2 4 4 0 0 0-3.693 6.61 1 1 0 0 1 .2 1 4 4 0 0 0 6.67 4.087 1 1 0 0 1 1.262-.152 2.5 2.5 0 0 0 3.715-2.905 1 1 0 0 1 .341-1.113 2.001 2.001 0 0 0-.547-3.478zM14 5c0 .057 0 .113-.003.17a3.001 3.001 0 0 1 .822 5.216 3.5 3.5 0 0 1-5.201 4.065 5 5 0 0 1-8.336-5.109A5 5 0 0 1 5.896 1.08 5 5 0 0 1 14 5z"/>
                                <circle cx="8" cy="8" r="3"/>
                                </svg>
                                ${mealUI.strCategory} 
                             </h4> 
                             <p class="h4 text-white mb-3 "> 
                              <span class="h3 text-white">Instructions: </span> 
                              ${mealUI.strInstructions.replace(/\./g, ".<br>")} 
                             </p>
                            
                            <table class="table  mx-auto w-100 text-center ">                            
                            <thead>
                            <tr class="text-center"> 
                               <th class="pb-1" scope="col">Ingredient</th>
                               <th class="pb-1" scope="col" >Amount</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr >
                              <td class="text-center px-0">${filteredIngredient}</td>
                              <td class="text-center px-0">${filteredMeasure}</td>
                            </tr>
                            </tbody> 
                            </table>`;
}

let filtered_keys = (obj, filter) => {
  let key,
    keys = [];
  for (key in obj)
    if (filter.test(key) && obj[key] !== "" && obj[key] !== " " && obj[key] !== null) {
      let x = `<div class="text-white h4">
                ${obj[key]}
                </div>`;
      keys.push(x);
    }
  return keys.join("");
};

// <span class="badge badge-primary badge-pill">14</span>
