fetch("http://localhost:3000/getData", {
    method: "GET",
    headers: {
        "Content-Type": "application/json"
    }
})
    .then((response) => response.json())
    .then((data) => {
        const submissionContainer = document.getElementById("submission-container");

        if (data.success) {
            if (data.submissions.length === 0) {
                submissionContainer.innerText = "Currently no submissions.";
            } else {
                const table = document.createElement("table");
                const headerRow = table.insertRow();
                const headers = ["Date","Time", "Marks"];

                headers.forEach((headerText) => {
                    const header = document.createElement("th");
                    header.textContent = headerText;
                    headerRow.appendChild(header);
                });

                data.submissions.forEach((submission,index) => {
                    const row = table.insertRow();
                    Object.values(submission).forEach((value) => {
                        const cell = row.insertCell();
                        cell.textContent = value;
                    });
                });

                submissionContainer.appendChild(table);
            }
        } else {
            alert(data.error);
        }
    })
    .catch((error) => {
        console.error("Error:", error);
    });

document.getElementById("logout").addEventListener("click", () => {
    fetch("/logout",{method:"GET"})
    .then((response) => response.json())
    .then((data) => {
        if(data.success){
            window.location.href = "/login";
        }else{
            alert(data.error);
        }
    })
    .catch((error) => {
        console.error("Error:", error);
    });
})