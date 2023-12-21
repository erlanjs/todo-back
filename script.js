const table = document.querySelector(".table");
const USERS_API = "https://64340de21c5ed06c958dd2da.mockapi.io/users/";
const formInputs = document.querySelectorAll(".form input");
const addUserBtn = document.querySelector(".form button");

getUsers();

let data = {};

formInputs.forEach((input) => {
  input.addEventListener("keyup", (e) => {
    const { name, value } = e.target;
    data[name] = value;
  });
});

addUserBtn.addEventListener("click", (e) => {
  e.preventDefault();

  if (!!Object.keys(data).length) {
    fetch(USERS_API, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then(() => {
        clearInputs();
        getUsers();

        data = {};
      });
  }
});

function getUsers() {
  fetch(USERS_API)
    .then((data) => data.json())
    .then((data) => {
      table.innerHTML = `<tr>
      <th>ФИО</th>
      <th>Возраст</th>
      <th>Работа</th>
      <th>Опыт работы</th>
      <th>Удалить</th>

    </tr>`;

      displayTable(data);
    });
}

function displayTable(data) {
  data.map((user) => {
    const tr = document.createElement("tr");
    const tdName = document.createElement("td");
    const tdAge = document.createElement("td");
    const tdJob = document.createElement("td");
    const tdExperience = document.createElement("td");
    const tdDelete = document.createElement("td");
    const tdEditItem = document.createElement("td");

    tdName.textContent = user.name;
    tdAge.textContent = user.age;
    tdJob.textContent = user.job;
    tdExperience.textContent = user.experience;

    tdDelete.textContent = "Удалить";
    tdDelete.addEventListener("click", () => deleteUser(user.id));

    tdDelete.style.background = "red";
    tdDelete.style.color = "white";
    tdDelete.style.cursor = "pointer";

    tdEditItem.textContent = "Изменить";
    tdEditItem.style.background = "green";
    tdEditItem.style.color = "white";
    tdEditItem.style.cursor = "pointer";

    let isEdit = false;

    tdEditItem.addEventListener("click", () => {
      isEdit = !isEdit;

      if (isEdit) {
        tdEditItem.textContent = "Save";
        tdEditItem.style.background = "blue";

        const nameInput = document.createElement("input");
        nameInput.defaultValue = user.name;
        tdName.textContent = "";

        const jobInput = document.createElement("input");
        jobInput.defaultValue = user.job;
        tdJob.textContent = "";

        const ageInput = document.createElement("input");
        ageInput.defaultValue = user.age;
        tdAge.textContent = "";

        const experienceInput = document.createElement("input");
        experienceInput.defaultValue = user.experience;
        tdExperience.textContent = "";

        tdName.append(nameInput);
        tdAge.append(ageInput);
        tdJob.append(jobInput);
        tdExperience.append(experienceInput);

        tdEditItem.addEventListener("click", () => {
          const newUserData = {
            name: nameInput.value,
            age: ageInput.value,
            job: jobInput.value,
            experience: experienceInput.value,
          };

          editUser(user.id, newUserData);
        });
      }
    });

    tr.append(tdName);
    tr.append(tdAge);
    tr.append(tdJob);
    tr.append(tdExperience);
    tr.append(tdDelete);
    tr.append(tdEditItem);

    table.append(tr);
  });
}

function deleteUser(id) {
  fetch(USERS_API + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((data) => data.json())
    .then((data) => {
      getUsers();
    });
}

function clearInputs() {
  formInputs.forEach((input) => {
    input.value = "";
  });
}

function editUser(id, newData) {
  fetch(USERS_API + id, {
    method: "PUT",
    body: JSON.stringify(newData),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((data) => data.json())
    .then(() => {
      getUsers();
    });
}
