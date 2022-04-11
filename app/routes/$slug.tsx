import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { gql } from "graphql-request";
import { RichText } from "@graphcms/rich-text-react-renderer";
import type { ElementNode } from "@graphcms/rich-text-types";

import { graphcms } from "~/lib/graphcms.server";

const getArticleQuery = gql`
  query Article($url: String!) {
    article(where: { url: $url }) {
      title
      url
      content {
        ... on ArticleContentRichText {
          json
        }
      }
    }
  }
`;

export const loader: LoaderFunction = async ({ params }) => {
  const { slug } = params;

  const preview = true;

  const API_TOKEN = preview
    ? process.env.GRAPHCMS_DEV_TOKEN
    : process.env.GRAPHCMS_PROD_TOKEN;

  const data = await graphcms.request(
    getArticleQuery,
    {
      url: slug,
    },
    {
      authorization: `Bearer ${API_TOKEN}`,
    }
  );

  return json(data);
};

type Article = {
  title: string;
  content: {
    json: {
      children: ElementNode[];
    };
  };
};

type LoaderData = {
  article: Article;
};

export default function Index() {
  const { article } = useLoaderData<LoaderData>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>{article.title}</h1>
      <RichText content={article.content.json} />
    </div>
  );
}
