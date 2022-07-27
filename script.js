const uid = new ShortUniqueId();
// Returns the first element that matches selectors.
const addBtn = document.querySelector(".add-btn");
const modalCont = document.querySelector(".modal-cont");
const textArea = document.querySelector(".textarea-cont");
const colors = ["lightpink", "lightgreen", "lightblue", "black"];
let modalPriorityColor = colors[colors.length - 1]; // -> black
const mainCont = document.querySelector(".main-cont");
const allPriorityColors = document.querySelectorAll(".priority-color");
console.log(allPriorityColors);
// console.log(modalCont);
// console.log(addBtn);

var isModalPresent = false;

addBtn.addEventListener("click", function (e) {
    // console.log(e);
    // case 1 -> if screen is empty / modal is not present
    if (!isModalPresent) {
        // then display modal
        modalCont.style.display = "flex";
    }

    // case 2 -> if modal is present
    else {
        // then hide modal
        modalCont.style.display = "none";
    }

    isModalPresent = !isModalPresent;
});

// creating ticket on shift press from keyboard
modalCont.addEventListener("keydown", (e) => {
    // console.log(e);
    if (e.key == "Shift") {
        // 1) call createTicket();
        // console.log(textArea.value);
        createTicket(modalPriorityColor, textArea.value);
        // 2) alter display and update isModalPresent
        modalCont.style.display = "none";
        isModalPresent = false;
        textArea.value = "";
    }
});

function createTicket(ticketColor, data) {
    // generate uid
    const ticketUid = uid();

    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("class", "ticket-cont");
    ticketCont.innerHTML = `
        <div class="ticket-color ${ticketColor}"></div>
        <div class="ticket-id">#${ticketUid}</div>
        <div class="task-area">${data}</div>
        <div class="ticket-lock">
            <i class="fa-solid fa-lock"></i>
        </div>
    `;
    mainCont.appendChild(ticketCont);
}

// let prevSelectedColor;
allPriorityColors.forEach(colorElement => {
    colorElement.addEventListener("click", (e) => {
        allPriorityColors.forEach(el => {
            el.classList.remove("active");
        });
        // prevSelectedColor?.classList.remove("active");
        colorElement.classList.add("active");
        // prevSelectedColor = colorElement;
        modalPriorityColor = colorElement.classList[0];
    });
});