import React from 'react';
import cx from 'classnames';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';

import { CodeBlock } from '@newrelic/gatsby-theme-newrelic';
import ReferenceExample from '../components/ReferenceExample';
import PageLayout from '../components/PageLayout';
import Markdown from '../components/Markdown';
import MethodReference from '../components/MethodReference';
import SEO from '../components/Seo';
import PropList from '../components/PropList';
import styles from './ComponentReferenceTemplate.module.scss';
import templateStyles from './ReferenceTemplate.module.scss';
import IconGallery from '../components/IconGallery';
import TypeDefReference from '../components/TypeDefReference';

const chartStyles = {
  height: '200px',
};

const previewStyles = {
  AreaChart: chartStyles,
  BarChart: chartStyles,
  BillboardChart: chartStyles,
  FunnelChart: chartStyles,
  HeatmapChart: chartStyles,
  HistogramChart: chartStyles,
  JsonChart: chartStyles,
  LineChart: chartStyles,
  PieChart: chartStyles,
  ScatterChart: chartStyles,
  SparklineChart: chartStyles,
  StackedBarChart: chartStyles,
  TableChart: chartStyles,
  Spinner: {
    height: '16px',
  },
};

const ComponentReferenceTemplate = ({ data }) => {
  const {
    newRelicSdkComponent: {
      name,
      description: componentDescription,
      usage,
      examples,
      methods,
      typeDefs,
      propTypes,
    },
  } = data;

  return (
    <>
      <SEO title={name} />
      <PageLayout type={PageLayout.TYPE.SINGLE_COLUMN}>
        <PageLayout.Header title={name} />
        <PageLayout.Content>
          <section className={cx(templateStyles.section, 'intro-text')}>
            <Markdown source={componentDescription} />
          </section>

          <section className={templateStyles.section}>
            <h2 className={templateStyles.sectionTitle}>Usage</h2>
            <CodeBlock language="js">{usage}</CodeBlock>
          </section>

          {examples.length > 0 && (
            <section className={templateStyles.section}>
              <div>
                <h2 className={templateStyles.sectionTitle}>Examples</h2>
                {examples.map((example, i) => (
                  <ReferenceExample
                    key={i}
                    useToastManager={name === 'Toast'}
                    className={styles.componentExample}
                    example={example}
                    previewStyle={previewStyles[name]}
                  />
                ))}
              </div>
            </section>
          )}

          {name === 'Icon' && (
            <section className={templateStyles.section}>
              <IconGallery />
            </section>
          )}

          <section className={templateStyles.section}>
            <h2 className={templateStyles.sectionTitle}>Props</h2>
            <PropList propTypes={propTypes} />
          </section>

          {methods.length > 0 && (
            <section className={templateStyles.section}>
              <h2 className={templateStyles.sectionTitle}>Methods</h2>
              {methods.map((method, i) => (
                <MethodReference
                  key={i}
                  method={method}
                  className={styles.section}
                />
              ))}
            </section>
          )}

          {typeDefs.length > 0 && (
            <section className={templateStyles.section}>
              <h2 className={templateStyles.sectionTitle}>Type definitions</h2>
              {typeDefs.map((typeDef, i) => (
                <TypeDefReference key={i} typeDef={typeDef} />
              ))}
            </section>
          )}
        </PageLayout.Content>
      </PageLayout>
    </>
  );
};

ComponentReferenceTemplate.propTypes = {
  data: PropTypes.object,
};

export const pageQuery = graphql`
  query($slug: String!) {
    newRelicSdkComponent(fields: { slug: { eq: $slug } }) {
      name
      description
      usage
      propTypes {
        ...PropList_propTypes
      }
      examples {
        ...ReferenceExample_example
      }
      methods {
        ...MethodReference_method
      }
      typeDefs {
        ...TypeDefReference_typeDef
      }
    }
  }
`;

export default ComponentReferenceTemplate;
