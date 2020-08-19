const btn = document.getElementById("submitBtn");
const search = document.getElementById("searchField");
const display = document.getElementById("displayDiv");

const getRecipe = async (searchRecipe) => {
  try {
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchRecipe}`);
    let data = await res.json();
    display.innerHTML = `
    <div>
    <h1 class="display-5 text-white">${data.meals[0].strMeal}</h1>
    <h4 class="text-white pt-1">${data.meals[0].strArea}  |  ${data.meals[0].strCategory} </h4>
    </div>`;
  } catch (err) {
    // catches errors both in fetch and response.json
    display.innerHTML = `<h1 class="display-5 text-white">Search Not Found</h1>`;
  }
};

//   <img src="${data.meals[0].strMealThumb}" class="img-fluid" alt="Responsive image" width="200px">
search.addEventListener("input", () => getRecipe(search.value));
