import { Line } from './BaseCharts'
export default {
    extends: Line,
    props: {
        firstDate: {  // 必须提供字段
            required: true,
            default:false
        },
        labels: {  // 必须提供字段
            required: false,
            default:false
        },
    },
    watch: {
        // 动态加载
        firstDate(curVal, oldVal) {
            const that = this;
            if (curVal) {
                this.firstDate = curVal;
                that.renderChart({
                    datasets: this.firstDate,
                    labels: this.labels,
                    // labels: '',
                }, {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutoutPercentage: 90,//环粗细
                    showTooltips:false,
                    title:false,
                    tooltips:{
                        mode:'index',
                        intersect:false
                    },
                    legend: {
                        position:'bottom',
                        labels: {
                            boxWidth:12,
                            fontSize:10
                        }
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                callback: function (value) {
                                    if (value % 1 === 0) {
                                        return value;
                                    }
                                }
                            }
                        }]
                    }
                })
            }
        },
    },
    mounted() {
        const that = this;
        that.renderChart({
            labels: this.labels,
            datasets:this.firstDate
        }, {
            responsive: true,
            maintainAspectRatio: false,
            cutoutPercentage: 90,//环粗细
            showTooltips:false,
            title:false,
            tooltips:{
                mode:'index',
                intersect:false
            },
            legend: {
                position:'bottom',
                labels: {
                    boxWidth:12,
                    fontSize:10
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        callback: function (value) {
                            if (value % 1 === 0) {
                                return value;
                            }
                        }
                    }
                }]
            }
        })
    }
}