import React from 'react';
import PropTypes from 'prop-types';
import {
  AutoSizer,
  Card,
  CardBody,
  HeadingText,
  NrqlQuery,
  Spinner,
} from 'nr1';
import { VictoryGroup, VictoryChart, VictoryArea, VictoryAxis } from 'victory';
import { format } from 'date-fns';
import theme from '../../src/theme';

const sortByAverage = (a, b) => {
  const aTotal = a.data.reduce((count, point) => count + point.y, 0);
  const bTotal = b.data.reduce((count, point) => count + point.y, 0);

  const aAverage = aTotal / a.data.length;
  const bAverage = bTotal / b.data.length;

  return bAverage - aAverage;
};

export default class AreaChartVisualization extends React.Component {
  static propTypes = {
    query: PropTypes.string,
    accountId: PropTypes.number,
  };

  render() {
    const { query, accountId } = this.props;

    if (!query || !accountId) {
      return <EmptyState />;
    }

    return (
      <AutoSizer>
        {({ width, height }) => (
          <NrqlQuery
            query={query}
            accountId={accountId}
            pollInterval={NrqlQuery.AUTO_POLL_INTERVAL}
          >
            {({ data, loading, error }) => {
              if (loading) {
                return <Spinner />;
              }

              if (error) {
                return <ErrorState />;
              }

              return (
                <VictoryChart
                  height={height}
                  width={width}
                  theme={theme}
                  scale={{ x: 'time' }}
                >
                  {data.sort(sortByAverage).map(({ data, metadata }) => (
                    <VictoryArea
                      key={metadata.id}
                      name={metadata.name}
                      data={data}
                      style={{ data: { fill: metadata.color } }}
                    />
                  ))}
                  <VictoryAxis
                    tickCount={10}
                    tickFormat={(date) => format(date, 'hh:mm aa')}
                  />
                  <VictoryAxis dependentAxis />
                </VictoryChart>
              );
            }}
          </NrqlQuery>
        )}
      </AutoSizer>
    );
  }
}

const EmptyState = () => (
  <Card className="EmptyState">
    <CardBody className="EmptyState-cardBody">
      <HeadingText
        spacingType={[HeadingText.SPACING_TYPE.LARGE]}
        type={HeadingText.TYPE.HEADING_3}
      >
        Please provide at least one NRQL query & account ID pair
      </HeadingText>
      <HeadingText
        spacingType={[HeadingText.SPACING_TYPE.MEDIUM]}
        type={HeadingText.TYPE.HEADING_4}
      >
        An example NRQL query you can try is:
      </HeadingText>
      <code>FROM NrUsage SELECT sum(usage) FACET metric SINCE 1 week ago</code>
    </CardBody>
  </Card>
);

const ErrorState = () => (
  <Card className="ErrorState">
    <CardBody className="ErrorState-cardBody">
      <HeadingText
        className="ErrorState-headingText"
        spacingType={[HeadingText.SPACING_TYPE.LARGE]}
        type={HeadingText.TYPE.HEADING_3}
      >
        Oops! Something went wrong.
      </HeadingText>
    </CardBody>
  </Card>
);
