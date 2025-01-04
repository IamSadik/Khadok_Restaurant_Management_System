// add hovered class to selected list item
let list = document.querySelectorAll(".navigation li");

function activeLink() {
  list.forEach((item) => {
    item.classList.remove("hovered");
  });
  this.classList.add("hovered");
}

list.forEach((item) => item.addEventListener("mouseover", activeLink));

// Menu Toggle
let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");

toggle.onclick = function () {
  navigation.classList.toggle("active");
  main.classList.toggle("active");
};

let countdownInterval;

function startCountdown(durationInMinutes) {
    const endTime = Date.now() + durationInMinutes * 60 * 1000;

    countdownInterval = setInterval(() => {
        const now = Date.now();
        const distance = endTime - now;

        if (distance < 0) {
            clearInterval(countdownInterval);
            document.getElementById("countdown-timer").textContent = "Time's Up!";
            return;
        }

        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        document.getElementById("countdown-timer").textContent = `${minutes}:${seconds}`;
    }, 1000);
}

document.querySelectorAll(".accept-btn").forEach(button => {
    button.addEventListener("click", () => {
        clearInterval(countdownInterval); // Reset any ongoing timer
        const orderId = button.getAttribute("data-order-id");
        startCountdown(5); // Start a 5-minute timer
    });
});

document.getElementById("stop-timer-btn").addEventListener("click", () => {
    clearInterval(countdownInterval);
    alert("Timer Stopped!");
});
