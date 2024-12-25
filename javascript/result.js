/* This code is very simmilar to the one found in image.js 
but also contains the code to recieve data from local storage
to display as part of a page for custom inputs.
 */

// Retrieve the form data from localStorage, code inspired by: https://davitdvalashvili1996.medium.com/local-storage-in-javascript-f7aad374980e
const formData = JSON.parse(localStorage.getItem("formData"));

if (formData) {
  /*Existing fields*/
  document.getElementById("resultName").innerText = formData.name;
  document.getElementById("displayed-image").src = formData.picture;

  /*These are for the cutom results fields*/
  const fieldsContainer = document.getElementById("resultFields");
  formData.fields.forEach((field) => {
    const fieldElement = document.createElement("p");
    fieldElement.innerText = `${field.label}: ${field.value}`;
    fieldsContainer.appendChild(fieldElement);
  });
}

/* This code snipped uses https://www.w3schools.com/howto/howto_js_draggable.asp 
and https://palettes.shecodes.io/athena/42375-how-to-make-a-copy-of-an-image-in-html-using-javascript. 
They were combined to make an image clone whern clicking, then the ability to 
move it anywhere on the screen. In addition, a button to delete the elemetns that we created */

document.addEventListener("DOMContentLoaded", () => {
  /* Get all elements with 'flower' and add them to a variable */
  const flowers = document.querySelectorAll(".flower");
  const container = document.getElementById("draggable-container");
  const removeButton = document.getElementById("remove-clones");

  function createClone(event) {
    /* Stops default event bahaviour */
    event.preventDefault();

    /* Add the clone */
    const clone = event.target.cloneNode(true);
    clone.classList.add("cloned-image");
    clone.src = event.target.src;

    /*Position the clone in the middle of the screen */
    const containerRect = container.getBoundingClientRect();
    const cloneRect = clone.getBoundingClientRect();
    const centerX = containerRect.width / 2 - cloneRect.width / 2;
    const centerY = containerRect.height / 2 - cloneRect.height / 2;

    /* Little bit of styling for the clone */
    clone.style.left = `${centerX}px`;
    clone.style.top = `${centerY}px`;
    clone.style.zIndex = "1000";

    container.appendChild(clone);

    /* That part is for when the user goes to move it */
    clone.addEventListener("mousedown", function (e) {
      e.preventDefault();

      let offsetX = e.clientX - clone.getBoundingClientRect().left;
      let offsetY = e.clientY - clone.getBoundingClientRect().top;

      function onMouseMove(e) {
        clone.style.left = `${
          e.clientX - offsetX - container.getBoundingClientRect().left
        }px`;
        clone.style.top = `${
          e.clientY - offsetY - container.getBoundingClientRect().top
        }px`;
      }

      /* Stops the moving sequence because user is not pressing down on the flower */
      function onMouseUp() {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      }

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });
  }

  /* This part calls the function whern the flower has been clicked */
  flowers.forEach((flower) => {
    flower.addEventListener("click", createClone);
  });

  /* The remove button that removes all the clones when clicked */
  removeButton.addEventListener("click", function () {
    const clones = document.querySelectorAll(".cloned-image");
    clones.forEach((clone) => clone.remove());
  });
});
