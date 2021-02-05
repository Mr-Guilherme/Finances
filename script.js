const buttonNew = document.querySelector("a.button.new")
const buttonCancel = document.querySelector("a.button.cancel")
const form = document.querySelector(".modal-overlay")

const Modal = {
    open(){
        form.classList.add("active")
    },
    close(){
        form.classList.remove("active")
    }
}

buttonNew.addEventListener("click",Modal.open)

buttonCancel.addEventListener("click", Modal.close)

