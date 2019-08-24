const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Book = require("../../models/Book");
// const User = require("../../models/User");
const { check, validationResult } = require("express-validator");

// @route   POST api/books
// @desc    Add a book
// @access  Private
router.post(
  "/",
  [
    auth,
    [
      check("author", "Author name is required")
        .not()
        .isEmpty(),
      check("title", "Title is required")
        .not()
        .isEmpty(),
      check("genre", "Genre is required")
        .not()
        .isEmpty(),
      check("ISBN", "ISBN is required")
        .not()
        .isEmpty(),
      check("category", "Category is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation fails");
      return res.status(400).json({ errors: errors.array() });
    }

    const { author, title, genre, ISBN, image, description } = req.body;

    //Build book object
    const bookfields = {};
    if (author) bookfields.author = author;
    if (title) bookfields.title = title;
    if (genre) bookfields.genre = genre;
    if (ISBN) bookfields.ISBN = ISBN;
    if (image) bookfields.image = image;
    if (description) bookfields.description = description;

    try {
      let book = await Book.findOne({ ISBN });

      //if book found
      if (book) {
        // book = await Book.findOneAndUpdate(
        //   { ISBN },
        //   { $set: bookfields },
        //   { new: true }
        // );
        // return res.json({ msg: "Book Updated" });
        return res.json({ msg: "Book already exists" });
      }

      //If book not found
      book = new Book(bookfields);

      await book.save();

      res.json({ msg: "Book added successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@todo - update a book
// @route   POST api/books/edit
// @desc    Update a book
// @access  Private
router.post(
  "/edit",
  [
    auth,
    [
      check("author", "Author name is required")
        .not()
        .isEmpty(),
      check("title", "Title is required")
        .not()
        .isEmpty(),
      check("genre", "Genre is required")
        .not()
        .isEmpty(),
      check("ISBN", "ISBN is required")
        .not()
        .isEmpty(),
      check("category", "Category is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation fails");
      return res.status(400).json({ errors: errors.array() });
    }

    const { author, title, genre, ISBN, image, description } = req.body;

    //Build book object
    const bookfields = {};
    if (author) bookfields.author = author;
    if (title) bookfields.title = title;
    if (genre) bookfields.genre = genre;
    if (ISBN) bookfields.ISBN = ISBN;
    if (image) bookfields.image = image;
    if (description) bookfields.description = description;

    try {
      let book = await Book.findOne({ ISBN });

      //if book found
      if (book) {
        book = await Book.findOneAndUpdate(
          { ISBN },
          { $set: bookfields },
          { new: true }
        );
        return res.json({ msg: "Book Updated" });
      }

      //If book not found
      // book = new Book(bookfields);

      // await book.save();

      res.status(400).json({ msg: "Server Error" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   GET api/books
// @desc    Get all Books
// @access  Public
router.get("/", async (req, res) => {
  try {
    const books = await Book.find().sort({ date: -1 });

    res.json(books);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/books/:id
// @desc    Get book by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ msg: "Book not found" });
    }

    res.json(book);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/books/:id
// @desc    Delete a book by ID
// @access  Private (accessable for Admin only)
router.delete("/:id", auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ msg: "Book not found" });
    }
    await book.remove();
    res.json({ msg: "Book removed" });
  } catch (err) {
    console.error(err.message);
    if (!err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Book not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   POST api/books/ISBN
// @desc    Search book by ISBN
// @access  Public
router.post(
  "/ISBN",
  [
    check("ISBN", "ISBN is required")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation fails");
      return res.status(400).json({ errors: errors.array() });
    }
    const { ISBN } = req.body;
    try {
      const book = await Book.findOne({ ISBN });
      if (!book) {
        return res.status(404).json({ msg: "No book found" });
      }

      res.json(book);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   POST api/books/search
// @desc    Search Book using Author name or Title
// @access  Public
router.post(
  "/search",
  // [
  //   check("author", "Author name is required")
  //     .not()
  //     .isEmpty(),
  //   check("title", "Title is required")
  //     .not()
  //     .isEmpty()
  // ],
  async (req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   console.log("Validation fails");
    //   return res.status(400).json({ errors: errors.array() });
    // }
    const { author, title } = req.body;
    try {
      if (author || title) {
        const books = await Book.find({ $or: [{ author }, { title }] });
        if (books.length === 0) {
          return res.status(404).json({ msg: "No books found" });
        }

        res.json(books);
      } else {
        return res.status(400).json({ msg: "Please enter author or title" });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   PUT api/books/like/:id
// @desc    Like a book
// @access  Private
router.put("/like/:id", auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    //check if book is already been liked
    if (
      book.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      console.log("Book already liked");
      return res.status(400).json({ msg: "Book already liked" });
    }

    book.likes.unshift({ user: req.user.id });

    await book.save();

    res.json(book.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/books/unlike/:id
// @desc    Unlike a book
// @access  Private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    //check if book is already been liked
    if (
      book.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      console.log("Book has not yet been liked");
      return res.status(400).json({ msg: "Book has not yet been liked" });
    }

    // Get remove index to remove like
    const removeIndex = book.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);

    book.likes.splice(removeIndex, 1);

    await book.save();

    res.json(book.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/books/issue/:id
// @desc    Issue a book
// @access  Private
router.put("/issue/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.issuedBooks.length < 2) {
      const book = await Book.findById(req.params.id);

      // Check if book is already issued
      if (
        book.issuedBy.filter(issued => issued.user.toString() === req.user.id)
          .length > 0
      ) {
        return res.status(400).json({ msg: "Book already issued" });
      }

      // if not issued, issue and push in top of array of book
      book.issuedBy.unshift({ user: req.user.id });

      // also push the book in user collection's issuedBooks field
      user.issuedBooks.unshift({ book });

      await book.save();

      await user.save();

      res.json({
        issuedBooks: user.issuedBooks
        // issuedBy: book.issuedBy
      });
    } else {
      res
        .status(400)
        .json({ msg: "Maximum of 3 books can be issued at a time" });
    }
  } catch (err) {
    console.log("Error in API");
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/books/return/:id
// @desc    Return a book
// @access  Private
router.put("/return/:id", auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    // Check if book is not yet been issued
    if (
      book.issuedBy.filter(issued => issued.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "Book not issued yet" });
    }

    const user = await User.findById(req.user.id);

    // if issued, get remove index
    const removeBookIndex = book.issuedBy
      .map(issued => issued.user.toString())
      .indexOf(req.user.id);

    //get remove user index
    const removeUserIndex = user.issuedBooks
      .map(issuedBook => issuedBook.book.toString())
      .indexOf(req.params.id);

    book.issuedBy.splice(removeBookIndex, 1);
    user.issuedBooks.splice(removeUserIndex, 1);

    await book.save();
    await user.save();

    res.json(book.issuedBy);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
