function Clicked() {
    const city = document.getElementById("city_input").value;

    fetch(`https://api.weatherapi.com/v1/forecast.json?key=8a9923495ea84f6f94105020241410&q=${city}`)
        .then((response) => response.json())
        .then((data) => {
            displayWeather(data);
            suggestActivities(data.current);
        })
        .catch(error => console.error('Error fetching weather data:', error));

        function displayWeather(data) {
        document.getElementById("icon").src = `https:${data.current.condition.icon}`; // Adds 'https:' for a complete URL
        document.getElementById("location").innerHTML = `Location: ${data.location.name}, ${data.location.region}, ${data.location.country}`;
        document.getElementById("localtime").innerHTML = `Local Time: ${data.location.localtime}`;
        document.getElementById("temperature").innerHTML = `Temperature: ${data.current.temp_c}°C (Feels like: ${data.current.feelslike_c}°C)`;
        document.getElementById("condition").innerHTML = `Condition: ${data.current.condition.text}`;
        document.getElementById("wind").innerHTML = `Wind Speed: ${data.current.wind_kph} kph`;
        document.getElementById("humidity").innerHTML = `Humidity: ${data.current.humidity}%`;
        document.getElementById("rainchance").innerHTML = `Chances of Rain: ${data.forecast.forecastday[0].day.daily_chance_of_rain}%`;
        document.getElementById("snowchance").innerHTML = `Chances of Snow: ${data.forecast.forecastday[0].day.daily_chance_of_snow}%`;

        // Display a warning message if rain or snow chance is high
        const warningMessage = document.getElementById("warningMessage");
        const rainChance = parseInt(data.forecast.forecastday[0].day.daily_chance_of_rain);
        const snowChance = parseInt(data.forecast.forecastday[0].day.daily_chance_of_snow);

        if (rainChance > 50 || snowChance > 50) {
            warningMessage.style.display = "block";
            if (rainChance > 50 && snowChance > 50) {
                warningMessage.innerHTML = "Warning: High chances of rain and snow. Be prepared!";
            }
            else if (rainChance > 50) {
                warningMessage.innerHTML = "Warning: High chance of rain. Consider bringing an umbrella or waterproof gear!";
            } 
            else if (snowChance > 50) {
                warningMessage.innerHTML = "Warning: High chance of snow. Pack warm clothing and winter gear!";
            }
        }
        else {
            warningMessage.style.display = "none";
        }
    }

    function suggestActivities(currentWeather) {
        const checklist = document.getElementById("activityChecklist");
        checklist.innerHTML = ""; // Clear existing checklist

        // Define possible activities based on weather conditions
        let activities = [];

        // Sunny and warm conditions or clear weather
        if (currentWeather.temp_c > 20 && (currentWeather.condition.text.includes("Sunny") || currentWeather.condition.text.includes("Clear") || (currentWeather.condition.text.includes("Partly cloudy")))) {
            activities = [
                { name: "Picnic", equipment: ["Blanket", "Sunscreen", "Food and drinks"] },
                { name: "Hiking", equipment: ["Hiking boots", "Water bottle", "Sunscreen"] },
                { name: "Beach Volleyball", equipment: ["Beach volleyball", "Swimwear", "Towel"] },
                { name: "Surfing", equipment: ["Surfboard", "Swimwear", "Sunscreen"] },
                { name: "Camping", equipment: ["Tent", "Sleeping bag", "Food and drinks", "Torchlight"]}
            ];
        }

        // Windy conditions
        if (currentWeather.wind_kph > 20) {
            activities = activities.concat([
                { name: "Paragliding", equipment: ["Paraglider", "Helmet", "Windbreaker jacket"] },
                { name: "Kite Surfing", equipment: ["Kiteboard", "Life jacket", "Wind-resistant gear"] }
            ]);
        }

        // Clear or partly cloudy conditions (suitable for stargazing)
        if (currentWeather.condition.text.includes("Partly cloudy") || currentWeather.condition.text.includes("Clear")) {
            activities = activities.concat([
                { name: "Stargazing", equipment: ["Telescope", "Blanket", "Warm clothing"] }
            ]);
        }

        // Cold or snowy conditions
        if (currentWeather.temp_c < 5 || currentWeather.condition.text.includes("Snow")) {
            activities = activities.concat([
                { name: "Snowboarding", equipment: ["Snowboard", "Helmet", "Warm clothing"] },
                { name: "Skiing", equipment: ["Snowboard", "Warm clothing", "Ski Poles"] }
            ]);
        }

        // Display activity images
        checklist.innerHTML += `<p>Select an activity to view the equipment checklist:</p>`;
        const activityContainer = document.createElement("div");
        activityContainer.id = "activityContainer";
        activityContainer.style.display = "grid";
        activityContainer.style.gridTemplateColumns = "repeat(auto-fill, minmax(100px, 1fr))";
        activityContainer.style.gap = "1rem";

        activities.forEach((activity, index) => {
            const img = document.createElement("img");
            img.src = "./images/" + activity.name.toLowerCase().replace(/\s+/g, '-') + ".jpeg"; // Ensure images are named like 'hiking.jpg', 'surfing.jpg', etc.
            img.alt = activity.name;
            img.className = "activity-image";
            img.style.width = "100%";
            img.style.cursor = "pointer";
            img.onclick = () => showChecklist(activities, index); // When clicked, show checklist for selected activity

            const label = document.createElement("p");
            label.textContent = activity.name;
            label.style.textAlign = "center";

            const container = document.createElement("div");
            container.style.textAlign = "center";
            container.appendChild(img);
            container.appendChild(label);

            activityContainer.appendChild(container);
        });

        checklist.appendChild(activityContainer);
    }

    function showChecklist(activities, selectedIndex) {
        const selectedActivity = activities[selectedIndex];
        const checklist = document.getElementById("activityChecklist");

        // Clear previous checklist and add new items
        const checklistItems = document.getElementById("equipmentList");
        if (checklistItems) checklistItems.remove();

        const equipmentList = document.createElement("ul");
        equipmentList.id = "equipmentList";
        equipmentList.innerHTML = `<h4>Equipment for ${selectedActivity.name}:</h4>`;
        selectedActivity.equipment.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            equipmentList.appendChild(li);
        });

        checklist.appendChild(equipmentList);
    }
}
