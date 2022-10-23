import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Article, PopulatedArticle} from '../article/model';

type ArticleResponse = {
  _id: string;
  dateCreated: string;
  content: string;
  title: string;
  dateModified: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Article object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Article>} article - A article
 * @returns {ArticleResponse} - The article object formatted for the frontend
 */
const constructArticleResponse = (article: HydratedDocument<Article>): ArticleResponse => {
  const articleCopy: PopulatedArticle = {
    ...article.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  return {
    ...articleCopy,
    _id: articleCopy._id.toString(),
    dateCreated: formatDate(article.dateCreated),
    dateModified: formatDate(article.dateModified)
  };
};

export {
  constructArticleResponse
};
