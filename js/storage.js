function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser anda tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event("ondatasaved"));
  }
}

function loadDatafromStorage() {
  if (isStorageExist()) {
    const serializedData = localStorage.getItem(STORAGE_KEY);

    let data = JSON.parse(serializedData);

    if (data !== null) {
      books = data;
      document.dispatchEvent(new Event(RENDER_EVENT));
    }
  }
}

document.addEventListener("ondatasaved", () => {
  console.log("Data Berhasil Disimpan!");
});
