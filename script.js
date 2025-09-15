/**
 * Represents a Student.
 * @constructor
 * @param {string} name - The name of the student.
 * @param {string} id - The unique ID of the student.
 * @param {string} emailId - The email address of the student.
 * @param {string} phoneNumber - The contact phone number of the student.
 */
function Student(name, id, emailId, phoneNumber) {
  this.name = name;
  this.id = id;
  this.emailId = emailId;
  this.phoneNumber = phoneNumber;
}

const tableHeader = document.getElementById("table-header");
const studentTable = document.getElementById("Students-table");
const tableRows = document.getElementsByClassName("table-row");
const actionHeader = document.getElementById("actions-header");
const tableContainer = document.getElementById("tableContainer");
const phoneNumberWarning = document.querySelector(".ph-warning");

const defaultDisplay = document.createElement("tr");
defaultDisplay.classList.add("no-students");

defaultDisplay.innerHTML = `
    <td colspan="4">No student records found.</td>
`;

let Students = [];
if (Students.length == 0) studentTable.appendChild(defaultDisplay);

const form = document.getElementById("myForm");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  let name = document.getElementById("name").value;
  let id = document.getElementById("stid").value;
  let emailId = document.getElementById("emailId").value;
  let phoneNumber = document.getElementById("phoneNumber").value;
  phoneNumberWarning.style.visibility = "hidden";
  if (!isValidContact(phoneNumber)) {
    phoneNumberWarning.style.visibility = "visible";
    return;
  }
  const exists = Students.some((student) => student.id === id);
  const warning = document.querySelector(".warning-msg");
  warning.style.visibility = "hidden";
  if (exists) {
    warning.style.visibility = "visible";
    return;
  }

  let student = new Student(name, id, emailId, phoneNumber);
  Students.push(student);
  form.reset();
  setTable(student);
});
/**
 * Appends a student row to the table or shows a default message if no students exist.
 * @param {Student} student - The student object to add to the table.
 */
function setTable(student) {
  let studentNum = Students.length;
  defaultDisplay.remove();
  let newRow = document.createElement("tr");
  newRow.classList.add("table-row");
  newRow.setAttribute("data-id", student.id);
  newRow.innerHTML = `
    <td><div class="row-content">${student.name}</div></td>
    <td><div class="row-content">${student.id}</div></td>
    <td><div class="row-content">${student.emailId}</div></td>
    <td><div class="row-content">${student.phoneNumber}</div></td>
    <td class="actions">
        <div class="row-content">
            <button class="edit-btn"><img src="assets/edit.png" alt="Edit" width="20" height="20"></button>
            <button class="del-btn"><img src="assets/bin.png" alt="Delete" width="20" height="20"></button>
        </div>
    </td>
`;
  const actionsCell = newRow.querySelector(".actions");
  actionsCell.classList.add("show");
  actionHeader.innerHTML = "Edit/Delete";
  actionHeader.classList.add("show");

  const editBtn = newRow.querySelector(".edit-btn");
  const delBtn = newRow.querySelector(".del-btn");
  saveToLocalStorage();
  editBtn.addEventListener("click", () => {
    openEditModal(student);
  });

  delBtn.addEventListener("click", () => {
    deleteRecord(student);
  });

  studentTable.appendChild(newRow);
  toggleVerticalScrollbar();
}

const modal = document.getElementById("editModal");
const closeBtn = modal.querySelector(".close");
const editForm = document.getElementById("editForm");
let editingStudent = null;
/**
 * Opens the edit modal of a student for edit
 * @param {Student} student -The student object to edit
 */
function openEditModal(student) {
  editingStudent = student;
  document.getElementById("editName").value = student.name;
  document.getElementById("editEmail").value = student.emailId;
  document.getElementById("editPhone").value = student.phoneNumber;
  document.getElementById("stidEdit").value = student.id;
  modal.style.display = "flex";
}
/**
 * Deletes the student record which the user clicks on for deletion from the Student array and the table.
 * @param {Student} student-The student object to delete
 */
function deleteRecord(student) {
  const row = studentTable.querySelector(`.table-row[data-id="${student.id}"]`);
  if (row) row.remove();

  Students = Students.filter((s) => s.id !== student.id);

  if (studentTable.querySelectorAll(".table-row").length === 0) {
    studentTable.appendChild(defaultDisplay);
    actionHeader.classList.remove("show");
  }
  saveToLocalStorage();
  toggleVerticalScrollbar();
}

closeBtn.onclick = () => (modal.style.display = "none");

window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const row = studentTable.querySelector(
    `.table-row[data-id="${editingStudent.id}"]`
  );

  editingStudent.name = editForm.editName.value;
  editingStudent.emailId = editForm.editEmail.value;
  editingStudent.phoneNumber = editForm.editPhone.value;

  if (row) {
    row.children[0].querySelector(".row-content").innerText =
      editingStudent.name;
    row.children[2].querySelector(".row-content").innerText =
      editingStudent.emailId;
    row.children[3].querySelector(".row-content").innerText =
      editingStudent.phoneNumber;
  }
  saveToLocalStorage();
  modal.style.display = "none";
});

/**
 * Saves the student array to the local storage.
 */
function saveToLocalStorage() {
  localStorage.setItem("students", JSON.stringify(Students));
}

window.addEventListener("DOMContentLoaded", () => {
  const storedStudents = JSON.parse(localStorage.getItem("students")) || [];
  Students = storedStudents;

  Students.forEach((student) => setTable(student));
});

/**
 * Dynamically adds or removes a scrollbar if the number of students added increases or decreases.
 */
function toggleVerticalScrollbar() {
  tableContainer.style.overflowY =
    tableContainer.scrollHeight > tableContainer.clientHeight
      ? "scroll"
      : "hidden";
}

/**
 * Checks if the phone number entered is valid(10 digits).
 * @param {phoneNumber} number The phone number to validate.
 * @returns  {boolean} True if valid, false otherwise.
 */
function isValidContact(number) {
  const regex = /^\d{10}$/;
  return regex.test(number);
}
