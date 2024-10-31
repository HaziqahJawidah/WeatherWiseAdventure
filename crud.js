const {app, BrowserWindow} = require('electron');
const fs = require('fs');
const path = require('path');

// Define the directory for storing activity files
const activitiesDir = path.join(__dirname, 'activities');

// Ensure the activities directory exists
if (!fs.existsSync(activitiesDir)) {
  fs.mkdirSync(activitiesDir);
}

// Function to create a new activity
function createActivity() {
  const activityName = document.getElementById("activityDropdown").value.trim() || document.getElementById("activityName").value.trim();
  const equipment = document.getElementById("equipmentList").value.split(',').map(item => item.trim());
  const description = document.getElementById("activityDescription").value.trim();

  if (!activityName || equipment.length === 0 || !description) {
    displayOutput("Please provide an activity name, equipment list, and description.");
    return;
  }

  const filePath = path.join(activitiesDir, `${activityName}.json`);
  const activityData = { name: activityName, equipment: equipment, description: description };

  fs.writeFile(filePath, JSON.stringify(activityData), (err) => {
    if (err) return displayOutput(`Error creating activity: ${err}`);
    displayOutput("Activity created successfully!");
    refreshActivityDropdown();
  });
}

// Function to read an activity
function readActivity() {
  const activityName = document.getElementById("activityDropdown").value.trim();
  if (!activityName) {
    displayOutput("Please select an activity to read.");
    return;
  }
  
  const filePath = path.join(activitiesDir, `${activityName}.json`);

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) return displayOutput(`Error reading activity: ${err}`);
    const activity = JSON.parse(data);
    displayOutput(`Activity: ${activity.name}\nEquipment: ${activity.equipment.join(', ')}\nDescription: ${activity.description}`);
  });
}

// Function to update an activity
function updateActivity() {
  const activityName = document.getElementById("activityDropdown").value.trim();
  if (!activityName) {
    displayOutput("Please select an activity to update.");
    return;
  }
  
  const equipment = document.getElementById("equipmentList").value.split(',').map(item => item.trim());
  const description = document.getElementById("activityDescription").value.trim();
  const filePath = path.join(activitiesDir, `${activityName}.json`);

  const activityData = { name: activityName, equipment: equipment, description: description };

  fs.writeFile(filePath, JSON.stringify(activityData), (err) => {
    if (err) return displayOutput(`Error updating activity: ${err}`);
    displayOutput("Activity updated successfully!");
  });
}

// Function to delete an activity
function deleteActivity() {
  const activityName = document.getElementById("activityDropdown").value.trim();
  if (!activityName) {
    displayOutput("Please select an activity to delete.");
    return;
  }
  
  const filePath = path.join(activitiesDir, `${activityName}.json`);

  fs.unlink(filePath, (err) => {
    if (err) return displayOutput(`Error deleting activity: ${err}`);
    displayOutput("Activity deleted successfully!");
    refreshActivityDropdown();
  });
}

// Function to display messages in the output div
function displayOutput(message) {
  document.getElementById("output").innerText = message;
}

// Load dropdown options when the page loads
window.onload = refreshActivityDropdown;
