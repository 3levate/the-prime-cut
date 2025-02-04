const maxWidthQuery = window.matchMedia("(min-width: 1281px) and (max-width: 2400px)");
const smallerWidthsQuery = window.matchMedia("(max-width: 1280px)");
const navContactClone = document.getElementById("nav-additional-info");
const newsletterClone = document.getElementById("newsletter");

function checkForMaxWidthMedia(mediaQuery) {
  const container = document.querySelector("#container");
  const steaksGallery = document.querySelector(".steaks-gallery");
  const steaksBanner = document.querySelector("#steaks-banner");
  let steaks = document.querySelector(".steaks");
  let headerWrapper = document.getElementById("header-wrapper");
  const header = document.querySelector("header");
  console.log("header children", header.children);

  //if it is max width screen size then ensure steaks for flexbox with gallery and banner
  if (mediaQuery.matches) {
    const navList = document.getElementById("nav-list");
    navList.style.height = "auto";

    if (!steaks) {
      steaks = document.createElement("div");
      steaks.classList.add("steaks");
      container.appendChild(steaks);
      console.log("created steaks");
    }
    if (!steaks.contains(steaksGallery) && !steaks.contains(steaksBanner)) {
      steaks.appendChild(steaksGallery);
      steaks.appendChild(steaksBanner);
      console.log("added steaks gallery and steaks-banner to steaks");
    }

    if (!document.getElementById("nav-additional-info")) {
      header.appendChild(navContactClone);
    }

    if (!headerWrapper) {
      headerWrapper = document.createElement("div");
      headerWrapper.setAttribute("id", "header-wrapper");
      headerWrapper.style.position = "sticky";
      headerWrapper.style.top = "0";
      headerWrapper.style.paddingTop = "20px";

      headerWrapper.appendChild(document.querySelector("#nav > a"));
      headerWrapper.appendChild(document.getElementById("nav-list"));
      headerWrapper.appendChild(document.getElementById("nav-additional-info"));

      header.insertBefore(headerWrapper, null);
    }
  } else if (steaks) {
    container.insertBefore(steaksGallery, steaks);
    container.insertBefore(steaksBanner, steaks);
    steaks.remove();
    console.log("removed steaks");
  }
}

function checkForSmallerMedia(smallerMediaQuery) {
  console.log("checkForSmallerMedia called");
  if (smallerMediaQuery.matches) {
    console.log("smallerMediaQuery matches");
    const header = document.querySelector("header");
    const navContact = document.getElementById("nav-additional-info");
    const headerWrapper = document.getElementById("header-wrapper");

    if (navContact) {
      navContact.remove();
      console.log("removed nav-additional-info");
    }

    if (headerWrapper) {
      header.appendChild(document.querySelector("#header-wrapper > a"));
      header.appendChild(document.getElementById("nav-list"));
      headerWrapper.remove();
      console.log("removed header-wrapper");
    }
  }
}

checkForMaxWidthMedia(maxWidthQuery);
checkForSmallerMedia(smallerWidthsQuery);
maxWidthQuery.addListener(checkForMaxWidthMedia);
smallerWidthsQuery.addListener(checkForSmallerMedia);
