chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension Installed!");
  });
  
  chrome.alarms.create("reminder", { periodInMinutes: 1 });
  
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "reminder") {
      console.log("Reminder alarm triggered!");
    }
  });

  chrome.action.onClicked.addListener(() => {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon.png",
      title: "Welcome to custom chrome extensions!",
      message: "This is a notification from your custom chrome extensions ."
    });
  });
  
  