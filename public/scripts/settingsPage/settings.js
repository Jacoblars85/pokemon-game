function deleteUserDialog() {
  console.log("trying to delete user");
}

function goToMainMenu() {
  console.log("trying to go to main menu");
}

function changeUsernameDialog() {
  console.log("trying to change users name");
}

function goBackButton() {
  window.history.back();
}

function openSettingsDialog() {
  moving = false;

  document.getElementById("settingsInterfacePopUp").style.display = "flex";
}

function closeSettingsDialog() {
  moving = true;

  document.getElementById("settingsInterfacePopUp").style.display = "none";
}
