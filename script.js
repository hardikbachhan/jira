const uid = new ShortUniqueId();
// Returns the first element that matches selectors.
const addBtn = document.querySelector(".add-btn");
const modalCont = document.querySelector(".modal-cont");
const textArea = document.querySelector(".textarea-cont");
const colors = ["lightpink", "lightgreen", "lightblue", "black"];
let modalPriorityColor = colors[colors.length - 1]; // -> black
const mainCont = document.querySelector(".main-cont");
const allPriorityColors = document.querySelectorAll(".priority-color");
// console.log(allPriorityColors);
// console.log(modalCont);
// console.log(addBtn);
const toolBoxColors = document.querySelectorAll(".toolbox-color-cont>*");
// console.log(toolBoxColors);
let ticketsArr = [];
const removeBtn = document.querySelector(".fa-xmark");
// console.log(removeBtn);


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

function createTicket(ticketColor, data, ticketId) {
    // generate uid
    const ticketUid = ticketId || uid();

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

    // if ticket is being generated for the first time save it in local storage.
    if (!ticketId) {
        ticketsArr.push({
            ticketId: ticketUid,
            ticketColor,
            ticketTask: data,
        });
        localStorage.setItem("tickets", JSON.stringify(ticketsArr));
    }

    handleRemoval(ticketCont, ticketId);
}

//getting data from localstorage, for re-rendering of tickets
if (localStorage.getItem("tickets")) {
    ticketsArr = JSON.parse(localStorage.getItem("tickets"));
    ticketsArr.forEach(ticketObj => createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketId));
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

// getting tickets on the basis of ticketcolor
for (let i = 0; i < toolBoxColors.length; i++) {
    toolBoxColors[i].addEventListener("click", () => {
        let currColor = toolBoxColors[i].classList[0];
        let filteredTickets = ticketsArr.filter(ticketObj => ticketObj.ticketColor == currColor);
        console.log(filteredTickets);

        // remove all tickets
        let allTickets = document.querySelectorAll(".ticket-cont");
        allTickets.forEach(ticket => ticket.remove());

        // display filtered tickets
        filteredTickets.forEach(ticket => createTicket(ticket.ticketColor, ticket.ticketTask, ticket.ticketId));
    });
    
    // display all the tickets of all priorities on double clicking any priority color
    toolBoxColors[i].addEventListener("dblclick", () => {
        // remove tickets of specific color from UI
        let allTickets = document.querySelectorAll(".ticket-cont");
        allTickets.forEach((ticket) => ticket.remove());

        // display all tickets
        ticketsArr.forEach(ticket => createTicket(ticket.ticketColor, ticket.ticketTask, ticket.ticketId));
    });
}

var isRemoveBtnActive = false;
removeBtn.addEventListener("click", function () {
//   console.log("in btn");
  //    case 1 -> if removeBtn is not active
  //              then make it active i.e. red color
  if (!isRemoveBtnActive) {
    // change color to red
    removeBtn.style.color = "red";
  }

  // case 2 -> if removeBtn is active
  //           then make it inactive i.e. white color
  else if (isRemoveBtnActive) {
    // change color to white
    removeBtn.style.color = "white";
  }

  isRemoveBtnActive = !isRemoveBtnActive;
});

function handleRemoval(ticketCont, id) {
    ticketCont.addEventListener("click", () => {
        if (!isRemoveBtnActive) return;

        // remove from ticketsArr
        let idx = getTicketIdx(id);
        // console.log(idx);
        ticketsArr.splice(idx, 1);
        // console.log(ticketsArr);
        // set in local storage
        localStorage.setItem("tickets", JSON.stringify(ticketsArr));
        // remove from frontend
        ticketCont.remove();
    });
}

// function getTicketIdx(id) {
//     return ticketsArr.forEach(ticketObj => {
//         if (ticketObj.ticketId == id) {
//             let idx = ticketsArr.indexOf(ticketObj);
//             retur idx;
//         }
//     })
// }

function getTicketIdx(id) {
    let idx = ticketsArr.findIndex(ticketObj => {
        return ticketObj.ticketId == id;
    })
    return idx;
}