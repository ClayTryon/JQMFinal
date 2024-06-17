$(document).ready(function () {
    // Function to fetch and display workout data
    function loadWorkouts() {
        $.ajax({
            url: '/getCurrentWorkout',
            method: 'GET',
            success: function (data) {
                populateList('#workoutList', data, 'workoutDate');
            },
            error: function () {
                alert('Failed to load workout data');
            }
        });
    }

    // Function to fetch and display nutrition data
    function loadNutrition() {
        $.ajax({
            url: '/getCurrentNutrition',
            method: 'GET',
            success: function (data) {
                populateList('#nutritionList', data, 'nutritionDate');
            },
            error: function () {
                alert('Failed to load nutrition data');
            }
        });
    }

    // Function to dynamically populate list with dates
    function populateList(listSelector, data, dateKey) {
        var list = $(listSelector);
        list.empty(); // Clear the existing list items

        // Group data by date
        var groupedData = data.reduce((acc, item) => {
            const date = item[dateKey];
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(item);
            return acc;
        }, {});

        Object.keys(groupedData).forEach(function (date) {
            var listItem = $('<li></li>')
                .text(date)
                .attr('data-date', date) // Store the date in the data attribute
                .addClass('ui-btn'); // Add class for JQM styling

            listItem.click(function () {
                displayDetails(groupedData[date]);
            });

            list.append(listItem);
        });

        list.listview('refresh'); // Refresh the JQM listview
    }

    // Function to display detailed information in a more readable format
    function displayDetails(items) {
        const details = items.map(item => {
            if (item.workoutDate) {
                return `Workout Date: ${item.workoutDate}\nWorkout Type: ${item.workoutType}\nWorkout Time: ${item.workoutMinutes} Minutes\nCalories Burnt: ${item.caloriesBurnt}`;
            } else if (item.nutritionDate) {
                return `Nutrition Date: ${item.nutritionDate}\nFood Eaten: ${item.foodEaten}\nMeal Type: ${item.mealType}\nCalories Consumed: ${item.nutritionCalories}`;
            }
        }).join('\n\n');
        alert(details);
    }

    // Function to clear form fields and reload data
    function clearFormFieldsAndReload() {
        document.getElementById("workoutMinutes").value = "";
        document.getElementById("workoutType").value = "";
        document.getElementById("workoutDate").value = "";
        document.getElementById("caloriesBurnt").value = "";

        document.getElementById("foodEaten").value = "";
        document.getElementById("meals").value = "";
        document.getElementById("nutritionDate").value = "";
        document.getElementById("nutritionCalories").value = "";

        // Reload data to update the lists
        loadWorkouts();
        loadNutrition();
    }

    // Save workout data
    function saveWorkout() {
        const workoutMinutes = document.getElementById("workoutMinutes").value.trim();
        const workoutType = document.getElementById("workoutType").value.trim();
        const workoutDate = document.getElementById("workoutDate").value.trim();
        const caloriesBurnt = document.getElementById("caloriesBurnt").value.trim();

        const workoutData = {
            workoutMinutes: Number(workoutMinutes),
            workoutType: workoutType,
            workoutDate: workoutDate,
            caloriesBurnt: Number(caloriesBurnt)
        };

        $.ajax({
            url: '/saveWorkout',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(workoutData),
            success: function () {
                alert('Workout data saved successfully');
                clearFormFieldsAndReload();
            },
            error: function () {
                alert('Failed to save workout data');
            }
        });
    }

    // Save nutrition data
    function saveNutrition() {
        const foodEaten = document.getElementById("foodEaten").value.trim();
        const mealType = document.getElementById("meals").value.trim();
        const nutritionDate = document.getElementById("nutritionDate").value.trim();
        const nutritionCalories = document.getElementById("nutritionCalories").value.trim();

        const nutritionData = {
            foodEaten: foodEaten,
            mealType: mealType,
            nutritionDate: nutritionDate,
            nutritionCalories: Number(nutritionCalories)
        };

        $.ajax({
            url: '/saveNutrition',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(nutritionData),
            success: function () {
                alert('Nutrition data saved successfully');
                clearFormFieldsAndReload();
            },
            error: function () {
                alert('Failed to save nutrition data');
            }
        });
    }

    // Attach event listeners to buttons
    const submitWorkoutButton = document.getElementById("submitWorkout");
    if (submitWorkoutButton) {
        submitWorkoutButton.addEventListener("click", saveWorkout);
    }

    const submitNutritionButton = document.getElementById("submitNutrition");
    if (submitNutritionButton) {
        submitNutritionButton.addEventListener("click", saveNutrition);
    }

    // Load data on page load
    loadWorkouts();
    loadNutrition();
});
