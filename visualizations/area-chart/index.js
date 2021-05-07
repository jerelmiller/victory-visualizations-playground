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
                  <VictoryGroup>
                    <VictoryArea data={data[0].data} />
                    <VictoryArea
                      data={data[0].data.map((point) => ({
                        ...point,
                        y: point.y / 2,
                      }))}
                    />
                  </VictoryGroup>
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
