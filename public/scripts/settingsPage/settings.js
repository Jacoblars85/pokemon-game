function deleteUserDialog() {
  document.getElementById("settingsBody").innerHTML = `
    <div 
      style="
          display: flex;
          flex-direction: column;
          align-items: center;
          row-gap: 20px;
          ">

      <h2>Are You Sure?</h2>

      <button onclick="deleteUser()" class="btn">delete account</button>
    </div>
    
    <button
      class="btn"
      style="position: absolute; top: 0.5%; left: 0.5%; margin: 0"
      onclick="resetSettingsBody()"
    >
      <--
    </button>
  `;
}

function changeUsernameDialog() {
  document.getElementById("settingsBody").innerHTML = `
  <h2>Change Username</h2>
  
  <form 
    onSubmit="changeUsername(event)"
    style="
      display: flex;
      flex-direction: column;
      align-items: center;
      row-gap: 20px;
      ">

    <input
    id="changeUsernameInput"
      placeholder="username"
      type="text"
      name="username"
      required
    ></input>

    <button class="btn">change username</button>
  </form>

  <button
    class="btn"
    style="position: absolute; top: 0.5%; left: 0.5%; margin: 0"
    onclick="resetSettingsBody()"
  >
    <--
  </button>
`;
}

// function resetSettingsBody() {
//   document.getElementById("settingsBody").innerHTML = `
//  <button class="btn">
//             <a href="../mainMenuPage/mainMenu.html">Main Menu</a>
//           </button>
//           <button class="btn" onclick="deleteUserDialog()">
//             Delete Account
//           </button>
//           <button class="btn" onclick="changeUsernameDialog()">
//             Change Name
//           </button>
//           <button class="btn" onclick="logoutUser()">
//             <a href="../loginPage/login.html">Log Out</a>
//           </button>


// `;
// }

function goBackButton() {
  window.history.back();
}

function openSettingsDialog() {
  moving = false;

  document.getElementById("settingsOverlay").style.display = "flex";
}

function closeSettingsDialog() {
  moving = true;

  document.getElementById("settingsOverlay").style.display = "none";

  resetSettingsBody();
}

document.getElementById("settingsOverlay").addEventListener("click", (event) => {
  const popup = document.getElementById("settingsInterfacePopUp");

  // Only close if clicking directly on the overlay (not inside the popup)
  if (!popup.contains(event.target)) {
    closeSettingsDialog();
  }
});

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