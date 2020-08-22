import * as React from 'react';

export const SocialMetaTags: React.FunctionComponent<Record<string, unknown>> = (): JSX.Element => (
  <>
    <meta name="og:title" content="Mealie.Moe" />
    <meta name="twitter:title" content="Mealie.Moe" />
    <meta name="theme" content="#57D2F9" />
    <meta name="og:type" content="website" />
    <meta name="og:image" content="/images/website-embed-banner.png" />
    <meta name="twitter:image:width" content="1280" />
    <meta name="twitter:image:height" content="640" />
    <meta name="twitter:image:src" content="/images/website-embed-banner.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta
      name="og:description"
      content={
        `Website for discord.gg/anime server. Look through some of the
        frequently asked questions (FAQs) or create a monthly color palette!`
      }
    />
    <meta
      name="twitter:description"
      content={
        `Website for discord.gg/anime server. Look through some of the
        frequently asked questions (FAQs) or create a monthly color palette!`
      }
    />
    <meta
      name="description"
      content={
        `Website for discord.gg/anime server. Look through some of the
        frequently asked questions (FAQs) or create a monthly color palette!`
      }
    />
  </>
);