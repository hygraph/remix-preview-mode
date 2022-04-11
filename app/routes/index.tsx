import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { gql } from "graphql-request";

import { graphcms } from "~/lib/graphcms.server";

const allArticlesQuery = gql`
  {
    articles {
      id
      title
      url
      createdAt
    }
  }
`;

export const loader: LoaderFunction = async () => {
  const preview = true;

  const API_TOKEN = preview
    ? process.env.GRAPHCMS_DEV_TOKEN
    : process.env.GRAPHCMS_PROD_TOKEN;

  const data = await graphcms.request(
    allArticlesQuery,
    {},
    {
      authorization: `Bearer ${API_TOKEN}`,
    }
  );

  return json({
    articles: data.articles,
  });
};

type Article = {
  id: string;
  title: string;
  url: string;
  createdAt: string;
};

type LoaderData = {
  articles: Article[];
};

export default function Index() {
  const { articles } = useLoaderData<LoaderData>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix</h1>
      <ul>
        {articles.map((article) => (
          <li key={article.id}>
            <a href={`/${article.url}`}>{article.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
