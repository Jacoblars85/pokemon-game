// fetchUser()

function goToSettings() {
  window.location.href =
    "/Users/jacoblars85/Desktop/code/fun/projects/pokemon-game/public/scripts/settingsPage/settings.html";
}

function openSettingsDialog() {
  moving = false;

  document.getElementById("settingsInterfacePopUp").style.display = "flex";
}

function closeSettingsDialog() {
  moving = true;

  document.getElementById("settingsInterfacePopUp").style.display = "none";
}