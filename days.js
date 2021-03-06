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

        const minX = Math.min(...positions);
        const maxX = Math.max(...positions);

        return [
            // part 1
            (() => {
                let bestFuel = Number.POSITIVE_INFINITY;

                for (let x = minX; x <= maxX; x++) {
                    const fuel = positions.reduce(
                        (acc, cur) => acc + Math.abs(cur - x),
                        0
                    );

                    if (fuel < bestFuel) {
                        bestFuel = fuel;
                    }
                }

                return bestFuel;
            })(),

            // part 2
            (() => {
                let bestFuel = Number.POSITIVE_INFINITY;

                for (let x = minX; x <= maxX; x++) {
                    const fuel = positions.reduce((acc, cur) => {
                        const n = Math.abs(cur - x);
                        return acc + (n * (n + 1)) / 2;
                    }, 0);

                    if (fuel < bestFuel) bestFuel = fuel;
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

    // day 9
    (input) => {
        const points = input
            .trim()
            .split("\n")
            .map((x) => x.split("").map((x) => +x));

        return [
            // part 1
            (() => {
                let sum = 0;

                for (let y = 0; y < points.length; y++) {
                    for (let x = 0; x < points[y].length; x++) {
                        const point = points[y][x];

                        if (
                            (x == 0 || point < points[y][x - 1]) &&
                            (x == points[y].length - 1 || point < points[y][x + 1]) &&
                            (y == 0 || point < points[y - 1][x]) &&
                            (y == points.length - 1 || point < points[y + 1][x])
                        ) {
                            sum += point + 1;
                        }
                    }
                }

                return sum;
            })(),

            // part 2
            (() => {
                const touchedPoints = points.map((y) => y.map((x) => false));

                function basinFloodFill(x, y) {
                    if (
                        y < 0 ||
                        y >= points.length ||
                        x < 0 ||
                        x >= points[y].length ||
                        touchedPoints[y][x] ||
                        points[y][x] == 9
                    ) {
                        return 0;
                    }

                    touchedPoints[y][x] = true;

                    return (
                        1 +
                        basinFloodFill(x - 1, y) +
                        basinFloodFill(x + 1, y) +
                        basinFloodFill(x, y - 1) +
                        basinFloodFill(x, y + 1)
                    );
                }

                const basinSizes = [];

                for (let y = 0; y < points.length; y++) {
                    for (let x = 0; x < points[y].length; x++) {
                        const point = points[y][x];

                        if (
                            (x == 0 || point < points[y][x - 1]) &&
                            (x == points[y].length - 1 || point < points[y][x + 1]) &&
                            (y == 0 || point < points[y - 1][x]) &&
                            (y == points.length - 1 || point < points[y + 1][x])
                        ) {
                            basinSizes.push(basinFloodFill(x, y));
                        }
                    }
                }

                const largestBasinSizes = basinSizes.sort((a, b) => b - a).slice(0, 3);

                return largestBasinSizes[0] * largestBasinSizes[1] * largestBasinSizes[2];
            })(),
        ];
    },

    // day 10
    (input) => {
        // input =
        //     "[({(<(())[]>[[{[]{<()<>>\n[(()[<>])]({[<{<<[]>>(\n{([(<{}[<>[]}>{[]{[(<()>\n(((({<>}<{<{<>}{[]{[]{}\n[[<[([]))<([[{}[[()]]]\n[{[{({}]{}}([{[{{{}}([]\n{<[[]]>}<{[{[{[]{()[[[]\n[<(<(<(<{}))><([]([]()\n<{([([[(<>()){}]>(<<{{\n<{([{{}}[<[[[<>{}]]]>[]]";
        const lines = input.trim().split("\n");

        return [
            // part 1
            (() => {
                let syntaxErrorScore = 0;

                for (const line of lines) {
                    const stack = [];

                    for (let i = 0; i < line.length; i++) {
                        const char = line.charAt(i);
                        const openIndex = ["(", "[", "{", "<"].indexOf(char);

                        if (openIndex >= 0) {
                            stack.push(openIndex);
                        } else {
                            const closeIndex = [")", "]", "}", ">"].indexOf(char);
                            if (closeIndex != stack.pop()) {
                                syntaxErrorScore += [3, 57, 1197, 25137][closeIndex];
                                break;
                            }
                        }
                    }
                }

                return syntaxErrorScore;
            })(),

            // part 2
            (() => {
                const scores = lines
                    .reduce((acc, line) => {
                        const stack = [];

                        for (let j = 0; j < line.length; j++) {
                            const char = line.charAt(j);
                            const openIndex = ["(", "[", "{", "<"].indexOf(char);

                            if (openIndex >= 0) {
                                stack.unshift(openIndex);
                            } else {
                                const closeIndex = [")", "]", "}", ">"].indexOf(char);
                                if (closeIndex != stack.shift()) return acc;
                            }
                        }

                        acc.push(
                            stack.reduce((acc, cur) => {
                                return acc * 5 + cur + 1;
                            }, 0)
                        );

                        return acc;
                    }, [])
                    .sort((a, b) => a - b);

                return scores[(scores.length - 1) / 2];
            })(),
        ];
    },

    // day 11
    (input) => {
        // input =
        //     "5483143223\n2745854711\n5264556173\n6141336146\n6357385478\n4167524645\n2176841721\n6882881134\n4846848554\n5283751526";
        const startingEnergyLevels = input
            .trim()
            .split("\n")
            .map((x) => x.split("").map((x) => +x));

        function increaseEnergyLevel(energyLevels, x, y) {
            energyLevels[y][x]++;

            if (energyLevels[y][x] == 10) {
                for (let i = Math.max(0, y - 1); i <= Math.min(y + 1, 9); i++) {
                    for (let j = Math.max(0, x - 1); j <= Math.min(x + 1, 9); j++) {
                        if (x != j || y != i) {
                            increaseEnergyLevel(energyLevels, j, i);
                        }
                    }
                }
            }
        }

        return [
            // part 1
            (() => {
                const energyLevels = startingEnergyLevels.map((x) => x.slice());
                let count = 0;

                for (let i = 0; i < 100; i++) {
                    for (let y = 0; y < 10; y++) {
                        for (let x = 0; x < 10; x++) {
                            increaseEnergyLevel(energyLevels, x, y);
                        }
                    }

                    for (let y = 0; y < 10; y++) {
                        for (let x = 0; x < 10; x++) {
                            if (energyLevels[y][x] > 9) {
                                energyLevels[y][x] = 0;
                                count++;
                            }
                        }
                    }
                }

                return count;
            })(),

            // part 2
            (() => {
                const energyLevels = startingEnergyLevels.map((x) => x.slice());

                for (let i = 0; ; i++) {
                    let count = 0;

                    for (let y = 0; y < 10; y++) {
                        for (let x = 0; x < 10; x++) {
                            increaseEnergyLevel(energyLevels, x, y);
                        }
                    }

                    for (let y = 0; y < 10; y++) {
                        for (let x = 0; x < 10; x++) {
                            if (energyLevels[y][x] > 9) {
                                energyLevels[y][x] = 0;
                                count++;
                            }
                        }
                    }

                    if (count == 100) return i + 1;
                }
            })(),
        ];
    },

    // day 12
    (input) => {
        const connections = input
            .trim()
            .split("\n")
            .map((x) => x.split("-"));

        const graph = connections.reduce((acc, cur) => {
            for (let i = 0; i < 2; i++) {
                if (!acc.hasOwnProperty(cur[i])) acc[cur[i]] = [];
                acc[cur[i]].push(cur[1 - i]);
            }

            return acc;
        }, {});

        return [
            // part 1
            (() => {
                const paths = [];

                function findPaths(node, path) {
                    path.push(node);
                    if (node == "end") {
                        paths.push(path.slice());
                    } else {
                        for (const next of graph[node]) {
                            if (
                                path.indexOf(next) < 0 ||
                                next.charAt(0) != next.charAt(0).toLowerCase()
                            ) {
                                findPaths(next, path.slice());
                            }
                        }
                    }
                }

                findPaths("start", [], paths);

                return paths.length;
            })(),

            // part 2
            (() => {
                const paths = [];

                function findPaths(node, path, doubleSmallCaves) {
                    path.push(node);
                    if (node == "end") {
                        paths.push(path.slice());
                    } else {
                        for (const next of graph[node]) {
                            if (
                                next == "end" ||
                                next.charAt(0) != next.charAt(0).toLowerCase()
                            ) {
                                findPaths(next, path.slice(), doubleSmallCaves);
                            } else if (next != "start") {
                                let count = 1;
                                for (const prev of path) {
                                    if (prev == next) count++;
                                }

                                if (count <= 2 - (doubleSmallCaves ? 1 : 0)) {
                                    findPaths(
                                        next,
                                        path.slice(),
                                        doubleSmallCaves || count == 2
                                    );
                                }
                            }
                        }
                    }
                }

                findPaths("start", [], false);

                return paths.length;
            })(),
        ];
    },

    // day 13
    (input) => {
        const [input1, input2] = input.trim().split("\n\n");
        const dots = input1.split("\n").map((x) => x.split(",").map((x) => +x));
        const folds = input2.split("\n").map((x) => x.substring(11).split("="));

        return [
            // part 1
            (() => {
                const foldAlongX = folds[0][0] == "x";
                const foldCoordinate = +folds[0][1];

                return dots.reduce((acc, cur) => {
                    let [x, y] = cur;

                    if (foldAlongX) {
                        x -= 2 * Math.max(0, x - foldCoordinate);
                    } else {
                        y -= 2 * Math.max(0, y - foldCoordinate);
                    }

                    const coordinates = [x, y].join(",");

                    if (acc.indexOf(coordinates) < 0) acc.push(coordinates);

                    return acc;
                }, []).length;
            })(),

            // part 2
            (() => {
                const foo = dots.reduce((acc, cur) => {
                    let [x, y] = cur;

                    for (const fold of folds) {
                        const foldAlongX = fold[0] == "x";
                        const foldCoordinate = +fold[1];

                        if (foldAlongX) {
                            x -= 2 * Math.max(0, x - foldCoordinate);
                        } else {
                            y -= 2 * Math.max(0, y - foldCoordinate);
                        }
                    }

                    acc.push([x, y]);

                    return acc;
                }, []);

                const [maxX, maxY] = foo.reduce(
                    (acc, cur) => [Math.max(acc[0], cur[0]), Math.max(acc[1], cur[1])],
                    [0, 0]
                );

                const code = Array(maxY + 1)
                    .fill()
                    .map((x) => Array(maxX + 1).fill(false));

                for (const coordinate of foo) {
                    const [x, y] = coordinate;

                    code[y][x] = true;
                }

                return (
                    "<p style='font-family:monospace'>" +
                    code
                        .map((x) => x.map((x) => (x ? "X" : "&nbsp;")).join(""))
                        .join("<br>") +
                    "</p>"
                );
            })(),
        ];
    },

    // day 14
    (input) => {
        const [input1, input2] = input.trim().split("\n\n");

        const rules = input2
            .split("\n")
            .map((x) => x.split(" -> "))
            .reduce((acc, cur) => {
                acc[cur[0]] = cur[1];
                return acc;
            }, {});

        return [
            // part 1
            (() => {
                let polymerTemplate = input1.split("");

                for (let i = 0; i < 10; i++) {
                    polymerTemplate = polymerTemplate
                        .reduce((acc, cur, i, arr) => {
                            if (i) acc.push(arr[i - 1] + cur);
                            return acc;
                        }, [])
                        .reduce((acc, cur, i) => {
                            if (!i) acc.push(cur.charAt(0));
                            if (rules.hasOwnProperty(cur)) acc.push(rules[cur]);
                            acc.push(cur.charAt(1));
                            return acc;
                        }, []);
                }

                const occurrences = Object.entries(
                    polymerTemplate.reduce((acc, cur) => {
                        if (!acc.hasOwnProperty(cur)) acc[cur] = 1;
                        else acc[cur]++;
                        return acc;
                    }, {})
                ).reduce((acc, cur) => acc.concat([cur[1]]), []);

                return Math.max(...occurrences) - Math.min(...occurrences);
            })(),

            // part 2
            (() => {
                let pairs = input1
                    .split("")
                    .reduce((acc, cur, i, arr) => {
                        if (i) acc.push(arr[i - 1] + cur);
                        return acc;
                    }, [])
                    .reduce((acc, cur) => {
                        if (!acc.hasOwnProperty(cur)) acc[cur] = 1;
                        else acc[cur]++;
                        return acc;
                    }, {});

                for (let i = 0; i < 40; i++) {
                    pairs = Object.entries(pairs).reduce((acc, cur) => {
                        if (rules.hasOwnProperty(cur[0])) {
                            const firstPair = cur[0].charAt(0) + rules[cur[0]];
                            const secondPair = rules[cur[0]] + cur[0].charAt(1);

                            if (!acc.hasOwnProperty(firstPair)) acc[firstPair] = 0;
                            acc[firstPair] += cur[1];

                            if (!acc.hasOwnProperty(secondPair)) acc[secondPair] = 0;
                            acc[secondPair] += cur[1];
                        } else {
                            acc[cur[0]] = cur[1];
                        }

                        return acc;
                    }, {});
                }

                let occurrences = Object.entries(pairs).reduce((acc, cur) => {
                    const char = cur[0].charAt(1);
                    if (!acc.hasOwnProperty(char)) acc[char] = 0;
                    acc[char] += cur[1];

                    return acc;
                }, {});

                const char = input1.charAt(0);
                if (!occurrences.hasOwnProperty(char)) occurrences[char] = 1;
                occurrences[char]++;

                occurrences = Object.entries(occurrences).reduce(
                    (acc, cur) => acc.concat([cur[1]]),
                    []
                );

                return Math.max(...occurrences) - Math.min(...occurrences);
            })(),
        ];
    },

    // day 15
    (input) => {
        // comment out to use actual input. Warning: takes a few minutes for part two.
        input =
            "1163751742\n1381373672\n2136511328\n3694931569\n7463417111\n1319128137\n1359912421\n3125421639\n1293138521\n2311944581";

        function lowestRisk(map) {
            const unvisited = map.reduce(
                (acc, cur, y) =>
                    acc.concat(
                        cur.reduce((acc, _, x) => acc.concat([[x, y]]), []),
                        []
                    ),
                []
            );

            const distances = Array(map.length)
                .fill()
                .map(() => Array(map[0].length).fill(Infinity));
            distances[0][0] = 0;

            const deltaX = [0, 1, 0, -1];
            const deltaY = [1, 0, -1, 0];

            const width = map[0].length;
            const height = map.length;

            let foo = 0;

            while (unvisited.length) {
                let currentX, currentY;
                let currentDistance = Infinity;
                let index;

                for (let i = 0; i < unvisited.length; i++) {
                    const node = unvisited[i];

                    const [x, y] = node;
                    if (distances[y][x] < currentDistance) {
                        currentDistance = distances[y][x];
                        currentX = x;
                        currentY = y;
                        index = i;
                    }
                }

                for (let i = 0; i < 4; i++) {
                    const x = currentX + deltaX[i];
                    const y = currentY + deltaY[i];

                    if (x < 0 || y < 0 || x >= width || y >= height) continue;

                    distances[y][x] = Math.min(
                        currentDistance + map[y][x],
                        distances[y][x]
                    );
                }

                unvisited.splice(index, 1);

                if (foo++ == 999) {
                    foo = 0;
                    console.log(unvisited.length);
                }
            }

            return distances[map.length - 1][map[0].length - 1];
        }

        return [
            // part 1
            (() => {
                const map = input
                    .trim()
                    .split("\n")
                    .map((x) => x.split("").map((x) => +x));

                return lowestRisk(map);
            })(),

            // part 2
            (() => {
                const map = input
                    .trim()
                    .split("\n")
                    .map((x) => x.split("").map((x) => +x))
                    .reduce((acc, cur, y, arr) => {
                        for (let i = 0; i < 5; i++) {
                            acc[y + i * arr.length] = Array(cur.length * 5);
                        }

                        cur.forEach((risk, x) => {
                            for (let i = 0; i < 5; i++) {
                                for (let j = 0; j < 5; j++) {
                                    acc[y + i * arr.length][x + j * cur.length] =
                                        ((risk - 1 + i + j) % 9) + 1;
                                }
                            }
                        });

                        return acc;
                    }, Array(input.trim().split("\n").length * 5));

                return lowestRisk(map);
            })(),
        ];
    },
];
