const mongoose = require('mongoose');
// eslint-disable-next-line node/no-extraneous-require
const slugify = require('slugify');
const validator = require('validator');
const User = require('./userModel');

// schema/model is like a class (table schema)
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      // even runs when we try to update a document, because on update we specified runValidators: true (tourController)
      maxlength: [40, 'A tour name must have less or equal than 40 characters'],
      minlength: [10, 'A tour name must have more or equal than 10 characters'],
      // validate: [validator.isAlpha(), 'Tour name must only contain letters.'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      // accepted values:
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, or difficult.',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10, // 4.6666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      // val = priceDiscount
      validate: {
        validator: function (val) {
          // doesn't work on update
          return val < this.price;
        },
        // ({VALUE}) = (priceDiscount)
        message: 'Discount price ({VALUE}) should be below the regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      // name of the image which will be read from a folder
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    // an array of strings
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      // doesn't show this field to the user
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    // REFERENCGIN GUIDES (users)
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    // when document is toJSON or toObject, include virtuals
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ex: price[lt]=1000
// instead of reading 9 documents, sort the documents and take 3 right away
// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

// get is a getter, virtual is like a field which is calculated off of other fields?
// can't use virtual properties to query because they are not actually part of the database
// ex: can't do select where durationWeeks = x
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Virtual populate (only populate on get one specific tour, not all tours, too big otherwise)
tourSchema.virtual('reviews', {
  ref: 'Review',
  // field in Review model (tour = tour's id)
  foreignField: 'tour',
  // field in current model (tour in Review model is _id in this model)
  localField: '_id',
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create(), add slug, "this" is the current doc
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// TOUR GUIDES EMBEDDING EXAMPLE
// // guide ids on save
// tourSchema.pre('save', async function (next) {
//   // get guides based on passed in IDs in array, returns promises
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);

//   next();
// });

// tourSchema.pre('save', (next) => {
//   console.log('Will save document...');
//   next();
// });

// // doc is the finished document
// tourSchema.post('save', (doc, next) => {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE: 'find' = query middleware. "this" is the current query, not doc
// tourSchema.pre('find', function (next) { --> only works for find()
tourSchema.pre(/^find/, function (next) {
  // --> works if starts with find, ex: findOne(), findById(), etc..
  // get all the tours which are NOT secret, != true
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

// docs = all the documents returned from the query
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took: ${Date.now() - this.start} milliseconds!`);
  next();
});

// AGGREGATION MIDDLEWARE, remove secret tour, "this" = current aggregation object
// tourSchema.pre('aggregate', function (next) {
//   // unshift adds at the begining of the array
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
