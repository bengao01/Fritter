import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';

// Type definition for Article on the backend
export type Article = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  dateCreated: Date;
  content: string;
  title: string;
  dateModified: Date;
};

export type PopulatedArticle = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  dateCreated: Date;
  content: string;
  title: string;
  dateModified: Date;
};

const ArticleSchema = new Schema<Article>({
  // The date the article was added to Fritter
  dateCreated: {
    type: Date,
    required: true
  },
  // The content of the article
  content: {
    type: String,
    required: true
  },
  // The title of the article
  title: {
    type: String,
    required: true
  },
  // The date the article was modified
  dateModified: {
    type: Date,
    required: true
  }
});

const ArticleModel = model<Article>('Article', ArticleSchema);
export default ArticleModel;
