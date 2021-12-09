const days = [
    // day 1
    (input) => {
        const measurements = input.split("\n").map((x) => +x);

        return [
            // part 1
            measurements.filter(
                (value, index, array) => index >= 1 && array[index] > array[index - 1]
            ).length,

            // part 2
            measurements.filter(
                (value, index, array) => index >= 3 && array[index] > array[index - 3]
            ).length,
        ];
    },

    // day 2
    (input) => {
        const commands = input.split("\n");

        return [
            // part 1
            (() => {
                let horizontalPosition = 0;
                let depth = 0;

                commands.forEach((value) => {
                    const [direction, units] = value.split(" ");

                    switch (direction) {
                        case "forward":
                            horizontalPosition += +units;
                            break;

                        case "down":
                            depth += +units;
                            break;

                        case "up":
                            depth -= +units;
                            break;
                    }
                });

                return horizontalPosition * depth;
            })(),

            // part 2
            (() => {
                let horizontalPosition = 0;
                let aim = 0;
                let depth = 0;

                commands.forEach((value) => {
                    const [direction, units] = value.split(" ");

                    switch (direction) {
                        case "forward":
                            horizontalPosition += +units;
                            depth += aim * +units;
                            break;

                        case "down":
                            aim += +units;
                            break;

                        case "up":
                            aim -= +units;
                            break;
                    }
                });

                return horizontalPosition * depth;
            })(),
        ];
    },

    // day 3
    (input) => {
        const numbers = input.split("\n");
        const nBits = numbers[0].length;

        return [
            // part 1
            (() => {
                const counters = new Array(nBits).fill(0);

                numbers.forEach((value) => {
                    for (let i = 0; i < nBits; i++) {
                        counters[i] += value.charAt(i) == "1" ? 1 : -1;
                    }
                });

                const gamma = counters
                    .map((value, index) => (value > 0 ? 2 ** (nBits - 1 - index) : 0))
                    .reduce((acc, cur) => acc + cur);

                const epsilon = 2 ** nBits - 1 - gamma;

                return gamma * epsilon;
            })(),

            // part 2
            (() => {
                function getRating(leastCommon) {
                    var filtered = numbers.slice();

                    for (let i = 0; filtered.length > 1; i++) {
                        let counter = 0;
                        filtered.forEach((value) => {
                            counter += value.charAt(i) == "1" ? 1 : -1;
                        });

                        const desiredBit = ((counter >= 0) ^ leastCommon) + "";

                        filtered = filtered.filter(
                            (value) => value.charAt(i) == desiredBit
                        );
                    }

                    return parseInt(filtered[0], 2);
                }

                const oxygenGeneratorRating = getRating(false);
                const co2ScrubberRating = getRating(true);

                return oxygenGeneratorRating * co2ScrubberRating;
            })(),
        ];
    },

    // day 4
    (input) => {
        input = input.split("\n\n");
        const numbers = input[0].split(",").map((x) => +x);

        function getBoards(input) {
            return input
                .slice(1)
                .map((board) =>
                    board
                        .split("\n")
                        .filter((x) => x)
                        .map((row) => row.match(/.{1,3}/g).map((x) => +x))
                )
                .map((board) =>
                    board.concat(
                        board[0].map((_, colIndex) => board.map((row) => row[colIndex]))
                    )
                );
        }

        return [
            // part 1
            (() => {
                const boards = getBoards(input);

                for (const number of numbers) {
                    for (const board of boards) {
                        for (const row of board) {
                            for (let i = 0; i < row.length; i++) {
                                if (row[i] == number) row[i] = 0;
                            }
                        }

                        for (const row of board) {
                            // found the winner
                            if (!row.reduce((acc, cur) => acc + cur, 0)) {
                                const sum =
                                    board.reduce(
                                        (acc, cur) =>
                                            acc + cur.reduce((acc, cur) => acc + cur, 0),
                                        0
                                    ) / 2;

                                return sum * number;
                            }
                        }
                    }
                }
            })(),

            // part 2
            (() => {
                const boards = getBoards(input);

                const winners = [];
                let winningSum;
                let winningNumber;

                for (const number of numbers) {
                    for (let i = 0; i < boards.length; i++) {
                        if (winners.indexOf(i) < 0) {
                            const board = boards[i];
                            for (const row of board) {
                                for (let j = 0; j < row.length; j++) {
                                    if (row[j] == number) row[j] = 0;
                                }
                            }

                            for (const row of board) {
                                // found a winner
                                if (!row.reduce((acc, cur) => acc + cur, 0)) {
                                    winningSum =
                                        board.reduce(
                                            (acc, cur) =>
                                                acc +
                                                cur.reduce((acc, cur) => acc + cur, 0),
                                            0
                                        ) / 2;
                                    winningNumber = number;
                                    winners.push(i);
                                }
                            }
                        }
                    }
                }

                return winningSum * winningNumber;
            })(),
        ];
    },

    // day 4
    (input) => {
        input = input.trim().split("\n");
        const lines = input.map((value) => {
            const coords = value
                .split(" -> ")
                .reduce((acc, cur) => acc.concat(cur.split(",")), [])
                .map((x) => +x);

            return {
                x1: coords[0],
                y1: coords[1],
                x2: coords[2],
                y2: coords[3],
            };
        });

        const maxX = lines.reduce(
            (acc, cur) => Math.max(acc, Math.max(cur.x1, cur.x2)),
            0
        );
        const maxY = lines.reduce(
            (acc, cur) => Math.max(acc, Math.max(cur.y1, cur.y2)),
            0
        );

        return [
            // part 1
            (() => {
                const points = Array(maxY + 1)
                    .fill(0)
                    .map((x) => Array(maxX + 1).fill(0));

                for (const line of lines) {
                    if (line.x1 == line.x2) {
                        for (let i = 0; i <= Math.abs(line.y2 - line.y1); i++) {
                            points[line.y1 + i * Math.sign(line.y2 - line.y1)][line.x1]++;
                        }
                    } else if (line.y1 == line.y2) {
                        for (let i = 0; i <= Math.abs(line.x2 - line.x1); i++) {
                            points[line.y1][line.x1 + i * Math.sign(line.x2 - line.x1)]++;
                        }
                    }
                }

                return points.reduce(
                    (acc, cur) =>
                        acc + cur.reduce((acc, cur) => acc + (cur > 1 ? 1 : 0), 0),
                    0
                );
            })(),

            // part 2
            (() => {
                const points = Array(maxY + 1)
                    .fill(0)
                    .map((x) => Array(maxX + 1).fill(0));

                for (const line of lines) {
                    if (line.x1 == line.x2) {
                        for (let i = 0; i <= Math.abs(line.y2 - line.y1); i++) {
                            points[line.y1 + i * Math.sign(line.y2 - line.y1)][line.x1]++;
                        }
                    } else if (line.y1 == line.y2) {
                        for (let i = 0; i <= Math.abs(line.x2 - line.x1); i++) {
                            points[line.y1][line.x1 + i * Math.sign(line.x2 - line.x1)]++;
                        }
                    } else {
                        for (let i = 0; i <= Math.abs(line.x2 - line.x1); i++) {
                            points[line.y1 + i * Math.sign(line.y2 - line.y1)][
                                line.x1 + i * Math.sign(line.x2 - line.x1)
                            ]++;
                        }
                    }
                }

                return points.reduce(
                    (acc, cur) =>
                        acc + cur.reduce((acc, cur) => acc + (cur > 1 ? 1 : 0), 0),
                    0
                );
            })(),
        ];
    },

    // day 6
    (input) => {
        return [
            // part 1
            (() => {
                let timers = input.split(",").map((x) => +x);

                for (let i = 0; i < 80; i++) {
                    for (let j = 0, len = timers.length; j < len; j++) {
                        if (!timers[j]) {
                            timers.push(8);
                            timers[j] = 6;
                        } else timers[j]--;
                    }
                }

                return timers.length;
            })(),

            // part 2
            (() => {
                let timers = input
                    .split(",")
                    .map((x) => +x)
                    .reduce((acc, cur) => {
                        acc[cur]++;
                        return acc;
                    }, Array(9).fill(0));

                for (let i = 0; i < 256; i++) {
                    const numberToCreate = timers.shift();

                    timers[6] += numberToCreate;
                    timers.push(numberToCreate);
                }

                return timers.reduce((acc, cur) => acc + cur, 0);
            })(),
        ];
    },

    // day 7
    (input) => {
        let positions = input.split(",").map((x) => +x);

        const minX = positions.reduce(
            (acc, cur) => Math.min(acc, cur),
            Number.POSITIVE_INFINITY
        );
        const maxX = positions.reduce((acc, cur) => Math.max(acc, cur), 0);

        return [
            // part 1
            (() => {
                let bestX;
                let bestFuel = Number.POSITIVE_INFINITY;

                for (let x = minX; x <= maxX; x++) {
                    const fuel = positions.reduce(
                        (acc, cur) => acc + Math.abs(cur - x),
                        0
                    );

                    if (fuel < bestFuel) {
                        bestFuel = fuel;
                        bestX = x;
                    }
                }

                return bestFuel;
            })(),

            // part 2
            (() => {
                let bestX;
                let bestFuel = Number.POSITIVE_INFINITY;

                for (let x = minX; x <= maxX; x++) {
                    const fuel = positions.reduce((acc, cur) => {
                        const n = Math.abs(cur - x);
                        return acc + (n * (n + 1)) / 2;
                    }, 0);

                    if (fuel < bestFuel) {
                        bestFuel = fuel;
                        bestX = x;
                    }
                }

                return bestFuel;
            })(),
        ];
    },

    // day 8
    (input) => {
        return [
            // part 1
            (() => {
                const lengths = [2, 3, 4, 7];

                return input
                    .trim()
                    .split("\n")
                    .reduce(
                        (acc, cur) =>
                            acc +
                            cur
                                .trim()
                                .split(" | ")[1]
                                .split(" ")
                                .reduce(
                                    (acc, cur) =>
                                        acc + (lengths.indexOf(cur.length) >= 0 ? 1 : 0),
                                    0
                                ),
                        0
                    );
            })(),

            // part 2
            (() => {
                return input
                    .trim()
                    .split("\n")
                    .reduce((acc, cur) => {
                        let [signalPatterns, digits] = cur
                            .trim()
                            .split(" | ")
                            .map((x) =>
                                x.split(" ").map((x) => x.split("").sort().join(""))
                            );

                        signalPatterns = signalPatterns
                            .sort((a, b) => a.length - b.length)
                            .map((x) => x.split(""));

                        // determine 1, 4, 7 and 8
                        const numberIndexes = Array(10);
                        numberIndexes[1] = 0;
                        numberIndexes[4] = 2;
                        numberIndexes[7] = 1;
                        numberIndexes[8] = 9;

                        // determine segments with two possibilities
                        const segments2And5 = signalPatterns[1].filter((x) =>
                            signalPatterns[0].includes(x)
                        );
                        const segments1And3 = signalPatterns[2].filter(
                            (x) => !signalPatterns[0].includes(x)
                        );
                        const segments4And6 = signalPatterns[9].filter(
                            (x) =>
                                !signalPatterns[1].includes(x) &
                                !signalPatterns[2].includes(x)
                        );

                        // determine 2, 3 and 5
                        for (let i of [3, 4, 5]) {
                            if (
                                signalPatterns[i].filter((x) => segments4And6.includes(x))
                                    .length == 2
                            ) {
                                numberIndexes[2] = i;
                            }

                            if (
                                signalPatterns[i].filter((x) => segments2And5.includes(x))
                                    .length == 2
                            ) {
                                numberIndexes[3] = i;
                            }

                            if (
                                signalPatterns[i].filter((x) => segments1And3.includes(x))
                                    .length == 2
                            ) {
                                numberIndexes[5] = i;
                            }
                        }

                        // determine 0, 6 and 9
                        for (let i of [6, 7, 8]) {
                            if (
                                signalPatterns[i].filter((x) => segments1And3.includes(x))
                                    .length == 1
                            ) {
                                numberIndexes[0] = i;
                            }

                            if (
                                signalPatterns[i].filter((x) => segments2And5.includes(x))
                                    .length == 1
                            ) {
                                numberIndexes[6] = i;
                            }

                            if (
                                signalPatterns[i].filter((x) => segments4And6.includes(x))
                                    .length == 1
                            ) {
                                numberIndexes[9] = i;
                            }
                        }

                        const signalPatternsInOrder = numberIndexes.map((x) =>
                            signalPatterns[x].join("")
                        );

                        return (
                            acc +
                            digits.reduce(
                                (acc, cur) =>
                                    10 * acc + signalPatternsInOrder.indexOf(cur),
                                0
                            )
                        );
                    }, 0);
            })(),
        ];
    },
];
