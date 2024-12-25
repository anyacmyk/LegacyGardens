/* This page is specifically for creating a new memorial garden and
has the dynamic input fields where users can add as many as they want
and then delete if there is too many. It transfers the data to be
read in the result.html page */

const CustomInputsContainer = document.getElementById("CustomInputs");
let inputCounter = 0; //Just counting the number of custom inputs

function createCustomInput(labelName) {
  inputCounter++;
  const newInputDiv = document.createElement("div");
  newInputDiv.classList.add("input-row");
  /* All parts of the cutom input botton, a lable, input box and delete button. Icon for trash is from Font Awesome */
  newInputDiv.innerHTML = `
                <label for="input${inputCounter}" contenteditable="false">${labelName}:</label>
                <input class = "input-field" type="text" id="input${inputCounter}" name="input${inputCounter}" placeholder="Enter ${labelName}">
                <button class="delete-btn" onclick="deleteInput(${inputCounter})">
                    <i class="fas fa-trash"></i>
                </button>
            `;
  newInputDiv.setAttribute("id", `input-row-${inputCounter}`);
  CustomInputsContainer.appendChild(newInputDiv);
}

/* Delete any input that has been added */
function deleteInput(inputId) {
  const inputDiv = document.getElementById(`input-row-${inputId}`);
  if (inputDiv) {
    inputDiv.remove();
  }
}

/* Just a button to add a new input field. Inspired by: https://stackoverflow.com/questions/51578629/how-can-i-put-an-input-in-the-alert-box */
document.getElementById("addInputButton").addEventListener("click", () => {
  const labelName = prompt("Enter the label for the new input:");
  if (labelName) {
    createCustomInput(labelName);
  }
});

/*Submit buttn that checks for picture and image then stores it to take to the result page */
document.getElementById("submitButton").addEventListener("click", () => {
  const picture = document.getElementById("pictureUpload").files[0];
  const name = document.getElementById("nameInput").value;

  /* If there isnt a picture or name, it will not let the user submit */
  if (!picture) {
    alert("Please upload an image.");
    return;
  }

  if (!name) {
    alert("Please enter a name.");
    return;
  }
  /* filereader is used to transfer the data*/
  const reader = new FileReader();
  reader.onload = function (event) {
    const imageDataUrl = event.target.result;

    /* Data to be transfered */
    const formData = {
      name: name,
      picture: imageDataUrl,
      fields: [],
    };

    /* Loops though the dynamic input fields to see the values and map them to a label */
    for (let i = 1; i <= inputCounter; i++) {
      const inputDiv = document.getElementById(`input-row-${i}`); //
      if (inputDiv) {
        const inputValue = document.getElementById(`input${i}`).value;
        const label = document
          .querySelector(`label[for="input${i}"]`)
          .innerText.replace(":", "");
        formData.fields.push({ label, value: inputValue });
      }
    }

    /* Save formdata to local storage */
    localStorage.setItem("formData", JSON.stringify(formData));
    window.location.href = "result.html";
  };

  reader.readAsDataURL(picture);
});
