import { gql } from "graphql-request";
import { json, redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";

import { graphcms } from "~/lib/graphcms.server";
import { previewModeCookie } from "~/utils/preview-mode.server";
import { parseCookie } from "~/utils/parse-cookie.server";

const getArticleQuery = gql`
  query Article($url: String!) {
    article(where: { url: $url }) {
      url
    }
  }
`;

export const loader: LoaderFunction = async ({ request }) => {
  const requestUrl = new URL(request?.url);
  const secret = requestUrl?.searchParams?.get("secret");
  const slug = requestUrl?.searchParams?.get("slug");

  // This secret should only be known to this API route and the CMS
  if (secret !== process.env.PREVIEW_SECRET || !slug) {
    return json({ message: "Invalid token" }, { status: 401 });
  }

  // Check if the provided `slug` exists
  const data = await graphcms.request(
    getArticleQuery,
    {
      url: slug,
    },
    {
      authorization: `Bearer ${process.env.GRAPHCMS_DEV_TOKEN}`,
    }
  );

  // If the slug doesn't exist prevent preview from being enabled
  if (!data.article) {
    return json({ message: "Invalid slug" }, { status: 401 });
  }

  // Enable preview by setting a cookie
  const cookie = await parseCookie(request, previewModeCookie);
  cookie.stage = "draft";

  return redirect(`/${data.article.url}`, {
    headers: {
      "Set-Cookie": await previewModeCookie.serialize(cookie),
    },
  });
};
