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
  document.getElementById("settingsBody").innerHTML = `
  <h2>Change Username?</h2>
  
  <div 
    style="
        display: flex;
        flex-direction: column;
        align-items: center;
        row-gap: 20px;
        ">

    <input></input>
    <button class="btn">change username</button>
  </div>


`;
}

function resetSettingsBody() {
  document.getElementById("settingsBody").innerHTML = `
 <button class="btn">
            <a href="../mainMenuPage/mainMenu.html">Main Menu</a>
          </button>
          <button class="btn" onclick="deleteUserDialog()">
            Delete Account
          </button>
          <button class="btn" onclick="changeUsernameDialog()">
            Change Name
          </button>
          <button class="btn" onclick="logoutUser()">
            <a href="../loginPage/login.html">Log Out</a>
          </button>


`;
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
