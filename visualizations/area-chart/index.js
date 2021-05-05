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
import { VictoryChart, VictoryArea } from 'victory';

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

              const transformedData = data[0].data.map((point) => ({
                ...point,
                x: new Date(point.x).toISOString(),
              }));

              return (
                <div style={{ whiteSpace: 'pre', fontFamily: 'monospace' }}>
                  <VictoryChart height={height} width={width}>
                    <VictoryArea data={transformedData} />
                  </VictoryChart>
                </div>
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
