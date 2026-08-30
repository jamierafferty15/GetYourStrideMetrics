const KM_PER_MILE =
    1.609344;


const RIEGEL_EXPONENT =
    1.06;


const raceDistances = {
    fiveK: 5,
    tenK: 10,
    halfMarathon: 21.0975,
    marathon: 42.195
};


let showEverySplit =
    false;



const calculateButton =
    document.getElementById(
        "calculate"
    );


const resetButton =
    document.getElementById(
        "reset"
    );


const themeToggle =
    document.getElementById(
        "themeToggle"
    );


const presetButtons =
    document.querySelectorAll(
        ".preset-button"
    );


const customPreset =
    document.getElementById(
        "customPreset"
    );


const distanceInput =
    document.getElementById(
        "distance"
    );


const distanceUnitInput =
    document.getElementById(
        "distanceUnit"
    );


const hoursInput =
    document.getElementById(
        "hours"
    );


const minutesInput =
    document.getElementById(
        "minutes"
    );


const secondsInput =
    document.getElementById(
        "seconds"
    );


const errorMessage =
    document.getElementById(
        "errorMessage"
    );


const savedMessage =
    document.getElementById(
        "savedMessage"
    );



const targetPresetButtons =
    document.querySelectorAll(
        ".target-preset-button"
    );


const targetCustomPreset =
    document.getElementById(
        "targetCustomPreset"
    );


const targetDistanceInput =
    document.getElementById(
        "targetDistance"
    );


const targetDistanceUnitInput =
    document.getElementById(
        "targetDistanceUnit"
    );


const targetHoursInput =
    document.getElementById(
        "targetHours"
    );


const targetMinutesInput =
    document.getElementById(
        "targetMinutes"
    );


const targetSecondsInput =
    document.getElementById(
        "targetSeconds"
    );


const calculateTargetButton =
    document.getElementById(
        "calculateTarget"
    );


const resetTargetButton =
    document.getElementById(
        "resetTarget"
    );


const targetErrorMessage =
    document.getElementById(
        "targetErrorMessage"
    );


const splitToggle =
    document.getElementById(
        "splitToggle"
    );


const splitRows =
    document.getElementById(
        "splitRows"
    );


const splitSummary =
    document.getElementById(
        "splitSummary"
    );


const copyRunButton =
    document.getElementById(
        "copyRun"
    );


const shareRunButton =
    document.getElementById(
        "shareRun"
    );


const copyRacePlanButton =
    document.getElementById(
        "copyRacePlan"
    );


const shareRacePlanButton =
    document.getElementById(
        "shareRacePlan"
    );


const runActionMessage =
    document.getElementById(
        "runActionMessage"
    );


const raceActionMessage =
    document.getElementById(
        "raceActionMessage"
    );



function formatTime(
    totalSeconds
) {

    totalSeconds =
        Math.round(
            totalSeconds
        );


    const hours =
        Math.floor(
            totalSeconds /
            3600
        );


    const minutes =
        Math.floor(
            (
                totalSeconds %
                3600
            ) /
            60
        );


    const seconds =
        totalSeconds %
        60;


    if (
        hours > 0
    ) {

        return (
            hours +
            ":" +
            String(
                minutes
            ).padStart(
                2,
                "0"
            ) +
            ":" +
            String(
                seconds
            ).padStart(
                2,
                "0"
            )
        );

    }


    return (
        minutes +
        ":" +
        String(
            seconds
        ).padStart(
            2,
            "0"
        )
    );

}



function formatPace(
    totalSeconds
) {

    let minutes =
        Math.floor(
            totalSeconds /
            60
        );


    let seconds =
        Math.round(
            totalSeconds %
            60
        );


    if (
        seconds === 60
    ) {

        minutes += 1;

        seconds = 0;

    }


    return (
        minutes +
        ":" +
        String(
            seconds
        ).padStart(
            2,
            "0"
        )
    );

}



function formatPaceRange(
    fasterSeconds,
    slowerSeconds
) {

    return (
        formatPace(
            fasterSeconds
        ) +
        "–" +
        formatPace(
            slowerSeconds
        ) +
        " /km"
    );

}



function formatMileRange(
    fasterSecondsKm,
    slowerSecondsKm
) {

    return (
        formatPace(
            fasterSecondsKm *
            KM_PER_MILE
        ) +
        "–" +
        formatPace(
            slowerSecondsKm *
            KM_PER_MILE
        ) +
        " /mile"
    );

}



function showError(
    message
) {

    errorMessage.textContent =
        message;


    errorMessage.style.display =
        "block";

}



function clearError() {

    errorMessage.textContent =
        "";


    errorMessage.style.display =
        "none";

}



function showTargetError(
    message
) {

    targetErrorMessage.textContent =
        message;


    targetErrorMessage.style.display =
        "block";

}



function clearTargetError() {

    targetErrorMessage.textContent =
        "";


    targetErrorMessage.style.display =
        "none";

}



function validateInputs(
    distance,
    hours,
    minutes,
    seconds
) {

    if (
        !Number.isFinite(
            distance
        ) ||
        distance <= 0
    ) {

        return (
            "Please enter a distance greater than 0."
        );

    }


    if (
        !Number.isFinite(
            hours
        ) ||
        hours < 0
    ) {

        return (
            "Hours cannot be negative."
        );

    }


    if (
        !Number.isFinite(
            minutes
        ) ||
        minutes < 0 ||
        minutes > 59
    ) {

        return (
            "Minutes must be between 0 and 59."
        );

    }


    if (
        !Number.isFinite(
            seconds
        ) ||
        seconds < 0 ||
        seconds > 59
    ) {

        return (
            "Seconds must be between 0 and 59."
        );

    }


    const totalSeconds =
        (
            hours *
            3600
        ) +
        (
            minutes *
            60
        ) +
        seconds;


    if (
        totalSeconds <= 0
    ) {

        return (
            "Please enter a finishing time greater than 0."
        );

    }


    return "";

}



function removeActive(
    buttons
) {

    buttons.forEach(
        function (
            button
        ) {

            button.classList.remove(
                "active"
            );

        }
    );

}



function updatePresetSelection() {

    const distance =
        Number(
            distanceInput.value
        );


    const unit =
        distanceUnitInput.value;


    let matchedPreset =
        false;


    removeActive(
        presetButtons
    );


    if (
        unit === "km"
    ) {

        presetButtons.forEach(
            function (
                button
            ) {

                if (
                    button.dataset.distance
                ) {

                    const presetDistance =
                        Number(
                            button.dataset.distance
                        );


                    if (
                        Math.abs(
                            distance -
                            presetDistance
                        ) <
                        0.0001
                    ) {

                        button.classList.add(
                            "active"
                        );


                        matchedPreset =
                            true;

                    }

                }

            }
        );

    }


    if (
        !matchedPreset
    ) {

        customPreset.classList.add(
            "active"
        );

    }

}



function updateTargetPresetSelection() {

    const distance =
        Number(
            targetDistanceInput.value
        );


    const unit =
        targetDistanceUnitInput.value;


    let matchedPreset =
        false;


    removeActive(
        targetPresetButtons
    );


    if (
        unit === "km"
    ) {

        targetPresetButtons.forEach(
            function (
                button
            ) {

                if (
                    button.dataset.targetDistance
                ) {

                    const presetDistance =
                        Number(
                            button.dataset.targetDistance
                        );


                    if (
                        Math.abs(
                            distance -
                            presetDistance
                        ) <
                        0.0001
                    ) {

                        button.classList.add(
                            "active"
                        );


                        matchedPreset =
                            true;

                    }

                }

            }
        );

    }


    if (
        !matchedPreset
    ) {

        targetCustomPreset.classList.add(
            "active"
        );

    }

}



function predictRaceTime(
    knownTime,
    knownDistance,
    targetDistance
) {

    return (
        knownTime *
        Math.pow(
            targetDistance /
            knownDistance,
            RIEGEL_EXPONENT
        )
    );

}



function displaySamePace(
    paceSecondsPerKm
) {

    const races = [

        {
            timeId: "same5k",
            paceId: "samePace5k",
            distance: raceDistances.fiveK
        },

        {
            timeId: "same10k",
            paceId: "samePace10k",
            distance: raceDistances.tenK
        },

        {
            timeId: "sameHalf",
            paceId: "samePaceHalf",
            distance: raceDistances.halfMarathon
        },

        {
            timeId: "sameMarathon",
            paceId: "samePaceMarathon",
            distance: raceDistances.marathon
        }

    ];


    races.forEach(
        function (
            race
        ) {

            document
                .getElementById(
                    race.timeId
                )
                .textContent =
                formatTime(
                    paceSecondsPerKm *
                    race.distance
                );


            document
                .getElementById(
                    race.paceId
                )
                .textContent =
                formatPace(
                    paceSecondsPerKm
                ) +
                " /km";

        }
    );

}



function getPredictions(
    totalSeconds,
    distanceKm
) {

    return {

        fiveK:
            predictRaceTime(
                totalSeconds,
                distanceKm,
                raceDistances.fiveK
            ),

        tenK:
            predictRaceTime(
                totalSeconds,
                distanceKm,
                raceDistances.tenK
            ),

        half:
            predictRaceTime(
                totalSeconds,
                distanceKm,
                raceDistances.halfMarathon
            ),

        marathon:
            predictRaceTime(
                totalSeconds,
                distanceKm,
                raceDistances.marathon
            )

    };

}



function displayPredictions(
    predictions
) {

    const races = [

        {
            timeId: "predicted5k",
            paceId: "predictedPace5k",
            time: predictions.fiveK,
            distance: raceDistances.fiveK
        },

        {
            timeId: "predicted10k",
            paceId: "predictedPace10k",
            time: predictions.tenK,
            distance: raceDistances.tenK
        },

        {
            timeId: "predictedHalf",
            paceId: "predictedPaceHalf",
            time: predictions.half,
            distance: raceDistances.halfMarathon
        },

        {
            timeId: "predictedMarathon",
            paceId: "predictedPaceMarathon",
            time: predictions.marathon,
            distance: raceDistances.marathon
        }

    ];


    races.forEach(
        function (
            race
        ) {

            document
                .getElementById(
                    race.timeId
                )
                .textContent =
                formatTime(
                    race.time
                );


            document
                .getElementById(
                    race.paceId
                )
                .textContent =
                formatPace(
                    race.time /
                    race.distance
                ) +
                " /km";

        }
    );

}



function displayTrainingPaces(
    predictions
) {

    const predicted10kPace =
        predictions.tenK /
        raceDistances.tenK;


    const predicted5kPace =
        predictions.fiveK /
        raceDistances.fiveK;


    const trainingRanges = {

        easy: {
            fast:
                predicted10kPace + 60,

            slow:
                predicted10kPace + 90
        },

        steady: {
            fast:
                predicted10kPace + 30,

            slow:
                predicted10kPace + 60
        },

        tempo: {
            fast:
                predicted10kPace + 10,

            slow:
                predicted10kPace + 25
        },

        interval: {
            fast:
                predicted5kPace - 5,

            slow:
                predicted5kPace + 5
        }

    };


    function displayRange(
        range,
        kmId,
        mileId
    ) {

        document
            .getElementById(
                kmId
            )
            .textContent =
            formatPaceRange(
                range.fast,
                range.slow
            );


        document
            .getElementById(
                mileId
            )
            .textContent =
            formatMileRange(
                range.fast,
                range.slow
            );

    }


    displayRange(
        trainingRanges.easy,
        "easyPace",
        "easyPaceMile"
    );


    displayRange(
        trainingRanges.steady,
        "steadyPace",
        "steadyPaceMile"
    );


    displayRange(
        trainingRanges.tempo,
        "tempoPace",
        "tempoPaceMile"
    );


    displayRange(
        trainingRanges.interval,
        "intervalPace",
        "intervalPaceMile"
    );

}



function saveInputs() {

    const settings = {

        distance:
            distanceInput.value,

        distanceUnit:
            distanceUnitInput.value,

        hours:
            hoursInput.value,

        minutes:
            minutesInput.value,

        seconds:
            secondsInput.value

    };


    localStorage.setItem(
        "strideMetricsInputs",
        JSON.stringify(
            settings
        )
    );


    savedMessage.textContent =
        "Run details saved automatically.";

}



function loadSavedInputs() {

    const savedInputs =
        localStorage.getItem(
            "strideMetricsInputs"
        );


    if (
        !savedInputs
    ) {

        return;

    }


    try {

        const settings =
            JSON.parse(
                savedInputs
            );


        distanceInput.value =
            settings.distance ??
            "10";


        distanceUnitInput.value =
            settings.distanceUnit ??
            "km";


        hoursInput.value =
            settings.hours ??
            "0";


        minutesInput.value =
            settings.minutes ??
            "45";


        secondsInput.value =
            settings.seconds ??
            "0";


        savedMessage.textContent =
            "Your last run details were restored.";

    } catch (
        error
    ) {

        console.log(
            "Could not restore saved inputs."
        );

    }

}



function saveTheme(
    theme
) {

    localStorage.setItem(
        "strideMetricsTheme",
        theme
    );

}



function updateThemeButton() {

    const darkMode =
        document.body
            .classList
            .contains(
                "dark-mode"
            );


    themeToggle.textContent =
        darkMode
            ? "☀️ Light"
            : "🌙 Dark";

}



function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            "strideMetricsTheme"
        );


    if (
        savedTheme ===
        "dark"
    ) {

        document.body
            .classList
            .add(
                "dark-mode"
            );

    }


    updateThemeButton();

}



function toggleTheme() {

    document.body
        .classList
        .toggle(
            "dark-mode"
        );


    const darkMode =
        document.body
            .classList
            .contains(
                "dark-mode"
            );


    saveTheme(
        darkMode
            ? "dark"
            : "light"
    );


    updateThemeButton();

}



function calculatePace() {

    clearError();


    const distance =
        Number(
            distanceInput.value
        );


    const distanceUnit =
        distanceUnitInput.value;


    const hours =
        Number(
            hoursInput.value
        );


    const minutes =
        Number(
            minutesInput.value
        );


    const seconds =
        Number(
            secondsInput.value
        );


    const validationMessage =
        validateInputs(
            distance,
            hours,
            minutes,
            seconds
        );


    if (
        validationMessage !==
        ""
    ) {

        showError(
            validationMessage
        );

        return;

    }


    const totalSeconds =
        (
            hours * 3600
        ) +
        (
            minutes * 60
        ) +
        seconds;


    const distanceKm =
        distanceUnit ===
        "miles"

            ? distance *
              KM_PER_MILE

            : distance;


    const paceSecondsPerKm =
        totalSeconds /
        distanceKm;


    const paceSecondsPerMile =
        paceSecondsPerKm *
        KM_PER_MILE;


    const speedKmh =
        distanceKm /
        (
            totalSeconds /
            3600
        );


    const speedMph =
        speedKmh /
        KM_PER_MILE;


    document
        .getElementById(
            "paceKmResult"
        )
        .textContent =
        formatPace(
            paceSecondsPerKm
        ) +
        " /km";


    document
        .getElementById(
            "paceMileResult"
        )
        .textContent =
        formatPace(
            paceSecondsPerMile
        ) +
        " /mile";


    document
        .getElementById(
            "kmhResult"
        )
        .textContent =
        speedKmh.toFixed(
            2
        ) +
        " km/h";


    document
        .getElementById(
            "mphResult"
        )
        .textContent =
        speedMph.toFixed(
            2
        ) +
        " mph";


    displaySamePace(
        paceSecondsPerKm
    );


    const predictions =
        getPredictions(
            totalSeconds,
            distanceKm
        );


    displayPredictions(
        predictions
    );


    displayTrainingPaces(
        predictions
    );


    updatePresetSelection();


    saveInputs();

}



function getTargetValues() {

    const distance =
        Number(
            targetDistanceInput.value
        );


    const unit =
        targetDistanceUnitInput.value;


    const hours =
        Number(
            targetHoursInput.value
        );


    const minutes =
        Number(
            targetMinutesInput.value
        );


    const seconds =
        Number(
            targetSecondsInput.value
        );


    const validationMessage =
        validateInputs(
            distance,
            hours,
            minutes,
            seconds
        );


    if (
        validationMessage !==
        ""
    ) {

        return {
            error:
                validationMessage
        };

    }


    const totalSeconds =
        (
            hours * 3600
        ) +
        (
            minutes * 60
        ) +
        seconds;


    const distanceKm =
        unit ===
        "miles"

            ? distance *
              KM_PER_MILE

            : distance;


    return {
        distance,
        unit,
        totalSeconds,
        distanceKm
    };

}



function calculateTargetPace() {

    clearTargetError();


    const target =
        getTargetValues();


    if (
        target.error
    ) {

        showTargetError(
            target.error
        );

        return;

    }


    const paceSecondsPerKm =
        target.totalSeconds /
        target.distanceKm;


    const paceSecondsPerMile =
        paceSecondsPerKm *
        KM_PER_MILE;


    const speedKmh =
        target.distanceKm /
        (
            target.totalSeconds /
            3600
        );


    const speedMph =
        speedKmh /
        KM_PER_MILE;


    document
        .getElementById(
            "targetPaceKm"
        )
        .textContent =
        formatPace(
            paceSecondsPerKm
        ) +
        " /km";


    document
        .getElementById(
            "targetPaceMile"
        )
        .textContent =
        formatPace(
            paceSecondsPerMile
        ) +
        " /mile";


    document
        .getElementById(
            "targetKmh"
        )
        .textContent =
        speedKmh.toFixed(
            2
        ) +
        " km/h";


    document
        .getElementById(
            "targetMph"
        )
        .textContent =
        speedMph.toFixed(
            2
        ) +
        " mph";


    updateTargetPresetSelection();


    renderSplits(
        target
    );

}



function getKeySplitDistances(
    distance,
    unit
) {

    let candidates;


    if (
        unit === "miles"
    ) {

        candidates = [
            1,
            3,
            5,
            10,
            15,
            20,
            25
        ];

    } else {

        candidates = [
            1,
            5,
            10,
            15,
            20,
            30,
            40
        ];

    }


    return candidates.filter(
        function (
            checkpoint
        ) {

            return (
                checkpoint <
                distance
            );

        }
    );

}



function getEverySplitDistances(
    distance
) {

    const splits =
        [];


    const fullUnits =
        Math.floor(
            distance
        );


    for (
        let i = 1;
        i <= fullUnits;
        i++
    ) {

        if (
            i <
            distance
        ) {

            splits.push(
                i
            );

        }

    }


    return splits;

}



function formatSplitDistance(
    distance,
    unit
) {

    const unitLabel =
        unit ===
        "miles"

            ? "mi"

            : "km";


    if (
        Number.isInteger(
            distance
        )
    ) {

        return (
            distance +
            " " +
            unitLabel
        );

    }


    return (
        distance.toFixed(
            2
        ) +
        " " +
        unitLabel
    );

}



function createSplitRow(
    checkpoint,
    time,
    unit,
    isFinish
) {

    const row =
        document.createElement(
            "div"
        );


    row.className =
        isFinish

            ? "split-row finish"

            : "split-row";


    const distanceCell =
        document.createElement(
            "span"
        );


    distanceCell.className =
        "split-distance";


    if (
        isFinish
    ) {

        distanceCell.textContent =
            "FINISH · " +
            formatSplitDistance(
                checkpoint,
                unit
            );

    } else {

        distanceCell.textContent =
            formatSplitDistance(
                checkpoint,
                unit
            );

    }


    const timeCell =
        document.createElement(
            "span"
        );


    timeCell.className =
        "split-time";


    timeCell.textContent =
        formatTime(
            time
        );


    row.appendChild(
        distanceCell
    );


    row.appendChild(
        timeCell
    );


    return row;

}



function renderSplits(
    target
) {

    splitRows.innerHTML =
        "";


    const splitDistances =
        showEverySplit

            ? getEverySplitDistances(
                target.distance
            )

            : getKeySplitDistances(
                target.distance,
                target.unit
            );


    splitDistances.forEach(
        function (
            checkpoint
        ) {

            const checkpointTime =
                target.totalSeconds *
                (
                    checkpoint /
                    target.distance
                );


            const row =
                createSplitRow(
                    checkpoint,
                    checkpointTime,
                    target.unit,
                    false
                );


            splitRows.appendChild(
                row
            );

        }
    );


    const finishRow =
        createSplitRow(
            target.distance,
            target.totalSeconds,
            target.unit,
            true
        );


    splitRows.appendChild(
        finishRow
    );


    const unitWord =
        target.unit ===
        "miles"

            ? "mile"

            : "kilometre";


    if (
        showEverySplit
    ) {

        splitSummary.textContent =
            "Showing every " +
            unitWord +
            " split.";

    } else {

        splitSummary.textContent =
            "Showing key race checkpoints.";

    }

}



function selectPreset(
    button
) {

    if (
        button.dataset.custom ===
        "true"
    ) {

        removeActive(
            presetButtons
        );


        button.classList.add(
            "active"
        );


        distanceInput.focus();

        distanceInput.select();


        return;

    }


    distanceInput.value =
        button.dataset.distance;


    distanceUnitInput.value =
        "km";


    calculatePace();

}



function selectTargetPreset(
    button
) {

    if (
        button.dataset.targetCustom ===
        "true"
    ) {

        removeActive(
            targetPresetButtons
        );


        button.classList.add(
            "active"
        );


        targetDistanceInput.focus();

        targetDistanceInput.select();


        return;

    }


    targetDistanceInput.value =
        button.dataset.targetDistance;


    targetDistanceUnitInput.value =
        "km";


    calculateTargetPace();

}



function resetStrideMetrics() {

    distanceInput.value =
        "10";


    distanceUnitInput.value =
        "km";


    hoursInput.value =
        "0";


    minutesInput.value =
        "45";


    secondsInput.value =
        "0";


    localStorage.removeItem(
        "strideMetricsInputs"
    );


    calculatePace();


    savedMessage.textContent =
        "Reset to default 10K in 45:00.";

}



function resetTargetCalculator() {

    targetDistanceInput.value =
        "21.0975";


    targetDistanceUnitInput.value =
        "km";


    targetHoursInput.value =
        "1";


    targetMinutesInput.value =
        "40";


    targetSecondsInput.value =
        "0";


    showEverySplit =
        false;


    splitToggle.textContent =
        "Show every split";


    calculateTargetPace();

}



function toggleSplits() {

    showEverySplit =
        !showEverySplit;


    splitToggle.textContent =
        showEverySplit

            ? "Show key splits"

            : "Show every split";


    const target =
        getTargetValues();


    if (
        !target.error
    ) {

        renderSplits(
            target
        );

    }

}



function getRunSummary() {

    calculatePace();


    const distance =
        distanceInput.value;


    const unitLabel =
        distanceUnitInput.value ===
        "miles"

            ? "miles"

            : "km";


    const totalSeconds =
        (
            Number(
                hoursInput.value
            ) *
            3600
        ) +
        (
            Number(
                minutesInput.value
            ) *
            60
        ) +
        Number(
            secondsInput.value
        );


    const lines = [

        "GetYourStrideMetrics – Run Analysis",

        "",

        distance +
        " " +
        unitLabel +
        " in " +
        formatTime(
            totalSeconds
        ),

        "",

        "Pace: " +
        document
            .getElementById(
                "paceKmResult"
            )
            .textContent +
        " · " +
        document
            .getElementById(
                "paceMileResult"
            )
            .textContent,

        "Speed: " +
        document
            .getElementById(
                "kmhResult"
            )
            .textContent +
        " · " +
        document
            .getElementById(
                "mphResult"
            )
            .textContent,

        "",

        "Predicted race times:",

        "5K – " +
        document
            .getElementById(
                "predicted5k"
            )
            .textContent,

        "10K – " +
        document
            .getElementById(
                "predicted10k"
            )
            .textContent,

        "Half marathon – " +
        document
            .getElementById(
                "predictedHalf"
            )
            .textContent,

        "Marathon – " +
        document
            .getElementById(
                "predictedMarathon"
            )
            .textContent,

        "",

        "getyourstridemetrics.com"

    ];


    return lines.join(
        "\n"
    );

}



function getRacePlanSummary() {

    calculateTargetPace();


    const target =
        getTargetValues();


    if (
        target.error
    ) {

        return "";

    }


    const unitLabel =
        target.unit ===
        "miles"

            ? "miles"

            : "km";


    const lines = [

        "GetYourStrideMetrics – Race Plan",

        "",

        "Target: " +
        target.distance +
        " " +
        unitLabel +
        " in " +
        formatTime(
            target.totalSeconds
        ),

        "",

        "Required pace: " +
        document
            .getElementById(
                "targetPaceKm"
            )
            .textContent +
        " · " +
        document
            .getElementById(
                "targetPaceMile"
            )
            .textContent,

        "Average speed: " +
        document
            .getElementById(
                "targetKmh"
            )
            .textContent +
        " · " +
        document
            .getElementById(
                "targetMph"
            )
            .textContent,

        "",

        showEverySplit
            ? "Every split:"
            : "Key race splits:"

    ];


    const rows =
        splitRows.querySelectorAll(
            ".split-row"
        );


    rows.forEach(
        function (
            row
        ) {

            const distanceCell =
                row.querySelector(
                    ".split-distance"
                );


            const timeCell =
                row.querySelector(
                    ".split-time"
                );


            if (
                distanceCell &&
                timeCell
            ) {

                lines.push(
                    distanceCell.textContent +
                    " – " +
                    timeCell.textContent
                );

            }

        }
    );


    lines.push(
        "",
        "getyourstridemetrics.com"
    );


    return lines.join(
        "\n"
    );

}



function showActionMessage(
    element,
    message
) {

    element.textContent =
        message;


    element.style.display =
        "block";


    window.setTimeout(
        function () {

            element.style.display =
                "none";

        },
        3000
    );

}



async function copyText(
    text
) {

    if (
        navigator.clipboard &&
        window.isSecureContext
    ) {

        await navigator.clipboard.writeText(
            text
        );


        return;

    }


    const textarea =
        document.createElement(
            "textarea"
        );


    textarea.value =
        text;


    textarea.style.position =
        "fixed";


    textarea.style.opacity =
        "0";


    document.body.appendChild(
        textarea
    );


    textarea.focus();

    textarea.select();


    document.execCommand(
        "copy"
    );


    textarea.remove();

}



async function shareText(
    title,
    text,
    messageElement
) {

    if (
        navigator.share
    ) {

        try {

            await navigator.share({
                title:
                    title,

                text:
                    text
            });


            showActionMessage(
                messageElement,
                "Share menu opened."
            );


            return;

        } catch (
            error
        ) {

            if (
                error.name ===
                "AbortError"
            ) {

                return;

            }

        }

    }


    try {

        await copyText(
            text
        );


        showActionMessage(
            messageElement,
            "Sharing isn't available here, so the summary was copied instead."
        );

    } catch (
        error
    ) {

        showActionMessage(
            messageElement,
            "Unable to share or copy the summary."
        );

    }

}



calculateButton.addEventListener(
    "click",
    calculatePace
);


resetButton.addEventListener(
    "click",
    resetStrideMetrics
);


themeToggle.addEventListener(
    "click",
    toggleTheme
);


calculateTargetButton.addEventListener(
    "click",
    calculateTargetPace
);


resetTargetButton.addEventListener(
    "click",
    resetTargetCalculator
);


splitToggle.addEventListener(
    "click",
    toggleSplits
);



copyRunButton.addEventListener(
    "click",
    async function () {

        try {

            await copyText(
                getRunSummary()
            );


            showActionMessage(
                runActionMessage,
                "Run summary copied."
            );

        } catch (
            error
        ) {

            showActionMessage(
                runActionMessage,
                "Unable to copy the run summary."
            );

        }

    }
);



shareRunButton.addEventListener(
    "click",
    function () {

        shareText(
            "GetYourStrideMetrics – Run Analysis",
            getRunSummary(),
            runActionMessage
        );

    }
);



copyRacePlanButton.addEventListener(
    "click",
    async function () {

        try {

            await copyText(
                getRacePlanSummary()
            );


            showActionMessage(
                raceActionMessage,
                "Race plan copied."
            );

        } catch (
            error
        ) {

            showActionMessage(
                raceActionMessage,
                "Unable to copy the race plan."
            );

        }

    }
);



shareRacePlanButton.addEventListener(
    "click",
    function () {

        shareText(
            "GetYourStrideMetrics – Race Plan",
            getRacePlanSummary(),
            raceActionMessage
        );

    }
);



presetButtons.forEach(
    function (
        button
    ) {

        button.addEventListener(
            "click",
            function () {

                selectPreset(
                    button
                );

            }
        );

    }
);



targetPresetButtons.forEach(
    function (
        button
    ) {

        button.addEventListener(
            "click",
            function () {

                selectTargetPreset(
                    button
                );

            }
        );

    }
);



distanceInput.addEventListener(
    "input",
    updatePresetSelection
);


targetDistanceInput.addEventListener(
    "input",
    updateTargetPresetSelection
);



distanceUnitInput.addEventListener(
    "change",
    function () {

        updatePresetSelection();

        calculatePace();

    }
);


targetDistanceUnitInput.addEventListener(
    "change",
    function () {

        updateTargetPresetSelection();

        calculateTargetPace();

    }
);



const enterInputs = [
    distanceInput,
    hoursInput,
    minutesInput,
    secondsInput
];


enterInputs.forEach(
    function (
        input
    ) {

        input.addEventListener(
            "keydown",
            function (
                event
            ) {

                if (
                    event.key ===
                    "Enter"
                ) {

                    calculatePace();

                }

            }
        );

    }
);



const targetEnterInputs = [
    targetDistanceInput,
    targetHoursInput,
    targetMinutesInput,
    targetSecondsInput
];


targetEnterInputs.forEach(
    function (
        input
    ) {

        input.addEventListener(
            "keydown",
            function (
                event
            ) {

                if (
                    event.key ===
                    "Enter"
                ) {

                    calculateTargetPace();

                }

            }
        );

    }
);



loadTheme();

loadSavedInputs();

calculatePace();

calculateTargetPace();