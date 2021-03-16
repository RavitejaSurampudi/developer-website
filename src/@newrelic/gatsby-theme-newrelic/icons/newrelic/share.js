import React from 'react';
import NewRelicSVG from '../../../../components/NewRelicSVG';

const ShareIcon = (props) => (
  <NewRelicSVG {...props}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </NewRelicSVG>
);

export default ShareIcon;