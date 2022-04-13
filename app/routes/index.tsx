import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { gql } from "graphql-request";
import { PreviewBanner } from "~/components/preview-banner";

import { graphcms } from "~/lib/graphcms.server";
import { isPreviewMode } from "~/utils/preview-mode.server";

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

export const loader: LoaderFunction = async ({ request }) => {
  const preview = await isPreviewMode(request);

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
    ...data,
    isInPreview: preview,
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
  isInPreview: boolean;
};

export default function Index() {
  const { articles, isInPreview } = useLoaderData<LoaderData>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      {isInPreview && <PreviewBanner />}

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
