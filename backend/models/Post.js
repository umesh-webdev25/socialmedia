import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      trim: true,
      maxlength: [1000, 'Post text must not exceed 1000 characters'],
      default: '',
    },
    image: {
      type: String,
      trim: true,
      default: '',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Post must belong to a user'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// At least one of text or image must be provided
postSchema.pre('validate', function (next) {
  if (!this.text && !this.image) {
    this.invalidate('text', 'A post must have text or an image (or both)');
  }
  next();
});

// Always populate user info by default when querying posts
postSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name email profilePicture bio',
  });
  next();
});

const Post = mongoose.model('Post', postSchema);
export default Post;
