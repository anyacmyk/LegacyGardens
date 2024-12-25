/* This was the first javascript file and is used to call
the state library or queensland government API, filter the data
then display it as a grid on the main page. */

/*List of solider names, this helps with finding duplicates */
let soliderNames = [];

function iterateRecords(data) {
  console.log(data);

  $.each(data.result.records, function (recordKey, recordValue) {
    var recordTitle = recordValue["title"];
    var recordImage = recordValue["1000_pixel"];
    var recordDescription = recordValue["decsription"];
    var recordSubject = recordValue["subject"];

    if (
      recordSubject &&
      recordSubject.includes("soldiers - portraits ") &&
      recordImage
    ) {
      /* This interactions with the 'title' column of the data */
      /* Sometimes a record title would include a dash or a underscore so this code helps to remove that. */
      if (recordTitle.includes("- ")) {
        recordTitle = recordTitle.replace("- ", "");
      }

      if (recordTitle.includes("_")) {
        recordTitle = recordTitle.replace("_", "");
      }

      var name = recordTitle.split(",")[0];

      var soldierData = recordDescription.split("-");

      /* This interaction is with the "description" column of the data as this can contain a longer solider name */
      /* For these longer names, they are after "Full name and Service Number (from National Archives of Australia):" so this code extracts it*/
      for (let i = 0; i < soldierData.length; i++) {
        console.log(soldierData[i]);
        if (
          soldierData[i].includes(
            "Full name and Service Number (from National Archives of Australia):"
          )
        ) {
          var splitsoldierData = soldierData[i].split(",");
          name = splitsoldierData[0].replace(
            "Full name and Service Number (from National Archives of Australia):",
            ""
          );
        }
      }

      /* This checks if the image contains .jpg as some didn't. This would make the image not display properly.*/
      /* Also checks if the name is already shown. Some had multiple different entries and would display twice */
      if (recordImage.includes(".jpg") && !soliderNames.includes(name)) {
        $("#gridpart").append(
          $('<div class="grid-item">').append(
            $('<div class="grid-item-inner">').append(
              $('<div class="grid-item-front">').append(
                $("<img>").attr("src", recordImage)
              ),

              $('<div class="grid-item-back">').append(
                $("<a>")
                  .attr(
                    "href",
                    "image.html?img=" +
                      encodeURIComponent(
                        recordImage
                      ) /* Add data to the URL so it can be accessed in the image page*/ +
                      "&title=" +
                      encodeURIComponent(recordTitle) +
                      "&subject=" +
                      encodeURIComponent(recordSubject) +
                      "&description=" +
                      encodeURIComponent(recordDescription)
                  )

                  .attr("target", "_blank")
                  .append($("<h2>").text(name))
              )
            )
          )
        );
      }
      soliderNames.push(name); //Adds the name to the list of solider names
    }
  });

  $("#search-count").hide();

  /* This code was sourced from Blackboard, code to make the search term case insensitive and to remove the filter count when not searching was added after to make it better*/
  $("#search-text").keyup(function () {
    var searchTerm = $(this).val().toLowerCase();
    console.log(searchTerm);

    /*if there is no search, then the count will not show*/
    if (searchTerm === "") {
      $(".grid-item").show();
      $("#search-count").hide();
    } else {
      $(
        ".grid-item"
      ).hide(); /* Hide all grid items and show what contains the search term*/
      $(".grid-item")
        .filter(function () {
          return $(this).text().toLowerCase().includes(searchTerm);
        })
        .show();

      $("#search-count").show();
    }

    $("#search-count strong").text($(".grid-item:visible").length);
  });
}

$(document).ready(function () {
  var slqData = JSON.parse(localStorage.getItem("slqData"));
  var href = "";

  /* This code snipped was sourced from Week 6 Blackboard. */
  if (slqData) {
    iterateRecords(slqData);

    setTimeout(function () {
      $("body").addClass("loaded");
    }, 1000); 
  } else {
    var data = {
      resource_id: "2ac90530-58a0-4594-b6a2-04cc5c75114b",
      limit: 500,
      q: href,
    };

    /* This ajax was sourced from State Library: https://data.gov.au/dataset/ds-qld-6b3dc1c0-4ca3-48f4-8524-3731285cc412/details?q= */
    $.ajax({
      url: "https://data.qld.gov.au/api/3/action/datastore_search",
      data: data,
      dataType: "jsonp", // Use JSONP to avoid cross-origin issues
      cache: true,
      success: function (data) {
        localStorage.setItem("slqData", JSON.stringify(data));
        iterateRecords(data);

        setTimeout(function () {
          $("body").addClass("loaded");
        }, 1000); 
      },
    });
    /* End code snippets */
  }
});

requestAnimationFrame(onScroll);
