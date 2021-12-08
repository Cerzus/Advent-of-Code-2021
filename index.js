const select = document.getElementsByName("day")[0];

let daysToLoad = days.length;
const input = [];

days.forEach((value, index) => {
    const option = document.createElement("option");
    option.text = "Day " + (index + 1);
    option.value = index;
    select.appendChild(option);

    fetch("input/day" + (index + 1) + ".txt")
        .then((response) => response.text())
        .then((data) => {
            input.push(data);

            if (!--daysToLoad) {
                select.value = select.children.length - 2;
                loadSolutions();
            }
        });
});

function loadSolutions() {
    const solutions = days[select.value](input[select.value]);

    for (let i = 0; i < 2; i++) {
        document.getElementById("solution-part-" + (i + 1)).innerHTML = solutions[i];
    }
}

select.oninput = loadSolutions;
