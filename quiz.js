let questions = []
let option1 = []
let option2 = []
let option3 = []
let option4 = []
let correct = []
let index = 0;

let marks = 0;


fetch("http://localhost:3000/getQue", {
    method: "GET",
    headers: {
        "Content-Type": "application/json"
    }
})
    .then((response) => response.json())
    .then((data) => {
        const question = data.questions;

        for (let i = 0; i < question.length; i++) {
            questions.push(question[i].Question);
            option1.push(question[i].option1);
            option2.push(question[i].option2);
            option3.push(question[i].option3);
            option4.push(question[i].option4);
            correct.push(question[i].correct);
        }

        console.log(questions);
        console.log(option1);
        console.log(option2);
        console.log(option3);
        console.log(option4);
        console.log(correct);

        document.getElementById("question").innerText = questions[index];
        document.getElementById("option-a-label").innerText = option1[index];
        document.getElementById("option-b-label").innerText = option2[index];
        document.getElementById("option-c-label").innerText = option3[index];
        document.getElementById("option-d-label").innerText = option4[index];
    })
    .catch((error) => {
        console.error("Error:", error);
    });


document.querySelector("form")
    .addEventListener("submit", async (event) => {
        event.preventDefault();
        if (document.getElementById("option-a").checked) {
            if (option1[index] === correct[index]) {
                alert("Correct Answer");
                marks++;
            } else {
                alert("Wrong Answer");
            }
            document.getElementById("option-a").checked = false;
        }
        else if (document.getElementById("option-b").checked) {
            if (option2[index] === correct[index]) {
                alert("Correct Answer");
                marks++;
            } else {
                alert("Wrong Answer");
            }
            document.getElementById("option-b").checked = false;
        }
        else if (document.getElementById("option-c").checked) {
            if (option3[index] === correct[index]) {
                alert("Correct Answer");
                marks++;
            } else {
                alert("Wrong Answer");
            }
            document.getElementById("option-c").checked = false;
        }
        else if (document.getElementById("option-d").checked) {
            if (option4[index] === correct[index]) {
                alert("Correct Answer");
                marks++;
            } else {
                alert("Wrong Answer");
            }
            document.getElementById("option-d").checked = false;
        }

        if (index == questions.length - 1) {
            const currentDate = new Date().toLocaleDateString();
            const currentTime = new Date().toLocaleTimeString();

            fetch("http://localhost:3000/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    currentDate: currentDate,
                    currentTime: currentTime,
                    marks: marks,
                }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert("Quiz Submitted");
                        window.location.href = "/";
                    } else {
                        alert("Error in submitting quiz");
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                });
        }
        else if (index < questions.length - 1) {
            index++;
            document.getElementById("question").innerText = questions[index];
            document.getElementById("option-a-label").innerText = option1[index];
            document.getElementById("option-b-label").innerText = option2[index];
            document.getElementById("option-c-label").innerText = option3[index];
            document.getElementById("option-d-label").innerText = option4[index];
        }
    })