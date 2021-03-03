import {Line} from './BaseCharts'
import axios from 'axios';

let qs = require('qs');
export default {
    extends: Line,
    data() {
        return {
            labels: [],
            datasets: [],
        }
    },
    props: ['dataLabels','datadatasets'],
    watch:{
        dataLabels(e){
            this.drawCanvas();
        },
        datadatasets(e){
            this.drawCanvas();
        }
    },
    mounted() {
      this.drawCanvas();
    },
    methods:{
        drawCanvas(){
            this.renderChart({
                labels: this.dataLabels,
                datasets: [
                    {
                        title: {
                            display: false,
                            text: 'Custom Chart Title'
                        },
                        Legend: {
                            display: false,
                        },
                        label: '',
                        color: '#FFA200',
                        borderColor: '#FFA200',
                        backgroundColor: 'rgba(255,255,255,0)',
                        data: this.datadatasets
                    }
                ]
            }, {
                responsive: false,
                maintainAspectRatio: false,
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
}
