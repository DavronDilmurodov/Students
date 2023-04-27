let elTemplate = selectElement("#student-template").content;
let elFilterForm = selectElement(".filter");
let elTableBody = selectElement("#students-table-body");
let elSearch = selectElement("#search");
let elFrom = selectElement("#from");
let elTo = selectElement("#to");
let elSort = selectElement("#sortby");
let elFormAddModal = selectElement("#add-form");
let elCount = selectElement(".count");
let avgMark = selectElement(".avg__mark");

let sortFn = {
  az: (a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    if (a.name < b.name) {
      return -1;
    }
    return 0;
  },

  za: (a, b) => {
    if (a.name > b.name) {
      return -1;
    }
    if (a.name < b.name) {
      return 1;
    }
    return 0;
  },
  markToLow: (a, b) => b.mark - a.mark,
  markToHigh: (a, b) => a.mark - b.mark,
  date: (a, b) => b.markedDate.getTime() - a.markedDate.getTime(),
};

let onRender = (arr) => {
  elTableBody.innerHTML = null;
  let allMark = 0;
  arr.forEach((element) => {
    let student = elTemplate.cloneNode(true);

    let studentId = student.querySelector(".student-id");
    let studentName = student.querySelector(".student-name");
    let studentMarkedDate = student.querySelector(".student-marked-date");
    let studentMark = student.querySelector(".student-mark");
    let studentStatus = student.querySelector(".student-pass-status");

    allMark += element.mark;

    studentId.textContent = element.id;
    studentName.innerHTML = element.name + " " + element.lastName;
    studentMarkedDate.textContent = element.markedDate;
    studentMark.textContent = element.mark;
    elCount.textContent = `Count: ${students.length}`;

    if (element.mark >= 104) {
      studentStatus.textContent = "success";
      studentStatus.classList.add("bg-success");
    } else {
      studentStatus.textContent = "reject";
      studentStatus.classList.add("bg-danger");
    }

    elTableBody.append(student);
  });

  let avgPercentageOfMark = Math.round((allMark / students.length / 150) * 100);
  avgMark.textContent = `Average mark: ${avgPercentageOfMark}%`;
};

let onFilter = (event) => {
  event.preventDefault();

  let inputValue = elSearch.value.trim();

  let regexp = new RegExp(inputValue, "gi");

  let filteredStudents = [];

  students.forEach((student) => {
    if (!inputValue) {
      return filteredStudents.push(student);
    }
    if (`${student.name} ${student.lastName}`.match(regexp)) {
      let text = `${student.name} ${student.lastName}`.match(regexp)[0];
      filteredStudents.push({
        ...student,
        name: `${student.name} ${student.lastName}`.replaceAll(
          text,
          `<mark class="bg-success text-white rounded-2";>${text}</mark>`
        ),
        lastName: "",
      });
    }
  });

  if (elFrom.value && elTo) {
    filteredStudents = filteredStudents.filter(
      (student) =>
        student.mark >= Number(elFrom.value) &&
        student.mark <= Number(elTo.value)
    );
  }

  if (elSort.value) {
    filteredStudents.sort(sortFn[elSort.value]);
  }

  onRender(filteredStudents);
};

let onAddingModal = (event) => {
  event.preventDefault();

  let elInputName = selectElement("#name");
  let elInputLastName = selectElement("#lastname");
  let elInputMark = selectElement("#mark");

  let name = elInputName.value.trim();
  let lastName = elInputLastName.value.trim();
  let mark = elInputMark.value.trim();

  let newStudent = {
    id: students.length + 100,
    name,
    lastName,
    mark,
    markedDate: getDate(),
  };

  students.push(newStudent);

  onRender(students);
};

onRender(students);
elFilterForm.addEventListener("submit", onFilter);
elFormAddModal.addEventListener("submit", onAddingModal);

let days = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
};

let months = {
  0: "Jan",
  1: "Feb",
  2: "Mar",
  3: "Apr",
  4: "May",
  5: "Jun",
  6: "Jul",
  7: "Aug",
  8: "Sep",
  9: "Oct",
  10: "Nov",
  11: "Dec",
};

let getDate = () => {
  let date = new Date();

  let month = date.getMonth();
  let day = date.getDay();
  let year = date.getFullYear();
  let dates = date.getDate();

  return `${days[day]} ${months[month]} ${dates} ${year} 05:00:00 GMT+0500 (Узбекистан, стандартное время)`;
};
