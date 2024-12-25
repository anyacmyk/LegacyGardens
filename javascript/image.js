/* This page is used to filter out information transfered from
the URL query and display it specifically for a solider.
There is also the functions that make the flowers draggable,
clonable or duplicatable and removable. */

/*Waits for the document to load first */
document.addEventListener("DOMContentLoaded", function () {
  /* Gets query parameters from the URL */
  var urlParams = new URLSearchParams(window.location.search);
  var imageUrl = urlParams.get("img");
  var title = urlParams.get("title");
  var description = urlParams.get("description");
  var subject = urlParams.get("subject");

  /* Just the name as parts were sepearated by a comma */
  title = title.split(",")[0];

  let serviceNumber = null; 
  let militaryDetails = null; 
  let fullName = null;

  /* Regex was inspired by the task in Week08 Blackboard */

  /* Breaks apart the description string to get a service number */
  /* Some of the entried only had a service number and it was differently formatted */
  if (description) {
    let match = description.match(/Service number[\s\W]*(\d+)/i);
    /* If there actually is a service number that the code has found*/
    if (match) {
      serviceNumber = match[1];
    }
  }

  /* Same as previous but checks for a certain string
  This one was present whenever they would be a service number and name */
  if (description) {
    let match = description.match(
      /Full name and Service Number \(from National Archives of Australia\): ([^,]+),\s*Service Number[\s\W]*(\d+)/i
    );
    if (match) {
      fullName =
        match[1].trim(); /* Full Name from the description if provided */
      serviceNumber = match[2]; /* In case the first one didnt work, this kind of is here as backup */
    }

    /* Some descriptions had additional military details, this will extract the data */
    let militaryMatch = description.match(/Military details[\s\W]*([^,\n-]+)/i);
    if (militaryMatch) {
      militaryDetails = militaryMatch[1].trim();
    }
  }
  /* End regex from the Blackboard */

  /* This section just adds the elements for each image from the url parameters */
  if (imageUrl) {
    document.getElementById("displayed-image").src = imageUrl;
  }
  if (title) {
    document.getElementById("image-title").textContent = title;
  }
  if (subject) {
    document.getElementById("image-description").textContent =
      "Source: " + subject;
  }
  if (serviceNumber) {
    document.getElementById("image-servicenumber").textContent =
      "Service Number: " + serviceNumber;
  }
  if (militaryDetails) {
    document.getElementById("image-militarydetails").textContent =
      "Military Details: " + militaryDetails;
  }
  if (fullName) {
    document.getElementById("image-fullname").textContent =
      "Full Name: " + fullName;
  }

  /* If no name, details or service number are provided, it will show "No Additional Data Provided "*/
  if (!fullName && !militaryDetails && !serviceNumber) {
    document.getElementById("image-nocontent").textContent =
      "No Additional Data Provided.";
  }
});


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
