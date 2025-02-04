//TODO get nav list height each call
//TODO why is nav list height getting changed

const navListNormalDistanceToTopOfViewport =
  document.getElementById("nav-list").getBoundingClientRect().top + window.scrollY;
const navlistOffsetHeight_Static = document
  .getElementById("nav-list")
  .getBoundingClientRect().height;
console.log("navlistOffsetHeight_Static", navlistOffsetHeight_Static);

function stickyNav() {
  const navList = document.getElementById("nav-list");
  const smallerWidthsQuery = window.matchMedia("(min-width: 701px) and (max-width: 1280px)");
  const mobileWidthsQuery = window.matchMedia("(min-width: 251px) and (max-width: 700px)");
  let placeholder = document.getElementById("placeholder");

  if (
    window.scrollY >= navListNormalDistanceToTopOfViewport &&
    (smallerWidthsQuery.matches || mobileWidthsQuery.matches)
  ) {
    navList.style.position = "fixed";
    navList.style.top = "0";
    navList.style.zIndex = "9999";
    let height, placeholderHeight;

    if (smallerWidthsQuery.matches) {
      height = "80px";
      placeholderHeight = "100px";
    } else if (mobileWidthsQuery.matches) {
      height = `${navlistOffsetHeight_Static - 20}px`;
      placeholderHeight = `${navlistOffsetHeight_Static - 20}px`;
    }

    navList.style.height = height;

    if (!placeholder) {
      placeholder = document.createElement("div");
      placeholder.setAttribute("id", "placeholder");
      placeholder.style.height = placeholderHeight;
      navList.parentNode.insertBefore(placeholder, navList);
    }
  } else {
    navList.style.position = "static";
    if (placeholder) placeholder.remove();
  }
}

stickyNav();
document.addEventListener("scroll", stickyNav);
