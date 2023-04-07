const toastEl = document.getElementById('toast');

function showToast(title, message) {
    const titleEl = toastEl.querySelector('.toast-header strong');
    const messageEl = toastEl.querySelector('.toast-body');

    titleEl.textContent = title;
    messageEl.textContent = message;

    toastEl.classList.add('show');

    setTimeout(() => {
        toastEl.classList.remove('show');
    }, 3000);
}

const closeButton = toastEl.querySelector('.close');

closeButton.addEventListener('click', () => {
    toastEl.classList.remove('show');
});