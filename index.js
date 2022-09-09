"use strict";

let mealList = {};
function createEl(tag, className, content) {
  let el = document.createElement(tag);
  if (className) {
    let classArray = className.split(" ");
    for (let cl of classArray) {
      el.classList.add(cl);
    }
  }
  content ? (el.innerText = content) : null;
  return el;
}

let label = createEl("label", null, "Enter the word");
let input = createEl("input");
let root = document.querySelector("#root");
label.append(input);
const mealContainer = createEl("div", "meal__container");
root.append(label, mealContainer);
input.focus();
createModal();

function createModal() {
  let modalContainer = createEl("div", "modal__container");
  root.append(modalContainer);
  let modalImg = createEl("img", "modal__img");
  modalContainer.append(modalImg);
}

input.addEventListener("input", () => {
  if (input.value.length === 1) {
    getList();
  }else if(input.value.length === 0) {
    mealContainer.innerHTML = '';
  }
});

async function getList() {
  let api = `https://www.themealdb.com/api/json/v1/1/search.php?f=${input.value}`;
  try {
    let response = await fetch(api);
    let data = await response.json();
    mealList = data.meals;
    console.log(mealList);
    renderList();
  } catch (error) {
    console.error(error);
    console.error(error.message);
    console.log(response.status, response.statusText);
  }
}

function renderList() {
  mealContainer.innerHTML = "";
  mealList.forEach((meal) => {
    mealContainer.append(createMealStructure(meal));
  });
}

function createMealStructure(meal) {
  const mealBlock = createEl("div", "meal__block");
  mealBlock.setAttribute("id", `${meal.idMeal}`);
  const mealImg = createEl("img", "meal__img");
  mealImg.src = meal.strMealThumb;
  const mealDesc = createEl("h2", "meal__desc");
  const mealTitle = createEl("h2", "meal__title", `${meal.strMeal}`);
  const mealCategory = createEl("p", "meal__category", `${meal.strCategory}`);
  mealDesc.append(mealTitle, mealCategory);
  mealBlock.append(mealImg, mealDesc);
  return mealBlock;
}

mealContainer.addEventListener("click", ({ target }) => {
  if (target.classList.contains("meal__img")) {
    let modalImg = document.querySelector(".modal__img");
    let modalContainer = document.querySelector(".modal__container");
    modalImg.src = target.src;
    modalContainer.style.display = "flex";
  }
});

let modalContainer = document.querySelector(".modal__container");
modalContainer.addEventListener("click", ({ target }) => {
  if(!target.classList.contains('modal__img')){
    modalContainer.style.display = 'none';
  }
});
