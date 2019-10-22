import React, { Component } from 'react';
import { Grid, withStyles } from '@material-ui/core';
import Select from 'react-select';
import { httpClient } from '../utilService';
import { DROPDOWN_QUERY, GRAPH_QUERY } from '../constants';
import moment from 'moment';
import { LineChart } from 'react-easy-chart';
class DashBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            graphData: {
                getMultipleMeasurements: []
            },
            selectedOptions: [],
        }
    }
    componentDidMount() {
        this.getSelectOptions()

    }

    getSelectOptions = async () => {
        let result = await httpClient("/graphql", "POST", { query: DROPDOWN_QUERY, variables: { input: [] } })
        console.log(result)
        this.setState({
            options: result.data && result.data.getMetrics ? result.data.getMetrics.map(x => {
                return { label: x, value: x }
            }) : [],
        }, this.getGraphData)
    }
    getGraphData = async () => {
        let searchObj = { query: GRAPH_QUERY, variables: { input: [] } };
        if (this.state.selectedOptions.length > 0) {
            searchObj.variables.input = this.state.selectedOptions.map(x => {
                return {
                    metricName: x.value, after: moment().subtract(2, "hours").valueOf()
                }
            })
        }

        let result = await httpClient("/graphql", "POST", searchObj);
        this.setState({
            graphData: result.data
        });

        // setInterval(() => {
        //     this.getGraphData()
        // }, 1000)
    }
    render() {
        let { classes } = this.props
        var data = [];
        let graphData = this.state.graphData.getMultipleMeasurements
        for (var i = 0; i < graphData.length; i += 1) {
            var dataSeries = { type: "line" };
            var dataPoints = [];
            for (var j = 0; j < graphData[i].measurements.length; j++) {
                dataPoints.push({
                    x: graphData[i].measurements[j].at,
                    y: graphData[i].measurements[j].value
                });
            }
            dataSeries.dataPoints = dataPoints;
            data.push(dataPoints);
        }
        const options = {
            zoomEnabled: true,
            animationEnabled: true,
            title: {
                text: ""
            },
            axisY: {
                includeZero: false
            },
            data: data  // random data
        }
        console.log(options)
        return (
            <React.Fragment>
                <section className={classes.padding16}>
                    <Grid container spacing={2}>
                        <Grid item lg={8} md={8} sm={12} xs={12}>
                            {this.state.graphData.getMultipleMeasurements.length > 0 && (

                                // <CanvasJSChart options={options}
                                // // onRef={ref => this.chart = ref}
                                // />
                                <LineChart
                                    data={data}
                                    datePattern={'%d-%b-%y %H:%M'}
                                    xType={'time'}
                                    width={500}
                                    height={700}
                                    axisLabels={{ x: 'Hour', y: 'Percentage' }}
                                    interpolate={'cardinal'}

                                />
                            )}
                        </Grid>
                        <Grid item lg={4} md={4} sm={12} xs={12}>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                isClearable={true}
                                isMulti={true}
                                name="color"
                                onChange={(value) => {
                                    this.setState({
                                        selectedOptions: value
                                    }, this.getGraphData)
                                }}
                                options={this.state.options}
                            />
                        </Grid>
                    </Grid>
                </section>
            </React.Fragment>
        );
    }
}

const styles = theme => ({
    padding16: {
        padding: 16
    }
})

export default withStyles(styles)(DashBoard);