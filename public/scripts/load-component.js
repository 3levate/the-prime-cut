async function loadComponent(elementIDToAttachTo, url) {
  try {
    const response = await fetch(url);
    document.getElementById(elementIDToAttachTo).innerHTML = await response.text();
  } catch (error) {
    console.log(error.name);
    alert("Error: Please enable JavaScript to view this page.");
  }
}
