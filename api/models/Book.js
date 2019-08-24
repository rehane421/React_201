const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// authorName,title,thumbnail image,ISBN,Description,available
const BookSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  image: {
    type: String
  },
  author: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String
  },
  ISBN: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  noOfCopies: {
    type: Number,
    default: 1
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      }
    }
  ],
  rating: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      },
      value: {
        type: Number,
        required: true
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      },
      text: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: Date.now()
      }
    }
  ],
  issuedBy: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      }
    },
    {
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Book = mongoose.model("book", BookSchema);
