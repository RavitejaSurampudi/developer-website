import React from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { MDXProvider } from '@mdx-js/react';

import Layout from '../components/Layout';
import PageTitle from '../components/PageTitle';
import Video from '../components/Video';
import Step from '../components/Step';
import Steps from '../components/Steps';
import Intro from '../components/Intro';
import SEO from '../components/Seo';
import styles from './GuideTemplate.module.scss';
import CodeSnippet from '../components/CodeSnippet';

const components = {
  Video,
  Step,
  Steps,
  Intro,
  code: (props) => <CodeSnippet {...props} />,
};

const GuideTemplate = ({ data }) => {
  const { mdx } = data;
  const { frontmatter, body } = mdx;
  const { title, description, duration } = frontmatter;

  return (
    <Layout>
      <SEO title={title} description={description} />
      <div className={styles.duration}>{duration}</div>
      <PageTitle>{title}</PageTitle>
      <div className={styles.mdxContainer}>
        <MDXProvider components={components}>
          <MDXRenderer>{body}</MDXRenderer>
        </MDXProvider>
      </div>
    </Layout>
  );
};

GuideTemplate.propTypes = {
  data: PropTypes.object,
};

export const pageQuery = graphql`
  query($path: String!) {
    mdx(frontmatter: { path: { eq: $path } }) {
      body
      frontmatter {
        duration
        path
        title
        description
      }
    }
  }
`;

export default GuideTemplate;
