import {ArticleCategoryEnum} from "~/utils/enums/article-category.enum";

export interface ArticleCategory {
    id: string,
    name: string,
    type: ArticleCategoryEnum,
    createdAt: Date,
    updatedAt: Date
}
