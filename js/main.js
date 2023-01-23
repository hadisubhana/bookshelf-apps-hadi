document.addEventListener("DOMContentLoaded", function () {
  const inputBookForm = document.getElementById("inputBook");

  inputBookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  const searchBook = document.getElementById("searchBook");

  searchBook.addEventListener("submit", function (event) {
    event.preventDefault();
    search();
  });

  loadDatafromStorage();
});

document.addEventListener(RENDER_EVENT, function () {
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  incompleteBookshelfList.innerHTML = "";

  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );
  completeBookshelfList.innerHTML = "";

  for (const book of books) {
    const bookElement = makeBook(book);

    if (!book.isComplete) {
      incompleteBookshelfList.append(bookElement);
    } else {
      completeBookshelfList.append(bookElement);
    }
  }
});

function addBook() {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;
  const isComplete = document.getElementById("inputBookIsComplete").checked;

  const generatedID = generateId();

  const bookObject = {
    id: generatedID,
    title,
    author,
    year,
    isComplete,
  };

  books.push(bookObject);

  saveData();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = `Penulis: ${bookObject.author}`;

  const textYear = document.createElement("p");
  textYear.innerText = `Tahun: ${bookObject.year}`;

  const buttonComplete = document.createElement("button");
  buttonComplete.classList.add("green");
  buttonComplete.addEventListener("click", () => {
    if (!bookObject.isComplete) addCompleteBook(bookObject.id);
    else undoCompleteBook(bookObject.id);
  });
  buttonComplete.innerText = bookObject.isComplete
    ? "Belum Selesai dibaca"
    : "Selesai di Baca";

  const buttonDelete = document.createElement("button");
  buttonDelete.classList.add("red");
  buttonDelete.addEventListener("click", () => {
    removeBookFromCompleted(bookObject.id);
    alert(`${bookObject.title} berhasil dihapus.`);
  });
  buttonDelete.innerText = "Hapus Buku";

  const action = document.createElement("div");
  action.classList.add("action");
  action.append(buttonComplete, buttonDelete);

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.append(textTitle, textAuthor, textYear, action);

  return container;
}

function generateId() {
  return +new Date();
}

function addCompleteBook(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;

  saveData();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function undoCompleteBook(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  saveData();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function findBook(bookId) {
  for (const book of books) {
    if (book.id === bookId) {
      return book;
    }
  }
  return null;
}

function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  saveData();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

function search() {
  const searchBookTitle = document.getElementById("searchBookTitle").value;

  let itemList = document.querySelectorAll(".book_item");

  itemList.forEach((item) => {
    const title = item.firstChild.textContent.toLowerCase();
    if (title.indexOf(searchBookTitle.toLowerCase()) != -1) {
      item.setAttribute("style", "display: block;");
    } else {
      item.setAttribute("style", "display: none;");
    }
  });
}
