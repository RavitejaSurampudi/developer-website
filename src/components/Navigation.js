import React, { Fragment, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import cx from 'classnames';
import { BreadcrumbContext } from './BreadcrumbContext';
import FeatherIcon from './FeatherIcon';
import pages from '../data/sidenav.json';
import matchSearchString from '../utils/matchSearchString';

import styles from './Navigation.module.scss';

const iconLibrary = {
  'Collect data': 'upload-cloud',
  'Explore data': 'bar-chart',
  'Build apps': 'box',
  'Automate workflows': 'cpu',
  'Explore docs': 'book-open',
};

const getHighlightedText = (text, highlight) => {
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <span>
      {parts.map((part) =>
        part.toLowerCase() === highlight.toLowerCase() ? <b>{part}</b> : part
      )}
    </span>
  );
};

const NavigationItems = ({
  pages,
  filteredPageNames,
  searchTerm,
  depthLevel = 0,
}) => {
  const crumbs = useContext(BreadcrumbContext).flatMap((x) => x.displayName);
  const isHomePage = crumbs.length === 0 && depthLevel === 0;

  const groupedPages = pages.reduce((groups, page) => {
    const { group = '' } = page;

    return {
      ...groups,
      [group]: [...(groups[group] || []), page],
    };
  }, {});

  console.log(Boolean(filteredPageNames));

  return Object.entries(groupedPages).map(([group, pages]) => {
    const showGroup =
      (group && !Boolean(filteredPageNames)) ||
      (group &&
        filteredPageNames &&
        pages.some((el) => filteredPageNames.includes(el.displayName)));
    return (
      <Fragment key={group}>
        {showGroup && (
          <li className={cx(styles.navLink, styles.groupName)}>{group}</li>
        )}
        {pages.map((page) => {
          const [isExpanded, setIsExpanded] = useState(
            isHomePage || crumbs.includes(page.displayName)
          );

          const isCurrentPage = crumbs[crumbs.length - 1] === page.displayName;
          const headerIcon = depthLevel === 0 && (
            <FeatherIcon
              className={styles.headerIcon}
              name={iconLibrary[page.displayName]}
            />
          );
          const display = filteredPageNames
            ? getHighlightedText(page.displayName, searchTerm)
            : page.displayName;

          return (
            <li
              key={page.displayName}
              data-depth={depthLevel}
              className={cx(
                { [styles.isCurrentPage]: isCurrentPage },
                {
                  [styles.notMatchesFilter]:
                    filteredPageNames &&
                    !filteredPageNames.includes(page.displayName),
                },
                {
                  [styles.matchesFilter]:
                    filteredPageNames &&
                    filteredPageNames.includes(page.displayName),
                },
                { [styles.filterOn]: filteredPageNames }
              )}
            >
              {page.url ? (
                <Link
                  className={cx(
                    { [styles.isCurrentPage]: isCurrentPage },
                    styles.navLink
                  )}
                  to={page.url}
                >
                  <span>
                    {headerIcon}
                    {display}
                  </span>
                  {isCurrentPage && (
                    <FeatherIcon
                      className={styles.currentPageIndicator}
                      name="chevron-right"
                    />
                  )}
                </Link>
              ) : (
                <button
                  type="button"
                  className={styles.navLink}
                  onClick={() => setIsExpanded(!isExpanded)}
                  onKeyPress={() => setIsExpanded(!isExpanded)}
                  tabIndex={0}
                >
                  {depthLevel > 0 && (
                    <FeatherIcon
                      className={cx(
                        { [styles.isExpanded]: isExpanded },
                        styles.nestedChevron
                      )}
                      name="chevron-right"
                    />
                  )}
                  {headerIcon}
                  {display}
                </button>
              )}
              {page.children && (
                <ul
                  className={cx(styles.nestedNav, {
                    [styles.isExpanded]: isExpanded,
                  })}
                >
                  <NavigationItems
                    pages={page.children}
                    filteredPageNames={filteredPageNames}
                    depthLevel={depthLevel + 1}
                    searchTerm={searchTerm}
                  />
                </ul>
              )}
            </li>
          );
        })}
      </Fragment>
    );
  });
};

const filterPageNames = (pages, searchTerm, parent = []) => {
  return [
    ...new Set(
      pages.flatMap((page) => {
        if (page.children) {
          return filterPageNames(page.children, searchTerm, [
            ...parent,
            page.displayName,
          ]);
        } else if (matchSearchString(page.displayName, searchTerm)) {
          return [...parent, page.displayName];
        } else if (parent.some((el) => matchSearchString(el, searchTerm))) {
          return [...parent];
        }
      })
    ),
  ];
};

const Navigation = ({ className, searchTerm }) => {
  const filteredPageNames =
    searchTerm !== '' ? filterPageNames(pages, searchTerm) : undefined;

  return (
    <nav
      className={cx(styles.container, className)}
      role="navigation"
      aria-label="Navigation"
    >
      <ul className={styles.listNav}>
        <NavigationItems
          searchTerm={searchTerm}
          pages={pages}
          filteredPageNames={filteredPageNames}
        />
      </ul>
    </nav>
  );
};

Navigation.propTypes = {
  className: PropTypes.string,
  searchTerm: PropTypes.string,
};

export default Navigation;
