function deleteUserDialog() {
  document.getElementById("settingsBody").innerHTML = `
    <h2>Are You Sure?</h2>
    
    <div 
      style="
          display: flex;
          flex-direction: column;
          align-items: center;
          row-gap: 20px;
          ">
      <button class="btn">delete account</button>
      <button class="btn">back</button>
    </div>
  `;
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
