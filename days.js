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
];
